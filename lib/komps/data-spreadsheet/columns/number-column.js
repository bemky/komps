/**
 * Numeric column for {@link DataSpreadsheet}. Edits with a numeric input and parses
 * pasted/typed values as floats; renders right-aligned via the `number-cell` class.
 *
 * @class NumberColumn
 * @extends DataSpreadsheetColumn
 */
import DataSpreadsheetColumn from '../column.js'

export default class NumberColumn extends DataSpreadsheetColumn {
    constructor(options = {}) {
        super(Object.assign({ input: 'number' }, options))
        this.class = [this.class, 'number-cell'].filter(Boolean).join(' ')
    }

    parse(value) {
        if (value == null || value === '') return null
        const n = parseFloat(value)
        return Number.isNaN(n) ? null : n
    }
}
