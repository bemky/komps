/**
 * Dropdown column for {@link DataSpreadsheet}. Edits with a bound `<select>`
 * (Input.create) built from `options`.
 *
 * @class SelectColumn
 * @extends DataSpreadsheetColumn
 *
 * @param {Object} [options={}]
 * @param {Array} [options.options=[]] - allowed values; strings, or `{ value, label }`
 */
import DataSpreadsheetColumn from '../column.js'

export default class SelectColumn extends DataSpreadsheetColumn {
    static inputType = 'select'

    constructor(options = {}) {
        super(options)
        this.options = options.options || []
    }

    optionList() {
        return this.options.map(o => (o != null && typeof o === 'object') ? o : { value: o, label: o })
    }

    /** Feed the option list to Input.create's SelectInput (as [value, label] pairs). */
    input(record, options = {}) {
        return super.input(record, Object.assign({
            options: this.optionList().map(o => [o.value, o.label])
        }, options))
    }

    parsePaste(value) {
        // accept a label or a value; map back to a known value when possible
        const match = this.optionList().find(o => o.value === value || o.label === value)
        return match ? match.value : value
    }
}
