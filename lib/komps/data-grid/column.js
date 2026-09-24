/**
 * Column controller for a {@link DataGrid}.
 *
 * A standalone, persistent plain class (one per column). It holds column config +
 * behavior and tracks the cells that are currently *mounted* for this column.
 * Off-screen cells don't exist as
 * DOM, so the full-dataset view is provided lazily via {@link DataGridColumn#cellHandles}.
 *
 * @class DataGridColumn
 *
 * @param {Object} [options={}]
 * @param {number} [options.index] - 0-based column position (assigned by the grid)
 * @param {number|string} [options.width] - explicit column width (px number or CSS px string); falls back to the grid's default width when omitted
 * @param {number} [options.colspan=1] - number of grid tracks this column occupies. `>1` splits the column into sub-tracks a cell can address (e.g. via `grid-template-columns: subgrid`) so its content aligns into aligned sub-columns across every row. Sub-tracks must be fixed px summing to `width` — see `widths` — so the px-based column geometry (offsets, selection, resize) stays in sync
 * @param {number[]|string} [options.widths] - explicit sub-track widths for a `colspan>1` column: a px-number array or a space-separated px string (`[120,120,120]` / `"120px 120px 120px"`). Their sum is the column's total width. Omit to split `width` evenly across `colspan` tracks
 * @param {boolean} [options.frozen=false] - pin this column to the left while the body scrolls
 * @param {function|string} [options.header] - header content; function receives `(column, grid)`
 * @param {function} [options.render] - cell content renderer; receives `(record, cell, column, grid)`
 * @param {function} [options.value] - optional override for the copy/serialized value; receives `(record, column)`. Defaults to the `render` result.
 * @param {string} [options.attribute] - convenience: when no `render` is given, read this key off the record
 * @param {string} [options.class] - extra class(es) applied to header + cells
 * @param {function} [options.unnest] - expand the record's nested collection into stacked sub-rows for this cell (SQL `UNNEST`/`explode`). A function `(record) => Array` returning the sub-records to stack (read-only display in v1)
 * @param {function} [options.splitInto] - **deprecated** alias for `unnest`
 * @param {function} [options.record] - resolve the record this column reads/writes from the row's record (e.g. a row `TIM` → its `Trait`). A function `(rowRecord) => record | Promise<record>`. When omitted the column operates on the row's record directly. `renderContent`/`valueFor` and (for {@link Spreadsheet}) `input`/`paste`/`clear`/`toggle` all operate on the resolved record.
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
            colspan: 1,
            widths: null,
            startLine: null,
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
        return this.renderAttribute(record)
    }

    /**
     * Fallback used by {@link DataGridColumn#renderContent} when no `render` is
     * configured: reads `attribute` off the record as-is. A column type overrides
     * this (rather than `renderContent`) to format that value (e.g. a date column
     * formatting a Date) while still being reachable by a caller-supplied `render`
     * that wants the type's default formatting for a value it computed itself.
     */
    renderAttribute(record) {
        if (this.attribute != null) return record == null ? '' : record[this.attribute]
        return ''
    }

    /**
     * Resolve the copy/serialized value for a record. Usually a string, but a column may
     * instead return a MIME map (e.g. `{ 'text/plain': 'Ben Ehmke', 'text/html': '<span
     * data-id="…">Ben Ehmke</span>' }`) to carry a richer representation for copy/paste —
     * see {@link Spreadsheet#copyCells}. A bare string is treated as `{ 'text/plain': value }`.
     */
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

    /** The configured width in px (parsed), or `defaultWidth` when unset/invalid. */
    configuredWidth(defaultWidth) {
        const w = this.width
        if (w == null) return defaultWidth
        if (typeof w === 'number') return w
        const n = parseFloat(w)
        return Number.isNaN(n) ? defaultWidth : n
    }

    /**
     * The px sizes of the tracks this column contributes to the grid template:
     * `colspan` tracks that sum to the column's width. Explicit `widths` win;
     * otherwise the width is split evenly. Single-track columns yield `[width]`.
     */
    trackSizes(defaultWidth) {
        if ((this.colspan || 1) <= 1) return [this.configuredWidth(defaultWidth)]
        if (this.widths != null) {
            const list = Array.isArray(this.widths) ? this.widths : String(this.widths).trim().split(/\s+/)
            return list.map(t => (typeof t === 'number' ? t : parseFloat(t)))
        }
        const each = this.configuredWidth(defaultWidth) / this.colspan
        return Array(this.colspan).fill(each)
    }

    /** Total px width the grid geometry sizes this column at (sum of its tracks). */
    totalWidth(defaultWidth) {
        return this.trackSizes(defaultWidth).reduce((sum, t) => sum + t, 0)
    }

    /**
     * The `grid-column` value placing this column: its 1-based start line, spanning
     * `colspan` tracks. `startLine` is assigned by the grid (prefix-sum of colspans);
     * falls back to `index + 1` before assignment.
     */
    gridColumn() {
        const span = this.colspan || 1
        const start = this.startLine ?? (this.index + 1)
        return span > 1 ? `${start} / span ${span}` : String(start)
    }

    /**
     * Set the column width, rescaling explicit `widths` proportionally so a resize of a
     * multi-track column keeps its sub-track ratios. Default-split columns read `width`
     * live, so setting it is enough.
     */
    setWidth(width) {
        if ((this.colspan || 1) > 1 && this.widths != null) {
            const current = this.trackSizes()
            const total = current.reduce((sum, t) => sum + t, 0) || 1
            const factor = width / total
            this.widths = current.map(t => t * factor)
        }
        this.width = width
    }

    /**
     * Resize sub-track `i` to `size`, taking the difference from its right neighbor so
     * the column's total width is unchanged (redistribute within the column). Both are
     * clamped to `min`. Materializes explicit `widths` from the current sizes first, so
     * it works on default-split columns too. No-op without a right neighbor.
     */
    resizeTrack(i, size, min = 0, defaultWidth) {
        const widths = this.trackSizes(defaultWidth)
        if (i < 0 || i + 1 >= widths.length) return
        const pair = widths[i] + widths[i + 1]
        widths[i] = Math.max(min, Math.min(size, pair - min))
        widths[i + 1] = pair - widths[i]
        this.widths = widths
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
