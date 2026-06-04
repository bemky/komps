/**
 * A plugin to make a {@link DataGrid} (and its subclasses, e.g. {@link DataSpreadsheet})
 * **resizable** along columns and/or rows.
 *
 * This is the **virtualized counterpart** to `table/plugins/resizable.js`: it shares the
 * UI (a hover grip on the dividing edge, a thin drag-indicator line, the `col-resize` /
 * `row-resize` cursors and `--select-color` accent) but is rewritten against the grid's
 * geometry model rather than the DOM. Off-screen cells don't exist, so resizing mutates
 * the column/row **controllers** (`column.width` / `row.height`) and re-publishes geometry
 * once, instead of walking `.selected` cells or per-cell `grid-column` placement.
 *
 * **Cheap drag.** Only the drag-indicator moves while dragging — rows are *not* reflowed
 * and `rowGeometry` is *not* invalidated on every pointermove. The single geometry rebuild
 * (and, for rows, the height applied to the live element) happens once on `pointerup`.
 *
 * Columns flow through `columnGeometry` → `--dg-template-columns` (header + every row
 * inherit it), so a width change is a single republish. Rows own their measured height on
 * the controller; a manual resize sets `row.height` (flagged so the windower's measure pass
 * doesn't reclaim it) and applies it to the mounted element.
 *
 * @function Plugin/DataGridResizable
 * @mixin
 *
 * @param {Object} [options={}] - Options added to the grid
 * @param {boolean|string|Array} [options.resize=true] - Enable resizing rows and columns. Pass `"columns"` or `"rows"` (or an array) to enable just one axis; `false` to disable.
 * @param {number} [options.resizeMin=24] - minimum size (px) an axis element can be dragged to
 *
 * @fires Plugin/DataGridResizable#columnResized
 * @fires Plugin/DataGridResizable#rowResized
 *
 * @example <caption>JS</caption>
 * import DataSpreadsheet from 'komps/komps/data-spreadsheet.js'
 * import { resizable } from 'komps/komps/data-grid/plugins.js'
 * DataSpreadsheet.include(resizable)
 * new DataSpreadsheet({
 *     resize: ['columns'],     // columns only; omit for both
 *     data: [...],
 *     columns: [
 *         { header: 'Name', width: 200 },
 *         { header: 'Locked', width: 80, resize: false } // opt a column out
 *     ]
 * })
 */

/**
 * Fired after a column resize finishes (on pointerup).
 * @event Plugin/DataGridResizable#columnResized
 * @type {Object}
 * @property {DataGridColumn} column - the resized column
 * @property {number} width - the new width in px
 */

/**
 * Fired after a row resize finishes (on pointerup).
 * @event Plugin/DataGridResizable#rowResized
 * @type {Object}
 * @property {DataGridRow} row - the resized row
 * @property {number} height - the new height in px
 */

import { createElement } from 'dolla'

function normalizeResize(resize) {
    if (resize === true) return ['columns', 'rows']
    if (resize === false || resize == null) return []
    if (typeof resize === 'string') return [resize]
    return resize
}

