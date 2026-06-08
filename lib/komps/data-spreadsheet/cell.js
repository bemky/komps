/**
 * The cell element for a {@link DataSpreadsheet}. A focusable identity/styling shell
 * over {@link DataGridCell}: selection painting, editing, and keyboard navigation are
 * all driven by the {@link DataSpreadsheet} controller against the row/column model
 * (off-screen cells don't exist, which is why the Spreadsheet's cell-centric model
 * doesn't fit). Its main role is a distinct tag for the CSS selectors / `cellSelector`;
 * it also reflects the per-record `readonly` state, which is a property of the cell's
 * binding rather than the selection (see {@link DataSpreadsheetCell#bind}).
 *
 * @class DataSpreadsheetCell
 * @extends DataGridCell
 */
import DataGridCell from '../data-grid/cell.js'

export default class DataSpreadsheetCell extends DataGridCell {
    static tagName = 'komp-data-spreadsheet-cell'

    /**
     * Bind this (recycled) cell to a record and reflect the per-record `readonly` state.
     *
     * `readonly` is a function of `(record, column)`, so it only changes when a pooled
     * cell is re-pointed at a different record — i.e. here, once per record entering the
     * virtual window — not on every selection change. `super.bind` resets the class list
     * to `column.class`, so the `readonly` class is (re)applied afterwards. Only
     * otherwise-editable columns reflect the gate; an `editable: false` column is already
     * non-editable on its own.
     */
    bind(row, column, record) {
        super.bind(row, column, record)
        const readonly = this.grid.isRecordReadonly(record) && column.editable !== false
        this.classList.toggle('readonly', readonly)
    }

    static { if (!customElements.get(this.tagName)) customElements.define(this.tagName, this) }
}
