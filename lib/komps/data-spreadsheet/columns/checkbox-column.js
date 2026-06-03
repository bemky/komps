/**
 * Boolean column for {@link DataSpreadsheet}. Renders a checkbox reflecting the
 * value; activating the cell (click / Enter / type) toggles it inline instead of
 * opening a floating editor.
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
        return { tag: 'input', type: 'checkbox', checked: !!(record && record[this.attribute]), tabindex: '-1' }
    }

    valueFor(record) { return record && record[this.attribute] ? 'true' : 'false' }

    parsePaste(value) {
        return value === true || value === 'true' || value === '1' || value === 1
    }

    /** Flip the record's boolean — called by the grid on activate (toggleable). */
    toggle(record) {
        if (this.editable && this.attribute != null) {
            record[this.attribute] = !record[this.attribute]
        }
    }

    input() { return null } // toggles inline; no editor floater
}
