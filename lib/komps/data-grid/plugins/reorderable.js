/**
 * A plugin to make a {@link DataGrid} (and its subclasses, e.g. {@link DataSpreadsheet})
 * **reorderable** along columns and/or rows.
 *
 * @function Plugin/DataGridReorderable
 * @mixin
 *
 * @param {Object} [options={}] - Options added to the grid
 * @param {boolean|string|Array} [options.reorder=true] - Enable reordering rows and columns. Pass `"columns"` or `"rows"` (or an array) for one axis; `false` to disable.
 *
 * @fires Plugin/DataGridReorderable#columnReordered
 * @fires Plugin/DataGridReorderable#rowReordered
 *
 * @example <caption>JS</caption>
 * import DataSpreadsheet from 'komps/komps/data-spreadsheet.js'
 * import { reorderable } from 'komps/komps/data-grid/plugins.js'
 * DataSpreadsheet.include(reorderable)
 * new DataSpreadsheet({
 *     reorder: ['columns'],    // columns only; omit for both
 *     data: [...],
 *     columns: [
 *         { header: 'Name', width: 200 },
 *         { header: 'Pinned', width: 80, reorder: false } // opt a column out
 *     ]
 * })
 */

/**
 * Fired after a column reorder finishes (on pointerup).
 * @event Plugin/DataGridReorderable#columnReordered
 * @type {Object}
 * @property {number} fromIndex - original column index
 * @property {number} toIndex - new column index
 */

/**
 * Fired after a row reorder finishes (on pointerup).
 * @event Plugin/DataGridReorderable#rowReordered
 * @type {Object}
 * @property {number} fromIndex - original row index
 * @property {number} toIndex - new row index
 */

import { createElement } from 'dolla'

const clamp = (v, lo, hi) => Math.max(lo, Math.min(v, hi))

