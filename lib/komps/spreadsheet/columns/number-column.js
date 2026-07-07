/**
 * Numeric column for {@link Spreadsheet}. Edits with a numeric input that dumps
 * to a float; parses pasted values as floats; renders right-aligned via `number-cell`.
 *
 * @class NumberColumn
 * @extends SpreadsheetColumn
 */
import SpreadsheetColumn from '../column.js'

function toNumber(v) {
    if (v == null || v === '') return null
    if (typeof v === 'number') return v
    const n = String(v).includes('.') ? parseFloat(v) : parseInt(v, 10)
    return Number.isNaN(n) ? null : n
}

export default class NumberColumn extends SpreadsheetColumn {
    static inputType = 'number'
    static inputOptions = { dump: toNumber }

    constructor(options = {}) {
        super(options)
        this.class = [this.class, 'number-cell'].filter(Boolean).join(' ')
    }

    parsePaste(value) { return toNumber(value) }
}
