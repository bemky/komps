/**
 * The cell element for a {@link DataSpreadsheet}. A focusable identity/styling shell
 * over {@link DataGridCell}: selection painting, editing, and keyboard navigation are
 * all driven by the {@link DataSpreadsheet} controller against the row/column model
 * (off-screen cells don't exist, which is why the Spreadsheet's cell-centric model
 * doesn't fit). Its only role is a distinct tag for the CSS selectors / `cellSelector`.
 *
 * @class DataSpreadsheetCell
 * @extends DataGridCell
 */
import DataGridCell from '../data-grid/cell.js'

export default class DataSpreadsheetCell extends DataGridCell {
    static tagName = 'komp-data-spreadsheet-cell'

    static { if (!customElements.get(this.tagName)) customElements.define(this.tagName, this) }
}
