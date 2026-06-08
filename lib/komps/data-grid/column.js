/**
 * Column controller for a {@link DataGrid}.
 *
 * A standalone, persistent plain class (one per column) — mirrors the role of
 * `TableColumn`, but is **not** related to it (DataGrid is built standalone, with
 * no reuse of `table/`). It holds column config + behavior and tracks the cells
 * that are currently *mounted* for this column. Off-screen cells don't exist as
 * DOM, so the full-dataset view is provided lazily via {@link DataGridColumn#cellHandles}.
 *
 * @class DataGridColumn
 *
 * @param {Object} [options={}]
 * @param {number} [options.index] - 0-based column position (assigned by the grid)
 * @param {number|string} [options.width] - explicit column width (px number or CSS px string); falls back to the grid's default width when omitted
 * @param {boolean} [options.frozen=false] - pin this column to the left while the body scrolls
 * @param {function|string} [options.header] - header content; function receives `(column, grid)`
 * @param {function} [options.render] - cell content renderer; receives `(record, cell, column, grid)`
 * @param {function} [options.value] - optional override for the copy/serialized value; receives `(record, column)`. Defaults to the `render` result.
 * @param {string} [options.attribute] - convenience: when no `render` is given, read this key off the record
 * @param {string} [options.class] - extra class(es) applied to header + cells
 * @param {function} [options.unnest] - expand the record's nested collection into stacked sub-rows for this cell (SQL `UNNEST`/`explode`). A function `(record) => Array` returning the sub-records to stack (read-only display in v1)
 * @param {function} [options.splitInto] - **deprecated** alias for `unnest`
 * @param {function} [options.record] - resolve the record this column reads/writes from the row's record (e.g. a row `TIM` → its `Trait`). A function `(rowRecord) => record | Promise<record>`. When omitted the column operates on the row's record directly. `renderContent`/`valueFor` and (for {@link DataSpreadsheet}) `input`/`paste`/`clear`/`toggle` all operate on the resolved record.
 */

import { isFunction } from '../../support.js'
import cellHandle from './cell-handle.js'

export default class DataGridColumn {
    constructor(options = {}) {
        options = { ...options }
        if (options.splitInto !== undefined) {
            console.warn('[Komps] DataGridColumn option "splitInto" is deprecated — use "unnest" instead.')
            if (options.unnest === undefined) options.unnest = options.splitInto
            delete options.splitInto
        }

        Object.assign(this, {
            grid: null,
            index: null,
            width: null,
            frozen: false,
            header: null,
            render: null,
            value: null,
            attribute: null,
            class: null,
            unnest: record => null,
            record: null,
            type: 'default'
        }, options)

        // Only cells currently in the window. Full-dataset access is via cellHandles().
        this.cells = new Set()
    }

    /**
     * Resolve the record this column reads/writes from the row's record. With a `record`
     * resolver a cell can edit a *sub-record* (e.g. a row `TIM` → its `Trait`) while the
     * row stays the row record. Returns the row record unchanged when no resolver is set.
     * May return a Promise (resolvers are often async); callers await as needed.
     */
    resolveRecord(rowRecord) {
        return isFunction(this.record) ? this.record(rowRecord) : rowRecord
    }

    /** Resolve the display content for a record (string / node / dolla descriptor). */
    renderContent(record, cell) {
        if (isFunction(this.render)) return this.render(record, cell, this, this.grid)
        if (this.render != null) return this.render
        if (this.attribute != null) return record == null ? '' : record[this.attribute]
        return ''
    }

    /** Resolve the copy/serialized value for a record (string). */
    valueFor(record) {
        if (isFunction(this.value)) return this.value(record, this)
        const content = this.renderContent(record)
        if (content == null) return ''
        if (typeof content === 'string' || typeof content === 'number') return String(content)
        if (content instanceof Node) return content.textContent || ''
        return String(content)
    }

    /** Resolve header content. */
    headerContent() {
        return isFunction(this.header) ? this.header(this, this.grid) : this.header
    }

    /** A {@link CellHandle} for this column at a 0-based row index (or null). */
    cellAt(rowIndex) {
        const row = this.grid && this.grid.rows[rowIndex]
        return row ? cellHandle(row, this) : null
    }

    /** {@link CellHandle}s for this column across the whole dataset (lazy, transient). */
    cellHandles() {
        if (!this.grid) return []
        return this.grid.rows.map(row => cellHandle(row, this))
    }
}
