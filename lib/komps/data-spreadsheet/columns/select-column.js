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
import Select from '../../select.js';

export default class SelectColumn extends DataSpreadsheetColumn {
    static inputType = 'select'

    constructor(options = {}) {
        super(options)
        this.options = options.options || []
    }

    optionList() {
        return this.options.map(o => (o != null && typeof o === 'object') ? o : { value: o, label: o })
    }

    /** Build a {@link Select} editor; `session.value` (type-to-edit) seeds the typeahead. */
    input (record, { value } = {}) {
        const select = new Select(Object.assign({
            autofocus: true,
            target: record,
            attribute: this.attribute,
            options: this.options
        }, this.inputOptions))
        if (value) {
            select.typeahead(value)
        }
        select.addEventListener('connected', () => select.dropdown.show())
        return select
    }

    parsePaste(value) {
        // accept a label or a value; map back to a known value when possible
        const match = this.optionList().find(o => o.value === value || o.label === value)
        return match ? match.value : value
    }
}
