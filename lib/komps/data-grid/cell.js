/**
 * The cell element for a {@link DataGrid}.
 *
 * Unlike the row element (a dumb pooled container), the cell *is* a custom element:
 * it renders content and is the addressable unit a future editable Spreadsheet will
 * give behavior. It carries no model state of its own beyond back-references set at
 * mount — positioning and lifecycle are driven by its {@link DataGridRow} controller
 * and the grid's windower. Instances are pooled and recycled, so {@link DataGridCell#reset}
 * must fully clear prior state on rebind.
 *
 * @class DataGridCell
 * @extends HTMLElement
 */

import { content, setAttribute } from 'dolla'

export default class DataGridCell extends HTMLElement {
    static tagName = 'komp-data-grid-cell'

    /**
     * Bind this (possibly recycled) cell to a row/column/record and render it.
     * @returns {DataGridCell} this
     */
    bind(row, column, record) {
        this.row = row
        this.column = column
        this.record = record
        this.rowIndex = row.index
        this.cellIndex = column.index

        this.setAttribute('role', 'gridcell')
        this.style.gridColumn = String(column.index + 1) // 1-based grid line
        if (column.class) setAttribute(this, 'class', column.class)
        if (column.frozen) {
            this.classList.add('frozen')
            const left = this.grid && this.grid.columnGeometry.frozenOffsetAt(column.index)
            if (left != null) this.style.left = left + 'px'
        }
        this.render()
        return this
    }

    get grid() { return this.column?.grid }

    render() {
        const column = this.column
        const subRecords = column.unnest(this.record)
        if (subRecords) {
            // unnest: stack sub-record renders as one measured unit (read-only v1).
            content(this, {
                tag: `${this.localName}-group`,
                content: subRecords.map(sub => ({
                    tag: `${this.localName}-subrow`,
                    content: column.renderContent(sub, this)
                }))
            })
        } else {
            // A `record` resolver may map the row's record to a sub-record (and may be
            // async); content() awaits the thenable. No resolver → fully synchronous.
            // Resolved (memoized) via the row so render shares the cell's one instance.
            const resolved = this.row.resolvedRecordFor(column)
            content(this, typeof resolved?.then === 'function'
                ? resolved.then(rec => column.renderContent(rec, this))
                : column.renderContent(resolved, this))
        }
        return this
    }

    /**
     * Detach this cell: de-register from its column, wipe all per-binding state so
     * the pooled element is clean, and return it to the grid's cell pool. Mirrors
     * {@link DataGridRow#unmount}.
     */
    unmount() {
        const grid = this.grid
        if (this.column) this.column.cells.delete(this)
        this.row = null
        this.column = null
        this.record = null
        this.rowIndex = null
        this.cellIndex = null
        this.className = ''
        this.removeAttribute('style')
        this.replaceChildren()
        if (grid) grid._cellPool.push(this)
        return this
    }

    static { if (!customElements.get(this.tagName)) customElements.define(this.tagName, this) }
}
