/**
 * A **virtualized** (windowed) grid of records by attributes.
 *
 * `DataGrid` renders only the rows currently in the viewport, so memory and layout
 * cost scale with the *visible* row count rather than the total.
 *
 * DataGrid requires a **bounded height** (set `height`/`max-height` on the element);
 * it owns its own scroll viewport.
 *
 * @class DataGrid
 * @extends KompElement
 *
 * @param {Object} [options={}]
 * @param {Array|Promise<Array>} [options.data=[]] - records (one {@link DataGridRow} per record); may be a promise of the array, or an array of per-record promises, in which case a loader can render while it resolves (see `loading`)
 * @param {Array}  [options.columns=[]] - column configs ({@link DataGridColumn})
 * @param {number} [options.rowHeight=32] - estimated height for unmeasured rows
 * @param {number} [options.defaultColumnWidth=120] - width for columns without `width`
 * @param {number} [options.overscan=4] - extra rows mounted above/below the viewport
 * @param {function} [options.rowClass] - `(record) => class` applied to each row element (string, token array, or {@link State}); re-evaluated each time a row mounts
 * @param {function} [options.empty] - `() => content` rendered in the body when there are no rows
 * @param {function} [options.loading] - `() => content` rendered in the body while `data` is still resolving (rows not yet built); removed once rows are in place
 *
 * @fires DataGrid#rendered
 *
 * @example
 * new DataGrid({
 *     style: 'height: 400px',
 *     data: records,
 *     columns: [
 *         { header: 'Name', width: 200, render: r => r.name, frozen: true },
 *         { header: 'Team', width: 160, attribute: 'team' }
 *     ]
 * })
 */

import { createElement } from 'dolla'
import { result } from '../support.js'
import KompElement from './element.js'
import DataGridColumn from './data-grid/column.js'
import DataGridRow from './data-grid/row.js'
import DataGridCell from './data-grid/cell.js'
import DataGridGeometry from './data-grid/geometry.js'
import cellHandle from './data-grid/cell-handle.js'

export default class DataGrid extends KompElement {
    static tagName = 'komp-data-grid'

    static columnTypeRegistry = { default: DataGridColumn }
    static Column = DataGridColumn
    static Row = DataGridRow
    static Cell = DataGridCell

    static assignableAttributes = {
        data: { type: 'array', default: [], null: false },
        columns: { type: 'array', default: [], null: false },
        rowHeight: { type: 'number', default: 32, null: false },
        defaultColumnWidth: { type: 'number', default: 120, null: false },
        overscan: { type: 'number', default: 4, null: false },
        rowClass: { type: 'function', default: null, null: true },
        empty: { type: 'function', default: null, null: true },
        loading: { type: 'function', default: null, null: true }
    }

    static events = ['rendered']

    constructor(...args) {
        super(...args)
        this.mounted = new Set()      // DataGridRow currently in the window
        this._rowPool = []            // detached row elements
        this._cellPool = []           // detached DataGridCell elements
        this._frame = null
        this._loadingOverride = null  // null = automatic (loader until rows resolve); true/false = forced
    }

    async initialize(...args) {
        const result = await super.initialize(...args)
        this.setAttribute('role', 'grid')

        await this.initializeColumns()

        // One generic axis geometry per axis; the only axis-specific bit is how to
        // read an element's size (measured row height vs. configured column width).
        this.columnGeometry = new DataGridGeometry(this.columns, {
            sizeOf: col => {
                const w = col.width
                if (w == null) return this.defaultColumnWidth
                if (typeof w === 'number') return w
                const n = parseFloat(w)
                return Number.isNaN(n) ? this.defaultColumnWidth : n
            }
        })
        this.renderScaffold()
        this.setupObservers()

        // First window paint after layout settles (so clientHeight is known).
        requestAnimationFrame(() => {
            if (this.clientHeight === 0) {
                console.warn('[Komps] DataGrid has no bounded height; set height/max-height for windowing to work.')
            }
            this.updateWindow()
            this.trigger('rendered')
        })
        
        // render rows last so that everything is in place for loaders and what not before awaiting data load
        await this.initializeRows()
        this.rowGeometry = new DataGridGeometry(this.rows, {
            sizeOf: row => row.height == null ? this.rowHeight : row.height
        })
        this.updateWindow()
        
        return result
    }

