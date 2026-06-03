/**
 * Numeric column for {@link DataSpreadsheet}. Edits with a numeric input that dumps
 * to a float; parses pasted values as floats; renders right-aligned via `number-cell`.
 *
 * @class NumberColumn
 * @extends DataSpreadsheetColumn
 */
import DataSpreadsheetColumn from '../column.js'

function toNumber(v) {
    if (v == null || v === '') return null
    if (typeof v === 'number') return v
    const n = String(v).includes('.') ? parseFloat(v) : parseInt(v, 10)
    return Number.isNaN(n) ? null : n
}

export default class NumberColumn extends DataSpreadsheetColumn {
    static inputType = 'number'
    static inputOptions = { dump: toNumber }

    constructor(options = {}) {
        super(options)
        this.class = [this.class, 'number-cell'].filter(Boolean).join(' ')
    }

    parsePaste(value) { return toNumber(value) }
}
