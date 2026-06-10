/**
 * Boolean column for {@link DataSpreadsheet}. Renders a **bound** checkbox (via
 * {@link Input}) reflecting the value; activating the cell (click / Enter / type) toggles
 * it inline instead of opening a floating editor.
 *
 * Binding through {@link Input} (rather than a static checkbox) means the column works for a
 * plain boolean attribute *and* for any value the binding understands — e.g. a record whose
 * attribute is a reactive State: the bound checkbox reads it via `== true` (coercing the
 * State by `valueOf`), writes through the record's setter, and reflects external changes
 * reactively.
 *
 * @class CheckboxColumn
 * @extends DataSpreadsheetColumn
 */
import DataSpreadsheetColumn from '../column.js'
import Input from '../../input.js'

export default class CheckboxColumn extends DataSpreadsheetColumn {
    /** Input kind passed to `Input.create`. */
    static inputType = 'checkbox'

    constructor(options = {}) {
        super(options)
        this.toggleable = true
        this.class = [this.class, 'checkbox-cell'].filter(Boolean).join(' ')
    }

    renderContent(record) {
        return Input.create(this.constructor.inputType, Object.assign({
            target: record,
            attribute: this.attribute,
            tabindex: -1
        }, this.inputOptions))
    }

    valueFor(record) { return record?.[this.attribute] == true ? 'true' : 'false' }

    parsePaste(value) {
        return value === true || value === 'true' || value === '1' || value === 1
    }

    clear(record) {
        if (this.attribute != null) record[this.attribute] = false
    }

    /**
     * Flip the value on activate (toggleable). Reads via `== true` so a bound value (e.g. a
     * State, whose getter returns the object) coerces by `valueOf` rather than reading as a
     * truthy object; the assignment routes through the record's setter.
     */
    toggle(record) {
        if (this.editable && this.attribute != null) {
            record[this.attribute] = !(record[this.attribute] == true)
        }
    }

    input() { return null } // toggles inline; no editor floater
}
