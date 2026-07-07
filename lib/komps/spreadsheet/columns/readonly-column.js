/**
 * Non-editable column for {@link Spreadsheet}: cells display but can't be
 * activated, pasted into, or cleared.
 *
 * @class ReadonlyColumn
 * @extends SpreadsheetColumn
 */
import SpreadsheetColumn from '../column.js'

export default class ReadonlyColumn extends SpreadsheetColumn {
    constructor(options = {}) {
        super(Object.assign({ editable: false }, options))
    }

    input() { return null }
    paste() {}
    clear() {}
    accepts() { return false }
}
