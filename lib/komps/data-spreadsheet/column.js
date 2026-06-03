/**
 * Column controller for a {@link DataSpreadsheet} — extends {@link DataGridColumn}
 * with an **editing API**.
 *
 * Key difference from `SpreadsheetColumn`: the editing methods are **record-based**,
 * not cell-based. In a virtualized grid the cell for a given record may not be
 * mounted (off-screen), so copy/paste/clear must operate on the `record` directly;
 * `valueFor`/`parse`/`write`/`clear` take a record, and `editInput` takes a record.
 * (Spreadsheet's `copy(cell)`/`paste(cell, v)`/`input(record, cell, opts)` reach
 * through the live cell — which a windowed grid can't guarantee exists.)
 *
 * @class DataSpreadsheetColumn
 * @extends DataGridColumn
 *
 * @param {Object} [options={}]
 * @param {string}  [options.attribute] - record key this column reads/writes
 * @param {boolean} [options.editable=true] - whether cells in this column can be edited/pasted into
 * @param {string}  [options.input='text'] - native input `type` used for editing
 */

import DataGridColumn from '../data-grid/column.js'
import { isFunction } from '../../support.js'

export default class DataSpreadsheetColumn extends DataGridColumn {
    constructor(options = {}) {
        super(options)
        if (this.editable === undefined) this.editable = true
        if (this.input === undefined) this.input = 'text'
    }

    // renderContent is inherited from DataGridColumn (attribute → record[attribute]);
    // dolla renders null/undefined as nothing, so no spreadsheet-specific override.

    /** The raw stored value for a record (what editing starts from / parses back into). */
    rawValue(record) {
        return this.attribute != null && record != null ? record[this.attribute] : null
    }

    /**
     * Serialized copy value (a string). Overrides {@link DataGridColumn#valueFor} to
     * serialize the *raw* value (round-trippable through paste) rather than the rendered
     * display.
     */
    valueFor(record) {
        if (isFunction(this.value)) return String(this.value(record, this) ?? '')
        const v = this.rawValue(record)
        return v == null ? '' : String(v)
    }

    /** Parse a pasted/typed string into the stored value. Override per type. */
    parse(value) { return value }

    /** Write a (parsed) value onto the record. */
    write(record, value) {
        if (this.attribute != null) record[this.attribute] = this.parse(value)
    }

    /** Clear the record's value. */
    clear(record) {
        if (this.attribute != null) record[this.attribute] = null
    }

    /** MIME types this column accepts on paste. */
    static pasteAccepts = ['text/plain']
    accepts(type = 'text/plain') {
        return this.editable && this.constructor.pasteAccepts.some(p => type.match(new RegExp(p)))
    }

    /**
     * Build the native edit control for a record, pre-filled with its value.
     * Returns an HTMLElement, or null if the column isn't editable.
     */
    editInput(record) {
        if (!this.editable) return null
        const input = document.createElement('input')
        input.type = this.input
        const v = this.rawValue(record)
        input.value = v == null ? '' : v
        return input
    }

    /** Read the committed value out of the edit control. */
    readInput(input) { return input.value }
}