    /* -----------------------------------------------------------------
       Model construction
    ----------------------------------------------------------------- */
    async initializeColumns() {
        const configs = await this.columns
        this.columns = (await Promise.all(configs.map(c => c))).map((config, i) => this.buildColumn(config, i))
    }

    buildColumn(config, index) {
        if (config instanceof DataGridColumn) {
            config.grid = this
            config.index = index
            return config
        }
        const ColumnClass = this.constructor.columnTypeRegistry[config?.type] || this.constructor.columnTypeRegistry.default
        return new ColumnClass(Object.assign({ grid: this, index }, config))
    }

    async initializeRows() {
        // `data` may be a promise of the array (a deferred payload) and/or an array of
        // per-record promises — await both: the array first, then each record.
        this.rows = (await Promise.all(await this.data.map(r => r))).map((record, index) => {
            return new this.constructor.Row({ grid: this, index, record })
        })
    }

    /* -----------------------------------------------------------------
       Scaffold (header + body) + layout
    ----------------------------------------------------------------- */
    renderScaffold() {
        this.applyColumnGeometry()
        this.header = this.renderHeader()
        this.body = createElement(`${this.localName}-body`)
        this.utilities = createElement(`${this.localName}-utilities`)
        this.replaceChildren(this.header, this.body, this.utilities)
    }

    /**
     * Publish the column tracks + total width as custom properties on the grid.
     * The header and every row inherit `--dg-template-columns` / `--dg-width` via
     * CSS, so column geometry has a single update point (call this after any
     * column width/order change) instead of writing the template on each row.
     */
    applyColumnGeometry() {
        this.style.setProperty('--dg-template-columns', this.columnGeometry.template())
        this.style.setProperty('--dg-width', this.columnGeometry.extent + 'px')
    }

    renderHeader() {
        const geom = this.columnGeometry
        // NB: dolla applies style objects via style.setProperty(), which needs
        // kebab-case keys (camelCase is silently dropped).
        const header = createElement(`${this.localName}-header`, { role: 'row' })
        this.columns.forEach(column => {
            const cell = createElement(`${this.localName}-header-cell`, {
                role: 'columnheader',
                class: column.class || null,
                content: column.headerContent(),
                style: { 'grid-column': String(column.index + 1) }
            })
            if (column.frozen) {
                cell.classList.add('frozen')
                const left = geom.frozenOffsetAt(column.index)
                if (left != null) cell.style.left = left + 'px'
            }
            column.headerCell = cell
            header.appendChild(cell)
        })
        return header
    }

    sizeBody() {
        this.body.style.width = this.columnGeometry.extent + 'px'
        this.body.style.height = (this.rowGeometry?.extent || this.offsetHeight) + 'px'
    }

    setupObservers() {
        this.addEventListener('scroll', () => this.scheduleUpdateWindow())
        this._viewportObserver = new ResizeObserver(() => this.scheduleUpdateWindow())
        this._viewportObserver.observe(this)
        // Re-measure a row whenever its content reflows while mounted.
        this._rowObserver = new ResizeObserver(entries => {
            let changed = false
            for (const entry of entries) {
                const row = entry.target.row
                if (row && row.measure()) changed = true
            }
            if (changed) this.reflow()
        })
    }

    disconnected() {
        if (this._viewportObserver) this._viewportObserver.disconnect()
        if (this._rowObserver) this._rowObserver.disconnect()
    }

    /* -----------------------------------------------------------------
       Viewport → visible range
    ----------------------------------------------------------------- */
    scheduleUpdateWindow() {
        if (this._frame) return
        this._frame = requestAnimationFrame(() => {
            this._frame = null
            this.updateWindow()
        })
    }

    /** Compute the [start, end] row index range to mount, including overscan. */
    visibleRange() {
        if (!this.rows) return [];
        const n = this.rows.length
        if (n === 0) return [0, -1]
        const bodyTop = this.body.offsetTop // = header height
        const top = this.scrollTop - bodyTop
        const bottom = top + this.clientHeight
        let start = this.rowGeometry.indexAtOffset(Math.max(0, top))
        let end = this.rowGeometry.indexAtOffset(Math.max(0, bottom))
        start = Math.max(0, start - this.overscan)
        end = Math.min(n - 1, end + this.overscan)
        return [start, end]
    }

