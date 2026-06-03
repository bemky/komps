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
        if (column.class) setAttribute(this, column.class)
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
            content(this, column.renderContent(this.record, this))
        }
        return this
    }

    /** Wipe all per-binding state so the pooled element is clean for reuse. */
    reset() {
        this.row = null
        this.column = null
        this.record = null
        this.rowIndex = null
        this.cellIndex = null
        this.className = ''
        this.removeAttribute('style')
        this.replaceChildren()
        return this
    }

    static { if (!customElements.get(this.tagName)) customElements.define(this.tagName, this) }
}
