/**
 * Non-editable column for {@link DataSpreadsheet}: cells display but can't be
 * activated, pasted into, or cleared.
 *
 * @class ReadonlyColumn
 * @extends DataSpreadsheetColumn
 */
import DataSpreadsheetColumn from '../column.js'

export default class ReadonlyColumn extends DataSpreadsheetColumn {
    constructor(options = {}) {
        super(Object.assign({ editable: false }, options))
    }

    editInput() { return null }
    write() {}
    clear() {}
    accepts() { return false }
}