    /* -----------------------------------------------------------------
       Windower: diff mounted vs desired, mount/unmount, measure, reflow
    ----------------------------------------------------------------- */
    updateWindow() {
        if (!this.body) return
        let pass = 0
        let changed = true
        // A measurement can shift offsets enough to change the desired range, so
        // settle over a couple of passes (capped to avoid loops).
        while (changed && pass < 3) {
            const [start, end] = this.visibleRange()
            this.syncMounted(start, end)
            changed = this.measureMounted()
            pass++
        }
        this.repositionMounted()
        this.sizeBody()
        this.renderLoadingState()
        this.renderEmptyState()
    }

    /**
     * Show/hide the `loading` content in the body.
     *
     * Called with no argument from {@link DataGrid#updateWindow}, it's automatic: the
     * loader shows while `data` is still resolving (before {@link DataGrid#initializeRows}
     * has built `this.rows`) and is removed once rows are in place. Because rows are
     * initialized last (after the scaffold + first window paint), a grid with async
     * `data` renders its header and a loader immediately.
     *
     * The app can also call it directly to override that automatic behavior — e.g. while
     * reloading data, when `this.rows` still holds the previous payload:
     *
     *     grid.renderLoadingState(true)    // force the loader on before refetching
     *     grid.data = fetchRecords()       // ...reassign data / rebuild rows...
     *     await grid.initializeRows()
     *     grid.renderLoadingState(false)   // force it off (or null → back to automatic)
     *     grid.updateWindow()
     *
     * @param {boolean|null} [active] - force on (`true`) / off (`false`); `null` or
     *   omitting it restores automatic behavior (shown only until rows resolve). An
     *   explicit value persists across the automatic no-arg calls from `updateWindow`.
     */
    renderLoadingState(active) {
        if (active !== undefined) this._loadingOverride = active
        const show = (this._loadingOverride ?? !this.rows) && !!this.loading
        if (show) {
            if (!this._loadingEl) {
                this._loadingEl = createElement(`${this.localName}-loading`, { content: result(this, 'loading') })
                this.body.replaceChildren(this._loadingEl)
            }
        } else if (this._loadingEl) {
            this._loadingEl.remove()
            this._loadingEl = null
        }
    }

    /** Show the `empty` content in the body when there are no rows; remove it otherwise. */
    renderEmptyState() {
        if (this.rows?.length === 0 && this.empty) {
            if (!this._emptyEl) {
                this._emptyEl = createElement(`${this.localName}-empty`, { content: result(this, 'empty') })
                this.body.replaceChildren(this._emptyEl)
            }
        } else if (this._emptyEl) {
            this._emptyEl.remove()
            this._emptyEl = null
        }
    }

    syncMounted(start, end) {
        // row.mount()/row.unmount() own observing + the `mounted` set.
        for (const row of Array.from(this.mounted)) {
            if (row.index < start || row.index > end) row.unmount()
        }
        for (let i = start; i <= end; i++) {
            const row = this.rows[i]
            if (row && !row.mounted) row.mount()
        }
    }

    measureMounted() {
        let changed = false
        for (const row of this.mounted) {
            if (row.measure()) changed = true
        }
        return changed
    }

    repositionMounted() {
        for (const row of this.mounted) row.position()
    }

    /** Recompute body size + reposition after a height change (from the observer). */
    reflow() {
        this.repositionMounted()
        this.sizeBody()
        this.scheduleUpdateWindow()
    }

    /* -----------------------------------------------------------------
       Element pools (recycled across scroll)
    ----------------------------------------------------------------- */
    acquireRowElement() {
        return this._rowPool.pop() || createElement(`${this.localName}-row`, { role: 'row' })
    }
    acquireCell() {
        return this._cellPool.pop() || document.createElement(this.constructor.Cell.tagName)
    }

    /* -----------------------------------------------------------------
       Public collections + cell-walking APIs (return handles)
       Row/column indices are 0-based.
    ----------------------------------------------------------------- */
    /** Row controllers currently in the window. */
    get mountedRows() { return this.rows?.filter(r => r.mounted) ?? [] }

    /** Every cell as a {@link CellHandle} (lazy, transient — see plan §1.1). */
    get cells() {
        const out = []
        for (const row of this.rows) {
            for (const column of this.columns) out.push(cellHandle(row, column))
        }
        return out
    }

