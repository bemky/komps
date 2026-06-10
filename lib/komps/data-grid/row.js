/**
 * Row controller for a {@link DataGrid}.
 *
 * A standalone, persistent plain class — one per **data row** — mirroring the
 * {@link DataGridColumn} controller pattern (and deliberately **not** `TableRow`,
 * which is itself an element). It is the source-of-truth object for a row and
 * serves as the row *handle*: code may hold it whether or not the row is on-screen.
 *
 * It **owns its measured `height`** (`null` until measured — mirroring how a column
 * owns `width`), so heights travel with the record across sorts/splices. The dumb,
 * pooled row element is referenced as `this.element` only while windowed; the
 * cumulative `offset` is read from the grid's `rowGeometry`, not stored here.
 *
 * @class DataGridRow
 *
 * @param {Object} options
 * @param {DataGrid} options.grid
 * @param {number} options.index - 0-based position in `grid.rows`
 * @param {*} options.record
 */
import { content, setAttribute } from 'dolla'
import { result } from '../../support.js'

export default class DataGridRow {
    constructor({ grid, index, record }) {
        this.grid = grid
        this.index = index
        this.record = record
        this.height = null          // measured px; null until measured
        this.element = null         // dumb pooled row element while mounted
        this.cellsByColumn = null   // Map<DataGridColumn, DataGridCell> while mounted
    }

    get mounted() { return this.element != null }

    /** Cumulative top offset (px) in body space — read from the grid's rowGeometry. */
    get offset() { return this.grid.rowGeometry.offsetAt(this.index) }

    /** The live cell element for a column (by identity), or null when off-screen. */
    cellOf(column) {
        return this.cellsByColumn ? (this.cellsByColumn.get(column) || null) : null
    }

    /**
     * Resolve (and memoize) the record a column reads/writes for this row. With a column
     * `record` resolver this is a sub-record (e.g. this row's `TIM` → its `Trait`);
     * otherwise it's the row record itself. Resolved once per (row, column) and cached for
     * the row controller's lifetime, so render / edit / copy / paste / clear share one
     * instance — and a resolver that lazily creates a record (`… || new Trait(...)`) yields
     * one stable instance per cell, not a fresh one per call. May be a Promise (async resolver).
     */
    resolvedRecordFor(column) {
        if (typeof column.record !== 'function') return this.record
        if (!this._resolved) this._resolved = new Map()
        if (!this._resolved.has(column)) this._resolved.set(column, column.resolveRecord(this.record))
        return this._resolved.get(column)
    }

    /** Mount (or reposition) this row into the grid body. */
    mount() {
        if (this.element) { this.position(); return this.element }
        this.element = this.grid.acquireRowElement()
        this.element.row = this
        this.renderCells()
        this.applyRowClass()
        this.position()
        this.grid.body.appendChild(this.element)
        if (this.grid._rowObserver) this.grid._rowObserver.observe(this.element)
        this.grid.mounted.add(this)
        return this.element
    }

    /**
     * Apply the grid's optional `rowClass` function to the row element. `rowClass(record)`
     * may return a string, an array of tokens, or a {@link State} (coerced to its current
     * value by dolla). Re-evaluated each mount; cleared on unmount so pooled elements don't
     * carry a stale class.
     */
    applyRowClass() {
        if (this.grid.rowClass) setAttribute(this.element, 'class', result(this.grid, 'rowClass', this.record))
    }

    /**
     * Build and attach this row's cells. When the grid is batch-loading records
     * (`loadRecords`), the row first renders the grid's `loadingRow` content and waits
     * for its batch (`this.loading`, assigned by the grid's windower) to settle.
     */
    async renderCells() {
        if (this.loading && !this.loaded) {
            // Only the latest call may resume past the await: a remount during the load
            // would otherwise acquire and register a second set of cells, leaking the first.
            const token = this._renderToken = {}
            if (this.grid.loadingRow) {
                // Hold the placeholder at the estimated row height so geometry doesn't jitter.
                this.element.style.minHeight = this.grid.rowHeight + 'px'
                content(this.element, result(this.grid, 'loadingRow', this.record, this))
            }
            await this.loading
            this.loaded = true
            if (this._renderToken !== token || !this.element) return
            this.element.style.minHeight = ''
        }
        // Column tracks + width come from the grid's inherited `--dg-template-columns`
        this.cellsByColumn = new Map()
        this.element.replaceChildren(...this.grid.columns.map(column => {
            const cell = this.grid.acquireCell()
            cell.bind(this, column, this.record)
            column.cells.add(cell)
            this.cellsByColumn.set(column, cell)
            return cell
        }))
    }

    /** Position via transform (no layout cost beyond the transform). */
    position() {
        if (this.element) this.element.style.transform = `translateY(${this.offset}px)`
    }

    /**
     * Measure the (auto-height) row element and record it on the controller.
     * Returns true if the height changed (so the grid can reflow geometry).
     */
    measure() {
        if (!this.element) return false
        const h = this.element.offsetHeight
        if (h && h !== this.height) {
            this.height = h
            this.grid.rowGeometry.rebuildFrom(this.index)
            return true
        }
        return false
    }

    /** Detach: return cells + the row element to their pools and drop references. */
    unmount() {
        if (!this.element) return
        if (this.cellsByColumn) {
            this.cellsByColumn.forEach(cell => cell.unmount())
            this.cellsByColumn = null
        }
        const el = this.element
        el.row = null
        if (this.grid._rowObserver) this.grid._rowObserver.unobserve(el)
        el.remove()            // detach from the body so unmounted rows don't pile up
        el.replaceChildren()
        el.removeAttribute('style')
        el.removeAttribute('class') // drop rowClass so a recycled row doesn't keep it
        this.grid._rowPool.push(el)
        this.element = null
        this.grid.mounted.delete(this)
    }
}
