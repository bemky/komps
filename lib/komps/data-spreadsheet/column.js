/**
 * Column controller for a {@link DataSpreadsheet} — extends {@link DataGridColumn}
 * with a **record-based editing API**.
 *
 * In a virtualized grid the cell for a given record may not be mounted (off-screen),
 * so editing/paste operate on the **record**, not a live cell. Otherwise it mirrors
 * Spreadsheet's column shape: `input(record)` builds a bound editor via {@link Input},
 * `paste`/`parsePaste` apply pasted values, `clear` empties.
 *
 * @class DataSpreadsheetColumn
 * @extends DataGridColumn
 *
 * @param {Object} [options={}]
 * @param {string}  [options.attribute] - record key this column reads/writes
 * @param {boolean} [options.editable=true] - whether cells can be edited/pasted into
 * @param {Object}  [options.input] - extra options merged into Input.create (e.g. `dump`/`load`)
 */

import DataGridColumn from '../data-grid/column.js'
import Input from '../input.js'

export default class DataSpreadsheetColumn extends DataGridColumn {
    /** Input kind passed to `Input.create`; overflow-friendly rich text by default (mirrors Spreadsheet). */
    static inputType = 'contentarea'
    /** Extra `Input.create` options merged into every editor (override per type, e.g. number `dump`). */
    static inputOptions = {}

    constructor(options = {}) {
        super(options)
        if (this.editable === undefined) this.editable = true
        this.inputOptions = Object.assign({}, this.constructor.inputOptions, options.input)
    }

    /** Parse a pasted/typed string into the stored value. Override per type. */
    parsePaste(value) { return value }

    /** Apply a pasted value to the record. */
    paste(record, value) {
        if (this.attribute != null) record[this.attribute] = this.parsePaste(value)
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
     * Build the bound edit control for a record (mirrors Spreadsheet via `Input.create`).
     * The returned element is two-way bound to `record[attribute]` — edits write back on
     * change/blur — and is shown in a {@link Floater} over the cell. Returns `null` when
     * the column isn't editable.
     *
     * @param {Object} record
     * @param {Object} [options] - extra Input options (e.g. an initial `value` for type-to-edit)
     * @returns {HTMLElement|null}
     */
    input(record, options = {}) {
        if (this.editable === false) return null
        return Input.create(this.constructor.inputType, Object.assign({
            target: record,
            attribute: this.attribute,
            autofocus: true
        }, this.inputOptions, options))
    }
}
