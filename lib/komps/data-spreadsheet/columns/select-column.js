/**
 * Dropdown column for {@link DataSpreadsheet}. Edits with a native `<select>` built
 * from `options`.
 *
 * @class SelectColumn
 * @extends DataSpreadsheetColumn
 *
 * @param {Object} [options={}]
 * @param {Array} [options.options=[]] - allowed values; strings, or `{ value, label }`
 */
import DataSpreadsheetColumn from '../column.js'

export default class SelectColumn extends DataSpreadsheetColumn {
    constructor(options = {}) {
        super(options)
        this.options = options.options || []
    }

    optionList() {
        return this.options.map(o => (o != null && typeof o === 'object') ? o : { value: o, label: o })
    }

    editInput(record) {
        if (!this.editable) return null
        const select = document.createElement('select')
        const current = this.rawValue(record)
        for (const { value, label } of this.optionList()) {
            const opt = document.createElement('option')
            opt.value = value == null ? '' : value
            opt.textContent = label == null ? '' : label
            if (value === current) opt.selected = true
            select.appendChild(opt)
        }
        return select
    }

    parse(value) {
        // accept a label or a value; map back to a known value when possible
        const match = this.optionList().find(o => o.value === value || o.label === value)
        return match ? match.value : value
    }
}