export default function (proto) {
    // assignableAttributes is shared up the prototype chain; clone before adding so a
    // plugin included on a subclass (DataSpreadsheet) doesn't leak `reorder` onto DataGrid.
    if (!Object.hasOwn(this, 'assignableAttributes')) {
        this.assignableAttributes = { ...this.assignableAttributes }
    }
    this.assignableAttributes.reorder = { type: ['boolean', 'string', 'array'], default: true, null: false }

    this.events.push('columnReordered', 'rowReordered')

    /* -----------------------------------------------------------------
       Setup — normalize `reorder` before the scaffold renders, then wire
       hover handles for the enabled axes.
    ----------------------------------------------------------------- */
    const initializeWas = proto.initialize
    proto.initialize = async function (...args) {
        if (this.reorder === true) this.reorder = ['columns', 'rows']
        if (this.reorder === false) this.reorder = []
        const result = await initializeWas.call(this, ...args)
        this.setupReorderHandles()
        return result
    }

    // Back-reference the column on its header cell so we can resolve it on hover.
    const renderHeaderWas = proto.renderHeader
    proto.renderHeader = function (...args) {
        const header = renderHeaderWas.call(this, ...args)
        if (this.reorder.includes('columns')) {
            this.columns.forEach(column => {
                if (column.reorder !== false && column.headerCell) column.headerCell.column = column
            })
        }
        return header
    }

    proto.setupReorderHandles = function () {
        if (this.reorder.includes('columns')) {
            this.addEventListenerFor(`${this.localName}-header-cell`, 'mouseover', e => this.showColumnReorderHandle(e.delegateTarget))
        }
        if (this.reorder.includes('rows')) {
            this.addEventListenerFor(`${this.localName}-cell`, 'mouseover', e => this.showRowReorderHandle(e.delegateTarget))
        }
        this.addEventListener('mouseleave', () => this.clearReorderHandles())
        this.addEventListener('scroll', () => this.clearReorderHandles())
    }

    /* -----------------------------------------------------------------
       Hover grip — a drag handle revealed on the axis's first cell (header
       cell for a column, leading cell for a row), rendered into the grid's
       overlay layer and positioned from the live cell rect.
    ----------------------------------------------------------------- */
    proto.reorderLayer = function () {
        if (this.utilities) return this.utilities
        if (!this._reorderLayer) this._reorderLayer = this.appendChild(createElement(`${this.localName}-reorder-layer`))
        return this._reorderLayer
    }

    proto.clearReorderHandles = function () {
        if (this.reordering) return
        this.querySelectorAll(`${this.localName}-reorder-handle`).forEach(h => h.remove())
        this._columnReorderIndex = this._rowReorderIndex = null
    }

    proto.makeReorderHandle = function (axis, index, cell) {
        const handle = createElement(`${this.localName}-reorder-handle`, { class: axis, content: { tag: 'grip' } })
        handle.addEventListener('mousedown', e => { e.stopPropagation(); e.preventDefault() })
        handle.addEventListener('pointerdown', e => {
            e.stopPropagation()
            this.beginReorder({ axis, index, cell, pointerId: e.pointerId, startX: e.clientX, startY: e.clientY })
        })
        this.positionReorderHandle(handle, cell, axis)
        return handle
    }

    /** Column grip → top-centre of the header cell; row grip → left-centre of the first cell. */
    proto.positionReorderHandle = function (handle, cell, axis) {
        const grid = this.getBoundingClientRect()
        const r = cell.getBoundingClientRect()
        const ox = grid.left + this.clientLeft - this.scrollLeft
        const oy = grid.top + this.clientTop - this.scrollTop
        if (axis === 'column') {
            handle.style.left = (r.left + r.width / 2 - ox) + 'px'
            handle.style.top = (r.top - oy) + 'px'
        } else {
            handle.style.left = (r.left - ox) + 'px'
            handle.style.top = (r.top + r.height / 2 - oy) + 'px'
        }
    }

    proto.showColumnReorderHandle = function (headerCell) {
        if (this.reordering || !headerCell) return
        const column = headerCell.column
        if (!column || column.reorder === false) { this.clearReorderHandles(); return }
        if (this._columnReorderIndex === column.index) return
        this.clearReorderHandles()
        this.reorderLayer().appendChild(this.makeReorderHandle('column', column.index, headerCell))
        this._columnReorderIndex = column.index
    }

    proto.showRowReorderHandle = function (cell) {
        if (this.reordering || !cell) return
        if (cell.cellIndex !== 0 || cell.rowIndex == null) { this.clearReorderHandles(); return }
        if (this._rowReorderIndex === cell.rowIndex) return
        this.clearReorderHandles()
        this.reorderLayer().appendChild(this.makeReorderHandle('row', cell.rowIndex, cell))
        this._rowReorderIndex = cell.rowIndex
    }

    /* -----------------------------------------------------------------
       Drag — ghost + placement line follow the pointer; the model is only
       mutated on release. Auto-scrolls while the pointer hugs an edge.
    ----------------------------------------------------------------- */
    proto.beginReorder = function ({ axis, index, cell, pointerId, startX, startY }) {
        const isCol = axis === 'column'
        const geom = isCol ? this.columnGeometry : this.rowGeometry
        const headerH = this.body.offsetTop
        const size = geom.sizeAt(index)
        const layer = this.reorderLayer()

        this.clearReorderHandles()
        this.clearResizeHandles?.() // if the resizable plugin is also on, drop its grips too
        this.reordering = true
        this.classList.add('reordering', `reordering-${axis}`)
        this.clearSelection?.() // selection is indexed by row/col; order is about to change

        // Frozen columns are a leading block; keep a dragged column on its own side of it.
        let frozenCount = 0
        if (isCol) while (frozenCount < this.columns.length && this.columns[frozenCount].frozen) frozenCount++
        const draggedFrozen = isCol && index < frozenCount
        const lo = isCol ? (draggedFrozen ? 0 : frozenCount) : 0
        const hi = isCol ? (draggedFrozen ? frozenCount : this.columns.length) : this.rows.length

        const ghost = createElement(`${this.localName}-reorder-ghost`, { class: axis })
        const line = createElement(`${this.localName}-placement-indicator`, { class: axis })
        if (isCol) {
            const full = headerH + this.rowGeometry.extent
            ghost.style.cssText = `width:${size}px;top:0;height:${full}px`
            line.style.cssText = `top:0;height:${full}px`
        } else {
            const full = this.columnGeometry.extent
            ghost.style.cssText = `height:${size}px;left:0;width:${full}px`
            line.style.cssText = `left:0;width:${full}px`
        }
        layer.append(ghost, line)

        let dropBoundary = index
        let last = { clientX: startX, clientY: startY }

        const update = ev => {
            last = ev
            const grid = this.getBoundingClientRect()
            const ox = grid.left + this.clientLeft - this.scrollLeft
            const oy = grid.top + this.clientTop - this.scrollTop
            if (isCol) {
                const cx = ev.clientX - ox
                ghost.style.left = clamp(cx - size / 2, 0, Math.max(0, this.columnGeometry.extent - size)) + 'px'
                const i = this.columnGeometry.indexAtOffset(clamp(cx, 0, Math.max(0, this.columnGeometry.extent - 1)))
                const mid = this.columnGeometry.offsetAt(i) + this.columnGeometry.sizeAt(i) / 2
                dropBoundary = clamp(cx < mid ? i : i + 1, lo, hi)
                line.style.left = this.columnGeometry.offsetAt(dropBoundary) + 'px'
            } else {
                const cy = ev.clientY - oy - headerH
                ghost.style.top = (headerH + clamp(cy - size / 2, 0, Math.max(0, this.rowGeometry.extent - size))) + 'px'
                const i = this.rowGeometry.indexAtOffset(clamp(cy, 0, Math.max(0, this.rowGeometry.extent - 1)))
                const mid = this.rowGeometry.offsetAt(i) + this.rowGeometry.sizeAt(i) / 2
                dropBoundary = clamp(cy < mid ? i : i + 1, lo, hi)
                line.style.top = (headerH + this.rowGeometry.offsetAt(dropBoundary)) + 'px'
            }
        }
        update(last)

        // Auto-scroll while the pointer hugs an edge (pointermove alone won't fire when still).
        const EDGE = 36, STEP = 14
        const tick = () => {
            if (!this.reordering) return
            const grid = this.getBoundingClientRect()
            let moved = false
            if (isCol) {
                if (last.clientX > grid.right - EDGE) { this.scrollLeft += STEP; moved = true }
                else if (last.clientX < grid.left + EDGE) { this.scrollLeft -= STEP; moved = true }
            } else {
                if (last.clientY > grid.bottom - EDGE) { this.scrollTop += STEP; moved = true }
                else if (last.clientY < grid.top + headerH + EDGE) { this.scrollTop -= STEP; moved = true }
            }
            if (moved) update(last)
            this._reorderRAF = requestAnimationFrame(tick)
        }
        this._reorderRAF = requestAnimationFrame(tick)

        const move = ev => update(ev)
        const finish = ev => {
            cancelAnimationFrame(this._reorderRAF)
            this.removeEventListener('pointermove', move)
            ghost.remove(); line.remove()
            // dropBoundary is an insertion point in the *current* array; account for the
            // gap left by removing the dragged element when it lands after its old slot.
            if (dropBoundary !== index && dropBoundary !== index + 1) {
                const toIndex = dropBoundary > index ? dropBoundary - 1 : dropBoundary
                if (isCol) this.moveColumn(index, toIndex)
                else this.moveRow(index, toIndex)
            }
            setTimeout(() => {
                this.reordering = false
                this.classList.remove('reordering', `reordering-${axis}`)
                try { this.releasePointerCapture(ev.pointerId) } catch { /* already released */ }
                if (cell) (isCol ? this.showColumnReorderHandle(cell) : this.showRowReorderHandle(cell))
            })
        }

        try { this.setPointerCapture(pointerId) } catch { /* non-pointer fallback */ }
        this.addEventListener('pointermove', move)
        this.addEventListener('pointerup', finish, { once: true })
    }

    /* -----------------------------------------------------------------
       Commit — one splice + re-index + geometry rebuild per reorder
    ----------------------------------------------------------------- */
    proto.moveColumn = function (from, to) {
        if (from === to) return
        const [col] = this.columns.splice(from, 1)
        this.columns.splice(to, 0, col)
        this.columns.forEach((c, i) => { c.index = i })
        this.columnGeometry.rebuildFrom(0)
        this.applyColumnGeometry()  // re-publish --dg-template-columns / --dg-width (new order)
        this.relayoutColumns()      // re-place header + mounted cells via grid-column
        this.trigger('columnReordered', { detail: { fromIndex: from, toIndex: to } })
    }

    /** Re-place every header + mounted cell on its column's new track. */
    proto.relayoutColumns = function () {
        this.columns.forEach(column => {
            const track = String(column.index + 1)
            const left = column.frozen ? this.columnGeometry.frozenOffsetAt(column.index) : null
            if (column.headerCell) {
                column.headerCell.style.gridColumn = track
                if (left != null) column.headerCell.style.left = left + 'px'
            }
            column.cells.forEach(cell => {
                cell.style.gridColumn = track
                cell.cellIndex = column.index
                if (left != null) cell.style.left = left + 'px'
            })
        })
        // Re-order the DOM to match the new column order — otherwise grid's sparse
        // auto-placement wraps out-of-order cells onto an implicit second row.
        this.header.append(...this.columns.map(c => c.headerCell).filter(Boolean))
        for (const row of this.mounted) {
            row.element.append(...this.columns.map(c => row.cellOf(c)).filter(Boolean))
        }
    }

    proto.moveRow = function (from, to) {
        if (from === to) return
        const [row] = this.rows.splice(from, 1)
        this.rows.splice(to, 0, row)
        this.reindexRows(0)
        this.rowGeometry.rebuildFrom(0) // heights travel with controllers; just re-sum
        // The mounted set may now hold the wrong rows for the viewport — rebuild the window.
        for (const r of Array.from(this.mounted)) r.unmount()
        this.updateWindow()
        this.trigger('rowReordered', { detail: { fromIndex: from, toIndex: to } })
    }

    /* -----------------------------------------------------------------
       Styles — grip + drag ghost + placement line (mirrors the table plugin)
    ----------------------------------------------------------------- */
    if (!Array.isArray(this.style)) this.style = [this.style]
    this.style.push(function () { return `
        ${this.tagName} {
            --reorder-color: #1a73e8;
        }
        ${this.tagName}.reordering {
            cursor: grabbing !important;
            user-select: none;
            -webkit-user-select: none;
        }
        ${this.tagName}.reordering ${this.tagName}-header-cell,
        ${this.tagName}.reordering ${this.tagName}-cell {
            cursor: grabbing !important;
        }

        ${this.tagName}-reorder-layer {
            position: absolute;
            inset-block-start: 0;
            inset-inline-start: 0;
            inline-size: 0;
            block-size: 0;
            z-index: 100;
        }

        ${this.tagName}-reorder-handle {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: auto;
            cursor: grab;
        }
        ${this.tagName}-reorder-handle.column { transform: translateX(-50%); padding-block: 2px; }
        ${this.tagName}-reorder-handle.row { transform: translateY(-50%); padding-inline: 2px; }
        ${this.tagName}-reorder-handle > grip {
            display: block;
            opacity: 0.55;
            background-color: color-mix(in oklab, var(--reorder-color) 55%, #777);
            -webkit-mask: radial-gradient(circle 1px at center, #000 99%, transparent) 0 0 / 4px 4px;
                    mask: radial-gradient(circle 1px at center, #000 99%, transparent) 0 0 / 4px 4px;
        }
        ${this.tagName}-reorder-handle.column > grip { inline-size: 22px; block-size: 8px; }
        ${this.tagName}-reorder-handle.row > grip { inline-size: 8px; block-size: 22px; }
        ${this.tagName}-reorder-handle:hover > grip { opacity: 1; }

        ${this.tagName}-reorder-ghost {
            position: absolute;
            pointer-events: none;
            background: color-mix(in oklab, var(--reorder-color) 16%, transparent);
            outline: 1px solid var(--reorder-color);
            z-index: 1;
        }
        ${this.tagName}-placement-indicator {
            position: absolute;
            pointer-events: none;
            background: var(--reorder-color);
            z-index: 2;
        }
        ${this.tagName}-placement-indicator.column { inline-size: 2px; transform: translateX(-1px); }
        ${this.tagName}-placement-indicator.row { block-size: 2px; transform: translateY(-1px); }
    `})
}
