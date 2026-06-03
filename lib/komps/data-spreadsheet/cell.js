/**
 * The cell element for a {@link DataSpreadsheet} — extends {@link DataGridCell} with
 * focusability and an edit hook. It deliberately stays thin: selection painting,
 * editing, and keyboard navigation are driven by the {@link DataSpreadsheet}
 * controller against the row/column model, because off-screen cells don't exist
 * (the windowing constraint that makes the Spreadsheet's cell-centric model unfit).
 *
 * @class DataSpreadsheetCell
 * @extends DataGridCell
 */
import DataGridCell from '../data-grid/cell.js'

export default class DataSpreadsheetCell extends DataGridCell {
    static tagName = 'komp-data-spreadsheet-cell'

    bind(row, column, record) {
        super.bind(row, column, record)
        // Focusable so it can receive keyboard navigation / start edits.
        this.tabIndex = 0
        return this
    }

    /** Begin editing (or toggling) this cell — delegated to the grid controller. */
    activate(options = {}) {
        return this.grid && this.grid.activateCell(this, options)
    }

    static { if (!customElements.get(this.tagName)) customElements.define(this.tagName, this) }
}
