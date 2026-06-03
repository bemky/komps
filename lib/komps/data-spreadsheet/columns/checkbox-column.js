/**
 * Boolean column for {@link DataSpreadsheet}. Renders a checkbox reflecting the
 * value; activating the cell (click / Enter / Space) toggles it instead of opening
 * a text editor.
 *
 * @class CheckboxColumn
 * @extends DataSpreadsheetColumn
 */
import DataSpreadsheetColumn from '../column.js'

export default class CheckboxColumn extends DataSpreadsheetColumn {
    constructor(options = {}) {
        super(options)
        this.toggleable = true
        this.class = [this.class, 'checkbox-cell'].filter(Boolean).join(' ')
    }

    renderContent(record) {
        return { tag: 'input', type: 'checkbox', checked: !!this.valueOf(record), tabindex: '-1' }
    }

    serialize(record) { return this.valueOf(record) ? 'true' : 'false' }

    parse(value) {
        return value === true || value === 'true' || value === '1' || value === 1
    }

    /** Flip the record's boolean. Called by the cell on activate. */
    toggle(record) {
        if (this.editable && this.attribute != null) {
            record[this.attribute] = !this.valueOf(record)
        }
    }

    editInput() { return null }
}
