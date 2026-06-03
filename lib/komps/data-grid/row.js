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

    /** Mount (or reposition) this row into the grid body. */
    mount() {
        if (this.element) { this.position(); return this.element }
        this.element = this.grid.acquireRowElement()
        this.element.row = this
        this.renderCells()
        this.position()
        this.grid.body.appendChild(this.element)
        if (this.grid._rowObserver) this.grid._rowObserver.observe(this.element)
        this.grid.mounted.add(this)
        return this.element
    }

    renderCells() {
        // Column tracks + width come from the grid's inherited `--dg-template-columns`
        this.cellsByColumn = new Map()
        this.grid.columns.forEach(column => {
            const cell = this.grid.acquireCell()
            cell.bind(this, column, this.record)
            column.cells.add(cell)
            this.cellsByColumn.set(column, cell)
            this.element.appendChild(cell)
        })
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
        this.grid._rowPool.push(el)
        this.element = null
        this.grid.mounted.delete(this)
    }
}