    /** {@link CellHandle} at (column, row); negative indices count from the end. */
    at(column, row) {
        const c = column < 0 ? this.columns.length + column : column
        const r = row < 0 ? this.rows.length + row : row
        const col = this.columns[c]
        const rw = this.rows[r]
        return (col && rw) ? cellHandle(rw, col) : null
    }

    /** Rectangular range of {@link CellHandle}s between two handles (row-major). */
    slice(from, to) {
        const [minRow, maxRow] = [from.rowIndex, to.rowIndex].sort((a, b) => a - b)
        const [minCol, maxCol] = [from.cellIndex, to.cellIndex].sort((a, b) => a - b)
        const out = []
        for (let r = minRow; r <= maxRow; r++) {
            const row = this.rows[r]
            if (!row) continue
            for (let c = minCol; c <= maxCol; c++) {
                const column = this.columns[c]
                if (column) out.push(cellHandle(row, column))
            }
        }
        return out
    }

    /** Query *mounted* cells by CSS selector → handles (off-screen cells can't match). */
    queryCells(selector = '') {
        const base = `${this.localName}-cell`
        const sel = selector ? base + selector : base
        return Array.from(this.body.querySelectorAll(sel))
            .filter(el => el.row && el.column)
            .map(el => cellHandle(el.row, el.column))
    }

    /* -----------------------------------------------------------------
       Mutations (re-index, reflow geometry, re-window)
    ----------------------------------------------------------------- */
    reindexRows(from = 0) {
        for (let i = from; i < this.rows.length; i++) this.rows[i].index = i
    }

    sortRows(compareFn) {
        this.rows.sort(compareFn)
        this.reindexRows(0)
        this.rowGeometry.rebuildFrom(0) // heights travel with controllers; just re-sum
        // Mounted set may now hold the wrong rows for the viewport — rebuild window.
        for (const row of Array.from(this.mounted)) row.unmount()
        this.updateWindow()
        return this.rows
    }

    spliceRows(index, deleteCount = 0, ...newRecords) {
        const removed = this.rows.slice(index, index + deleteCount)
        removed.forEach(row => { if (row.mounted) row.unmount() })
        const created = newRecords.map(record => new this.constructor.Row({ grid: this, index: 0, record }))
        this.rows.splice(index, deleteCount, ...created)
        this.reindexRows(index)
        this.rowGeometry.rebuildFrom(index)
        this.updateWindow()
        return created
    }
    appendRow(index, ...records) { return this.spliceRows(index, 0, ...records) }
    removeRow(index, count = 1) { return this.spliceRows(index, count) }

    /* -----------------------------------------------------------------
       Styles
    ----------------------------------------------------------------- */
    static style = function () { return `
        ${this.tagName} {
            --dg-cell-bg: #fff;
            display: block;
            position: relative;
            overflow: auto;
            contain: paint;
            background: white;
        }
        ${this.tagName}-header,
        ${this.tagName}-row {
            display: grid;
            grid-template-columns: var(--dg-template-columns);
            width: var(--dg-width);
        }
        ${this.tagName}-header {
            position: sticky;
            top: 0;
            z-index: 30;
            background: var(--dg-cell-bg);
        }
        ${this.tagName}-body {
            display: block;
            position: relative;
        }
        ${this.tagName}-utilities {
            position: absolute;
            inset-block-start: 0;
            inset-inline-start: 0;
            inline-size: 0;
            block-size: 0;
            z-index: 100;
        }
        ${this.tagName}-row {
            position: absolute;
            inset-block-start: 0;
            inset-inline-start: 0;
            will-change: transform;
        }
        ${this.tagName}-cell,
        ${this.tagName}-header-cell {
            box-sizing: border-box;
            overflow: hidden;
            min-width: 0;
        }
        ${this.tagName}-cell.frozen,
        ${this.tagName}-header-cell.frozen {
            position: sticky;
            background: var(--dg-cell-bg);
            z-index: 5;
        }
        ${this.tagName}-header-cell.frozen { z-index: 35; }
        ${this.tagName}-cell-group { display: block; }
        ${this.tagName}-cell-subrow { display: block; }
        ${this.tagName}-empty { display: block; }
        ${this.tagName}-loading { display: block; }
    `}

    static { this.define() }
}
