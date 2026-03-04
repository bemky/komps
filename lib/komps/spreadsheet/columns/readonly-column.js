import TableColumn from '../column.js';

/**
 * A {@link SpreadsheetColumn} that renders read-only cells. Paste is disabled.
 *
 * @class ReadonlyColumn
 * @extends SpreadsheetColumn
 */
export default class ReadonlyColumn extends TableColumn {
    paste = undefined;
    
    renderCell (record, options={}) {
        options.readonly = true;
        return super.renderCell(record, options)
    }
}