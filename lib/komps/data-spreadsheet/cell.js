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

    // NB: `tabIndex` can't be set in the constructor — a custom element created via
    // createElement may not gain attributes during construction (it would throw), and
    // tabIndex reflects to the `tabindex` attribute. It's set once at creation by
    // DataSpreadsheet#acquireCell instead; pooled cells keep it across recycling.

    static { if (!customElements.get(this.tagName)) customElements.define(this.tagName, this) }
}