export default function (proto) {
    // assignableAttributes is shared up the prototype chain; clone before adding so a
    // plugin included on a subclass (DataSpreadsheet) doesn't leak `resize` onto DataGrid.
    if (!Object.hasOwn(this, 'assignableAttributes')) {
        this.assignableAttributes = { ...this.assignableAttributes }
    }
    this.assignableAttributes.resize = { type: ['boolean', 'string', 'array'], default: true, null: false }
    this.assignableAttributes.resizeMin = { type: 'number', default: 24, null: false }

    this.events.push('columnResized', 'rowResized')

    /* -----------------------------------------------------------------
       Setup — normalize `resize` before the scaffold renders, then wire
       hover handles for the enabled axes.
    ----------------------------------------------------------------- */
    const initializeWas = proto.initialize
    proto.initialize = async function (...args) {
        this.resize = normalizeResize(this.resize)
        const result = await initializeWas.call(this, ...args)
        this.setupResizeHandles()
        return result
    }

    // Tag header cells so we can resolve their column on hover and style the cursor.
    const renderHeaderWas = proto.renderHeader
    proto.renderHeader = function (...args) {
        const header = renderHeaderWas.call(this, ...args)
        if (this.resize.includes('columns')) {
            this.columns.forEach(column => {
                if (column.resize !== false && column.headerCell) {
                    column.headerCell.column = column
                    column.headerCell.classList.add('resizable-column')
                }
            })
        }
        return header
    }

    // Newly mounted rows are sized + positioned before the windower's measure pass; apply
    // any manual height here so measure() reads the forced height (offsetHeight) and leaves
    // it alone instead of reclaiming the content height.
    const syncMountedWas = proto.syncMounted
    proto.syncMounted = function (...args) {
        syncMountedWas.apply(this, args)
        this.applyResizedRowHeights()
    }

    proto.setupResizeHandles = function () {
        if (this.resize.includes('columns')) {
            // The column's "first cell" is its header cell — reveal the grip there.
            this.addEventListenerFor(`${this.localName}-header-cell`, 'mouseover', e => this.showColumnHandle(e.delegateTarget))
        }
        if (this.resize.includes('rows')) {
            // The row's "first cell" is its leading (index 0) cell — reveal the grip there.
            this.addEventListenerFor(`${this.localName}-cell`, 'mouseover', e => this.showRowHandle(e.delegateTarget))
        }
        // Drop a stale grip when the pointer leaves the grid or the content scrolls under it.
        this.addEventListener('mouseleave', () => this.clearResizeHandles())
        this.addEventListener('scroll', () => this.clearResizeHandles())
    }

    /* -----------------------------------------------------------------
       Hover grips — transient, one per axis at a time, appended *into* the
       triggering cell so the hitbox is confined to that cell and tracks it
       (including frozen/sticky cells) on scroll. CSS pins them to the edge.
    ----------------------------------------------------------------- */
    proto.clearResizeHandles = function () {
        if (this.resizing) return
        this.querySelectorAll(`${this.localName}-resize-handle`).forEach(h => h.remove())
        this._columnHandleIndex = this._rowHandleIndex = null
    }

    proto.makeHandle = function (axis, index, onDown) {
        const handle = createElement(`${this.localName}-resize-handle`, { class: axis, content: { tag: 'grip' } })
        // Keep the cell's own mousedown (selection) from firing when grabbing the grip.
        handle.addEventListener('mousedown', e => { e.stopPropagation(); e.preventDefault() })
        handle.addEventListener('pointerdown', e => { e.stopPropagation(); onDown(e, index) })
        return handle
    }

    proto.showColumnHandle = function (headerCell) {
        if (this.resizing || !headerCell) return
        const column = headerCell.column
        if (!column || column.resize === false) { this.clearResizeHandles(); return }
        if (this._columnHandleIndex === column.index) return // already showing
        this.clearResizeHandles()
        headerCell.appendChild(this.makeHandle('column', column.index, (e, i) => this.startColumnResize(e, i)))
        this._columnHandleIndex = column.index
    }

    proto.showRowHandle = function (cell) {
        if (this.resizing || !cell) return
        // Only the row's first cell carries the grip; moving onto any other cell drops it.
        if (cell.cellIndex !== 0 || cell.rowIndex == null) { this.clearResizeHandles(); return }
        if (this._rowHandleIndex === cell.rowIndex) return // already showing for this row
        this.clearResizeHandles()
        cell.appendChild(this.makeHandle('row', cell.rowIndex, (e, i) => this.startRowResize(e, i)))
        this._rowHandleIndex = cell.rowIndex
    }

    /* -----------------------------------------------------------------
       Drag — only the indicator moves; the single reflow lands on pointerup
    ----------------------------------------------------------------- */
    proto.startColumnResize = function (e, index) {
        if (e.button != null && e.button !== 0) return
        this.beginResize({
            axis: 'column', index, pointerId: e.pointerId,
            startPos: e.clientX, clientProp: 'clientX',
            startSize: this.columnGeometry.sizeAt(index),
            commit: size => this.resizeColumn(index, size)
        })
    }

    proto.startRowResize = function (e, index) {
        if (e.button != null && e.button !== 0) return
        this.beginResize({
            axis: 'row', index, pointerId: e.pointerId,
            startPos: e.clientY, clientProp: 'clientY',
            startSize: this.rowGeometry.sizeAt(index),
            commit: size => this.resizeRow(index, size)
        })
    }

    proto.beginResize = function ({ axis, index, pointerId, startPos, clientProp, startSize, commit }) {
        const isCol = axis === 'column'
        const geom = isCol ? this.columnGeometry : this.rowGeometry
        const base = geom.offsetAt(index)
        const min = this.resizeMin

        this.resizing = true
        this.clearResizeHandles()
        this.classList.add(`resizing-${axis}`)

        // A line in body space at the moving edge. For columns it also covers the sticky
        // header (top = -header height) so the divider reads top to bottom.
        const indicator = createElement(`${this.localName}-drag-indicator`, { class: axis })
        if (isCol) {
            indicator.style.top = (-this.body.offsetTop) + 'px'
            indicator.style.height = (this.body.offsetTop + this.rowGeometry.extent) + 'px'
            indicator.style.left = (base + startSize) + 'px'
        } else {
            indicator.style.left = '0'
            indicator.style.width = this.columnGeometry.extent + 'px'
            indicator.style.top = (base + startSize) + 'px'
        }
        this.body.appendChild(indicator)

        let size = startSize
        const move = ev => {
            size = Math.max(min, startSize + (ev[clientProp] - startPos))
            indicator.style[isCol ? 'left' : 'top'] = (base + size) + 'px'
        }
        const finish = ev => {
            this.removeEventListener('pointermove', move)
            indicator.remove()
            commit(Math.round(size))
            // Defer clearing `resizing` to the end of the event stack so the synthetic
            // click/selection on this pointerup doesn't fire a fresh hover/select.
            setTimeout(() => {
                this.resizing = false
                this.classList.remove(`resizing-${axis}`)
                try { this.releasePointerCapture(ev.pointerId) } catch { /* already released */ }
            })
        }

        try { this.setPointerCapture(pointerId) } catch { /* non-pointer fallback */ }
        this.addEventListener('pointermove', move)
        this.addEventListener('pointerup', finish, { once: true })
    }

    /* -----------------------------------------------------------------
       Commit — one geometry rebuild + republish per resize
    ----------------------------------------------------------------- */
    proto.resizeColumn = function (index, width) {
        const column = this.columns[index]
        if (!column) return
        column.width = width
        this.columnGeometry.rebuildFrom(index)
        this.applyColumnGeometry()   // re-publish --dg-template-columns / --dg-width (header + rows inherit)
        this.refreshFrozenColumns()  // sticky lefts of later frozen columns shift with the new width
        this.sizeBody()
        this.paintSelection?.()      // DataSpreadsheet: keep the range box aligned to the new geometry
        this.trigger('columnResized', { detail: { column, width } })
    }

    proto.resizeRow = function (index, height) {
        const row = this.rows[index]
        if (!row) return
        row.height = height
        row._resizedHeight = true
        this.rowGeometry.rebuildFrom(index)
        this.applyResizedRowHeights() // force the live element to the new height now
        this.reflow()                 // reposition mounted rows + resize body + re-window
        this.paintSelection?.()
        this.trigger('rowResized', { detail: { row, height } })
    }

    /** Re-pin the sticky `left` of frozen columns after a width change ahead of them. */
    proto.refreshFrozenColumns = function () {
        this.columns.forEach(column => {
            if (!column.frozen) return
            const left = this.columnGeometry.frozenOffsetAt(column.index)
            if (left == null) return
            if (column.headerCell) column.headerCell.style.left = left + 'px'
            column.cells.forEach(cell => { cell.style.left = left + 'px' })
        })
    }

    /**
     * Pin manually-resized rows to their controller height on their live element. The
     * forced `height` makes `offsetHeight` equal `row.height`, so the windower's measure
     * pass is a no-op for these rows (auto rows keep measuring naturally).
     */
    proto.applyResizedRowHeights = function () {
        if (!this.resize.includes('rows')) return
        for (const row of this.mounted) {
            if (row._resizedHeight && row.element) row.element.style.height = row.height + 'px'
        }
    }

    /* -----------------------------------------------------------------
       Styles — mirrors table/plugins/resizable.js (grip + indicator + cursors)
    ----------------------------------------------------------------- */
    if (!Array.isArray(this.style)) this.style = [this.style]
    this.style.push(function () { return `
        ${this.tagName} {
            --select-color: #1a73e8;
            --resize-handle-size: 9px;
        }
        ${this.tagName}.resizing-column,
        ${this.tagName}.resizing-row {
            user-select: none;
            -webkit-user-select: none;
        }
        ${this.tagName}.resizing-column,
        ${this.tagName}.resizing-column ${this.tagName}-header-cell {
            cursor: col-resize !important;
        }
        ${this.tagName}.resizing-row,
        ${this.tagName}.resizing-row ${this.tagName}-cell {
            cursor: row-resize !important;
        }

        /* Cells host the grips (absolute children); make them a containing block.
           Frozen cells are already sticky-positioned, so leave those alone. */
        ${this.tagName}-cell:not(.frozen),
        ${this.tagName}-header-cell:not(.frozen) {
            position: relative;
        }

        ${this.tagName}-resize-handle {
            position: absolute;
            z-index: 40;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: auto;
        }
        /* Column grip: pinned to the cell's trailing edge; hitbox = the grip. */
        ${this.tagName}-resize-handle.column {
            inset-block: 0;
            inset-inline-end: 0;
            inline-size: var(--resize-handle-size);
            cursor: col-resize;
        }
        /* Row grip: pinned to the (first) cell's bottom edge; spans just that cell. */
        ${this.tagName}-resize-handle.row {
            inset-inline: 0;
            inset-block-end: 0;
            block-size: var(--resize-handle-size);
            cursor: row-resize;
        }
        /* Double-line grip in the accent colour (mirrors the previous spreadsheet). */
        ${this.tagName}-resize-handle > grip {
            display: block;
            opacity: 0.8;
        }
        ${this.tagName}-resize-handle.column > grip {
            inline-size: 4px;
            block-size: 55%;
            max-block-size: 1.3em;
            border-inline: 2px solid var(--select-color);
        }
        ${this.tagName}-resize-handle.row > grip {
            block-size: 4px;
            inline-size: 55%;
            max-inline-size: 1.3em;
            border-block: 2px solid var(--select-color);
        }
        ${this.tagName}-resize-handle:hover > grip,
        ${this.tagName}.resizing-column ${this.tagName}-resize-handle.column > grip,
        ${this.tagName}.resizing-row ${this.tagName}-resize-handle.row > grip {
            opacity: 1;
        }

        ${this.tagName}-drag-indicator {
            position: absolute;
            z-index: 50;
            pointer-events: none;
            background: var(--select-color);
        }
        ${this.tagName}-drag-indicator.column { inline-size: 2px; transform: translateX(-50%); }
        ${this.tagName}-drag-indicator.row { block-size: 2px; transform: translateY(-50%); }
    `})
}
