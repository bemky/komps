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
       Hover grips — transient, revealed on the axis's *first cell* (header cell
       for a column, leading cell for a row). Both the leading and trailing edge
       get a grip so the user sees either side is grabbable. Rendered into the
       grid's overlay layer so they aren't clipped by the cells' overflow:hidden
       and can straddle the dividing edge; positioned from the live cell rect
       (which already reflects frozen/sticky offsets), with clear-on-scroll
       keeping them aligned.
    ----------------------------------------------------------------- */
    /** The overlay above the header/frozen z-stack — DataSpreadsheet's `utilities`, or our own. */
    proto.resizeLayer = function () {
        if (this.utilities) return this.utilities
        if (!this._resizeLayer) this._resizeLayer = this.appendChild(createElement(`${this.localName}-resize-layer`))
        return this._resizeLayer
    }

    proto.clearResizeHandles = function () {
        if (this.resizing) return
        this.querySelectorAll(`${this.localName}-resize-handle`).forEach(h => h.remove())
        this._columnHandleIndex = this._rowHandleIndex = null
    }

    /**
     * Create a grip on one edge of `cell` and drop it in the overlay. `edge` is the
     * cell's leading (`start`) or trailing (`end`) divider; `targetIndex` is the
     * column/row that grip resizes (each divider resizes the element to its left/top).
     */
    proto.addEdgeHandle = function (layer, cell, axis, edge, targetIndex) {
        const handle = createElement(`${this.localName}-resize-handle`, { class: `${axis} ${edge}`, content: { tag: 'grip' } })
        // The grip sits above the cells, so selection never sees these — but guard anyway.
        handle.addEventListener('mousedown', e => { e.stopPropagation(); e.preventDefault() })
        handle.addEventListener('pointerdown', e => {
            e.stopPropagation()
            if (axis === 'column') this.startColumnResize(e, targetIndex, cell)
            else this.startRowResize(e, targetIndex, cell)
        })
        this.positionHandle(handle, cell, axis, edge)
        layer.appendChild(handle)
        return handle
    }

    /** Place `handle` on `cell`'s leading/trailing edge in overlay (scroll-content) space. */
    proto.positionHandle = function (handle, cell, axis, edge) {
        const grid = this.getBoundingClientRect()
        const r = cell.getBoundingClientRect()
        const ox = grid.left + this.clientLeft - this.scrollLeft // viewport x of the content origin
        const oy = grid.top + this.clientTop - this.scrollTop
        if (axis === 'column') {
            handle.style.left = ((edge === 'start' ? r.left : r.right) - ox) + 'px'
            handle.style.top = (r.top - oy) + 'px'
            handle.style.height = r.height + 'px'
        } else {
            handle.style.left = (r.left - ox) + 'px'
            handle.style.top = ((edge === 'start' ? r.top : r.bottom) - oy) + 'px'
            handle.style.width = r.width + 'px'
        }
    }

    proto.showColumnHandle = function (headerCell) {
        if (this.resizing || !headerCell) return
        const column = headerCell.column
        if (!column || column.resize === false) { this.clearResizeHandles(); return }
        if (this._columnHandleIndex === column.index) return // already showing
        this.clearResizeHandles()
        const layer = this.resizeLayer()
        // Trailing grip resizes this column; leading grip resizes the previous one (same
        // shared divider), so a column is grabbable from either of its two edges.
        this.addEdgeHandle(layer, headerCell, 'column', 'end', column.index)
        const prev = this.columns[column.index - 1]
        if (prev && prev.resize !== false) this.addEdgeHandle(layer, headerCell, 'column', 'start', prev.index)
        this._columnHandleIndex = column.index
    }

    proto.showRowHandle = function (cell) {
        if (this.resizing || !cell) return
        // Only the row's first cell carries the grips; moving onto any other cell drops them.
        if (cell.cellIndex !== 0 || cell.rowIndex == null) { this.clearResizeHandles(); return }
        if (this._rowHandleIndex === cell.rowIndex) return // already showing for this row
        this.clearResizeHandles()
        const layer = this.resizeLayer()
        this.addEdgeHandle(layer, cell, 'row', 'end', cell.rowIndex)
        if (cell.rowIndex > 0) this.addEdgeHandle(layer, cell, 'row', 'start', cell.rowIndex - 1)
        this._rowHandleIndex = cell.rowIndex
    }

    /* -----------------------------------------------------------------
       Drag — only the indicator moves; the single reflow lands on pointerup
    ----------------------------------------------------------------- */
    proto.startColumnResize = function (e, index, cell) {
        if (e.button != null && e.button !== 0) return
        this.beginResize({
            axis: 'column', index, cell, pointerId: e.pointerId,
            startPos: e.clientX, clientProp: 'clientX',
            startSize: this.columnGeometry.sizeAt(index),
            commit: size => this.resizeColumn(index, size)
        })
    }

    proto.startRowResize = function (e, index, cell) {
        if (e.button != null && e.button !== 0) return
        this.beginResize({
            axis: 'row', index, cell, pointerId: e.pointerId,
            startPos: e.clientY, clientProp: 'clientY',
            startSize: this.rowGeometry.sizeAt(index),
            commit: size => this.resizeRow(index, size)
        })
    }

    proto.beginResize = function ({ axis, index, cell, pointerId, startPos, clientProp, startSize, commit }) {
        const isCol = axis === 'column'
        const geom = isCol ? this.columnGeometry : this.rowGeometry
        const base = geom.offsetAt(index)
        const min = this.resizeMin

        // Hide the hover grips for the duration of the drag (only the indicator moves);
        // they're restored at their new positions on release. Clear before flipping
        // `resizing`, since clearResizeHandles is a no-op while resizing.
        this.clearResizeHandles()
        this.resizing = true
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
                // Restore the grips on the (now resized) anchor cell so they sit on the new edges.
                if (cell) (isCol ? this.showColumnHandle(cell) : this.showRowHandle(cell))
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
            --handle-color: hsla(0, 0%, 0%, 0.2);
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

        /* Fallback overlay for a plain DataGrid (DataSpreadsheet supplies its own utilities
           layer). A zero-size, absolutely-positioned anchor above the header/frozen z-stack. */
        ${this.tagName}-resize-layer {
            position: absolute;
            inset-block-start: 0;
            inset-inline-start: 0;
            inline-size: 0;
            block-size: 0;
            z-index: 100;
        }

        ${this.tagName}-resize-handle {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: auto;
        }
        /* Column grip: centered on the cell's trailing edge; hitbox = the grip width. */
        ${this.tagName}-resize-handle.column {
            inline-size: var(--resize-handle-size);
            transform: translateX(-50%);
            cursor: col-resize;
        }
        /* Row grip: centered on the (first) cell's bottom edge; spans just that cell. */
        ${this.tagName}-resize-handle.row {
            block-size: var(--resize-handle-size);
            transform: translateY(-50%);
            cursor: row-resize;
        }
        /* Double-line grip in the accent colour (mirrors the previous spreadsheet). */
        ${this.tagName}-resize-handle > grip {
            display: block;
        }
        ${this.tagName}-resize-handle > grip:hover {
            border-color: var(--select-color);
        }
        ${this.tagName}-resize-handle.column > grip {
            inline-size: 4px;
            block-size: 55%;
            max-block-size: 1.3em;
            border-inline: 2px solid var(--handle-color);
        }
        ${this.tagName}-resize-handle.row > grip {
            block-size: 4px;
            inline-size: 55%;
            max-inline-size: 1.3em;
            border-block: 2px solid var(--handle-color);
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
