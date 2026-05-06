/**
 * A managed CSS-Grid masonry layout. Each direct child becomes a cell placed via spans
 * derived from `cellPattern`. Pattern values are integer column counts (not fr units),
 * separated by spaces with commas separating rows. The pattern repeats to cover all
 * children. `rowPattern` lists row track heights and similarly repeats.
 *
 * @class Masonry
 * @extends KompElement
 *
 * @param {Object} [options={}]
 * @param {string} [options.cellPattern="1"] - Per-row cell column counts. Rows separated by `,`. Example: `"3 3 6, 6 6, 7 5, 12"`
 * @param {string} [options.rowPattern="auto"] - Repeating row heights (any CSS row track value). Example: `"200px 100px auto"`
 * @param {number} [options.gridCount] - Number of grid columns. Defaults to LCM of `cellPattern` row sums.
 * @param {boolean} [options.resizable=false] - When true, render drag handles between cells (horizontal) and between rows (vertical) for live resizing
 * @param {boolean} [options.reorderable=false] - When true, dragging a cell moves it to a new row; the source and destination rows redistribute their cells evenly across `gridCount`
 * @param {string|HTMLElement|Array|Object} [options.content] - Initial children. Each becomes a cell.
 *
 * @fires Masonry#rendered
 * @fires Masonry#resize
 * @fires Masonry#reorder
 *
 * @example <caption>JS</caption>
 * new Masonry({
 *     cellPattern: '3 3 6, 6 6, 7 5, 12',
 *     rowPattern: '200px 100px auto',
 *     resizable: true,
 *     reorderable: true,
 *     content: items.map(i => createElement('div', { content: i.label }))
 * })
 *
 * @example <caption>HTML</caption>
 * <komp-masonry cellPattern="3 3 6, 6 6, 12" rowPattern="200px 100px auto">
 *     <div>1</div>
 *     <div>2</div>
 *     <div>3</div>
 *     <div>4</div>
 *     <div>5</div>
 *     <div>6</div>
 * </komp-masonry>
 */

/**
 * Fired after layout is computed and cells are placed
 * @event Masonry#rendered
 */

/**
 * Fired after a resize via handle. `event.detail` includes `{ axis, rowIndex, cellIndex, span, neighborSpan }` for column resize, or `{ axis, rowIndex, height }` for row resize.
 * @event Masonry#resize
 */

/**
 * Fired after a drag-reorder. `event.detail` includes `{ cell, fromRow, toRow }`
 * @event Masonry#reorder
 */

import { content as setContent, createElement } from 'dolla';
import KompElement from './element.js';

function gcd (a, b) { return b === 0 ? a : gcd(b, a % b) }
function lcm (a, b) { return (a * b) / gcd(a, b) }

export default class Masonry extends KompElement {
    static tagName = 'komp-masonry'
    static { this.define() }

    static assignableAttributes = {
        cellPattern: { type: 'string', default: '1', null: false },
        rowPattern: { type: 'string', default: 'auto', null: false },
        gridCount: { type: 'number', default: null, null: true },
        resizable: { type: 'boolean', default: false, null: false },
        reorderable: { type: 'boolean', default: false, null: false }
    }

    static watch = ['cellPattern', 'rowPattern', 'gridCount', 'resizable', 'reorderable']
    static events = ['rendered', 'resize', 'reorder']
    static bindMethods = ['_onPointerDown']

    constructor (attrs = {}) {
        const initialContent = attrs.content
        delete attrs.content
        super(attrs)
        this._initialContent = initialContent
    }

    initialize () {
        super.initialize()
        if (this._initialContent != null) {
            setContent(this, this._initialContent)
            this._initialContent = null
        }
        this.render()
        this.addEventListener('pointerdown', this._onPointerDown)
    }

    changed (attribute) {
        if (this._suppressRender) return
        if (this.is_initialized && this.constructor.watch.includes(attribute)) {
            this.render()
        }
    }

    /**
     * Direct children that aren't internal handle elements
     * @returns {HTMLElement[]}
     */
    get cells () {
        return Array.from(this.children).filter(c => c.localName !== 'komp-masonry-handle')
    }

    /**
     * Replace cell content and re-render
     * @param {*} value - dolla-shaped content
     */
    setContent (value) {
        this._removeHandles()
        setContent(this, value)
        this.render()
    }

    parsePattern () {
        return this.cellPattern.split(',').map(row =>
            row.trim().split(/\s+/).map(v => parseInt(v, 10)).filter(n => !isNaN(n) && n > 0)
        ).filter(row => row.length > 0)
    }

    parseRowPattern () {
        return this.rowPattern.split(/\s+/).map(s => s.trim()).filter(Boolean)
    }

    /**
     * Computed grid column count. Honors explicit `gridCount` or derives from
     * the LCM of `cellPattern` row sums.
     */
    get computedGridCount () {
        if (this.gridCount) return this.gridCount
        const sums = this.parsePattern().map(row => row.reduce((a, b) => a + b, 0))
        if (sums.length === 0) return 1
        return sums.reduce((a, b) => lcm(a, b))
    }

    render () {
        const cells = this.cells
        const pattern = this.parsePattern()
        const explicitGrid = this.gridCount
        const baseGrid = explicitGrid || pattern.map(r => r.reduce((a, b) => a + b, 0)).reduce((a, b) => lcm(a, b), 1)
        const gridCount = baseGrid

        this._removeHandles()

        if (pattern.length === 0 || cells.length === 0) {
            this.style.display = 'grid'
            this.style.gridTemplateColumns = `repeat(${gridCount}, 1fr)`
            this.style.gridTemplateRows = ''
            this.trigger('rendered')
            return
        }

        // Walk pattern to assign each cell a row + span
        const rows = []
        let currentRow = null
        let patternRowIdx = 0
        let patternCellIdx = 0

        const newRow = () => {
            currentRow = { spans: [], cells: [] }
            rows.push(currentRow)
        }
        newRow()

        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i]
            const span = pattern[patternRowIdx][patternCellIdx]
            currentRow.spans.push(span)
            currentRow.cells.push(cell)

            patternCellIdx++
            if (patternCellIdx >= pattern[patternRowIdx].length) {
                patternRowIdx = (patternRowIdx + 1) % pattern.length
                patternCellIdx = 0
                if (i < cells.length - 1) newRow()
            }
        }

        // Apply explicit grid placement
        rows.forEach((row, rIdx) => {
            let col = 1
            row.cells.forEach((cell, cIdx) => {
                const span = row.spans[cIdx]
                cell.style.gridColumn = `${col} / span ${span}`
                cell.style.gridRow = String(rIdx + 1)
                col += span
            })
        })

        // Set parent grid templates
        const rp = this.parseRowPattern()
        const expandedRows = Array.from({ length: rows.length }, (_, i) => rp[i % rp.length] || 'auto').join(' ')
        this.style.display = 'grid'
        this.style.gridTemplateColumns = `repeat(${gridCount}, 1fr)`
        this.style.gridTemplateRows = expandedRows

        this._rows = rows
        this._gridCount = gridCount

        if (this.resizable) this._renderHandles()

        this.trigger('rendered')
    }

    _removeHandles () {
        Array.from(this.querySelectorAll(':scope > komp-masonry-handle')).forEach(h => h.remove())
    }

    _renderHandles () {
        const rows = this._rows
        const gridCount = this._gridCount

        rows.forEach((row, rIdx) => {
            // Vertical handle between adjacent cells in a row (column resize)
            let col = 1
            row.cells.forEach((cell, cIdx) => {
                col += row.spans[cIdx]
                if (cIdx < row.cells.length - 1) {
                    const handle = createElement('komp-masonry-handle', {
                        class: 'vertical',
                        data: { rowIndex: rIdx, cellIndex: cIdx },
                        style: {
                            gridColumn: String(col),
                            gridRow: String(rIdx + 1)
                        }
                    })
                    this.append(handle)
                }
            })
            // Horizontal handle on the bottom edge (row resize), skip last row
            if (rIdx < rows.length - 1) {
                const handle = createElement('komp-masonry-handle', {
                    class: 'horizontal',
                    data: { rowIndex: rIdx },
                    style: {
                        gridColumn: `1 / ${gridCount + 1}`,
                        gridRow: String(rIdx + 1)
                    }
                })
                this.append(handle)
            }
        })
    }

    _onPointerDown (e) {
        const handle = e.target.closest('komp-masonry-handle')
        if (handle && this.resizable) {
            this._startResize(e, handle)
            return
        }
        if (this.reorderable) {
            const cell = this.cells.find(c => c === e.target || c.contains(e.target))
            if (cell) this._startReorder(e, cell)
        }
    }

    _columnPx () {
        const rect = this.getBoundingClientRect()
        const style = getComputedStyle(this)
        const padL = parseFloat(style.paddingLeft) || 0
        const padR = parseFloat(style.paddingRight) || 0
        const gap = parseFloat(style.columnGap) || 0
        const usable = rect.width - padL - padR
        const totalGap = gap * (this._gridCount - 1)
        return (usable - totalGap) / this._gridCount
    }

    _startResize (e, handle) {
        e.preventDefault()
        this.setPointerCapture(e.pointerId)
        handle.classList.add('active')

        const isVertical = handle.classList.contains('vertical')
        const rowIndex = parseInt(handle.dataset.rowIndex, 10)
        const startX = e.clientX
        const startY = e.clientY

        if (isVertical) {
            const cellIndex = parseInt(handle.dataset.cellIndex, 10)
            const row = this._rows[rowIndex]
            const cell = row.cells[cellIndex]
            const startSpan = row.spans[cellIndex]
            const startNeighborSpan = row.spans[cellIndex + 1]
            const colPx = this._columnPx()
            const totalSpan = startSpan + startNeighborSpan

            const move = (ev) => {
                const delta = Math.round((ev.clientX - startX) / colPx)
                let newSpan = Math.min(Math.max(1, startSpan + delta), totalSpan - 1)
                let newNeighborSpan = totalSpan - newSpan
                row.spans[cellIndex] = newSpan
                row.spans[cellIndex + 1] = newNeighborSpan
                this._applyRowSpans(rowIndex)
                this._repositionRowHandles(rowIndex)
            }
            const up = (ev) => {
                window.removeEventListener('pointermove', move)
                handle.classList.remove('active')
                this.releasePointerCapture(e.pointerId)
                this._persistRowsToPattern()
                this.trigger('resize', { detail: {
                    axis: 'column',
                    rowIndex,
                    cellIndex,
                    span: row.spans[cellIndex],
                    neighborSpan: row.spans[cellIndex + 1]
                }})
            }
            window.addEventListener('pointermove', move)
            window.addEventListener('pointerup', up, { once: true })
        } else {
            // Row height resize. Convert auto/derived height to pixels and grow/shrink.
            const rp = this.parseRowPattern()
            const tracks = this.style.gridTemplateRows.split(/\s+/)
            const startHeight = this._measureRowHeight(rowIndex)
            const move = (ev) => {
                const newHeight = Math.max(10, startHeight + (ev.clientY - startY))
                tracks[rowIndex] = newHeight + 'px'
                this.style.gridTemplateRows = tracks.join(' ')
            }
            const up = (ev) => {
                window.removeEventListener('pointermove', move)
                handle.classList.remove('active')
                this.releasePointerCapture(e.pointerId)
                this.trigger('resize', { detail: {
                    axis: 'row',
                    rowIndex,
                    height: parseFloat(tracks[rowIndex])
                }})
            }
            window.addEventListener('pointermove', move)
            window.addEventListener('pointerup', up, { once: true })
        }
    }

    _measureRowHeight (rowIndex) {
        const row = this._rows[rowIndex]
        if (!row || row.cells.length === 0) return 0
        return Math.max(...row.cells.map(c => c.offsetHeight))
    }

    _applyRowSpans (rowIndex) {
        const row = this._rows[rowIndex]
        let col = 1
        row.cells.forEach((cell, cIdx) => {
            const span = row.spans[cIdx]
            cell.style.gridColumn = `${col} / span ${span}`
            col += span
        })
    }

    _repositionRowHandles (rowIndex) {
        const row = this._rows[rowIndex]
        const handles = Array.from(this.querySelectorAll(`:scope > komp-masonry-handle.vertical[data-row-index="${rowIndex}"]`))
        let col = 1
        row.cells.forEach((cell, cIdx) => {
            col += row.spans[cIdx]
            if (cIdx < row.cells.length - 1) {
                const h = handles[cIdx]
                if (h) h.style.gridColumn = String(col)
            }
        })
    }

    _startReorder (e, cell) {
        e.preventDefault()
        this.setPointerCapture(e.pointerId)
        this.classList.add('reordering')
        cell.classList.add('dragging')

        let dropTarget = null

        const indicator = createElement('komp-masonry-drop-indicator')
        this.append(indicator)

        const move = (ev) => {
            const target = this._findDropTarget(ev.clientX, ev.clientY, cell)
            dropTarget = target
            this._renderDropIndicator(indicator, target)
        }
        const up = (ev) => {
            window.removeEventListener('pointermove', move)
            indicator.remove()
            cell.classList.remove('dragging')
            this.classList.remove('reordering')
            this.releasePointerCapture(e.pointerId)
            if (dropTarget) {
                this._applyReorder(cell, dropTarget)
                this.trigger('reorder', { detail: {
                    cell,
                    fromRow: dropTarget.fromRow,
                    toRow: dropTarget.toRow
                }})
            }
        }
        window.addEventListener('pointermove', move)
        window.addEventListener('pointerup', up, { once: true })
    }

    _findDropTarget (clientX, clientY, draggedCell) {
        const draggedRow = this._rows.findIndex(r => r.cells.includes(draggedCell))
        const myRect = this.getBoundingClientRect()
        const localY = clientY - myRect.top

        // For each row, compute its vertical extent from its cells
        const rowMetrics = this._rows.map(row => {
            const tops = row.cells.map(c => c.offsetTop)
            const bottoms = row.cells.map(c => c.offsetTop + c.offsetHeight)
            return { top: Math.min(...tops), bottom: Math.max(...bottoms) }
        })

        // Check between-row drop zones first (top of each row counts as "before")
        for (let i = 0; i < rowMetrics.length; i++) {
            const m = rowMetrics[i]
            const edge = i === 0 ? m.top : (rowMetrics[i - 1].bottom + m.top) / 2
            if (i === 0 && localY < m.top + 8) {
                return { type: 'between', insertAt: 0, fromRow: draggedRow, toRow: 0 }
            }
            if (Math.abs(localY - edge) < 8) {
                return { type: 'between', insertAt: i, fromRow: draggedRow, toRow: i }
            }
        }
        const last = rowMetrics[rowMetrics.length - 1]
        if (last && localY > last.bottom - 8) {
            return { type: 'between', insertAt: rowMetrics.length, fromRow: draggedRow, toRow: rowMetrics.length }
        }

        // Otherwise drop into the row whose vertical band contains the pointer
        for (let i = 0; i < rowMetrics.length; i++) {
            const m = rowMetrics[i]
            if (localY >= m.top && localY <= m.bottom) {
                return { type: 'into', rowIndex: i, fromRow: draggedRow, toRow: i }
            }
        }
        return null
    }

    _renderDropIndicator (indicator, target) {
        if (!target) {
            indicator.style.display = 'none'
            return
        }
        indicator.style.display = ''
        if (target.type === 'between') {
            indicator.classList.add('between')
            indicator.classList.remove('into')
            indicator.style.gridColumn = `1 / ${this._gridCount + 1}`
            indicator.style.gridRow = String(Math.max(1, Math.min(this._rows.length, target.insertAt + 1)))
            indicator.style.alignSelf = target.insertAt >= this._rows.length ? 'end' : 'start'
        } else {
            indicator.classList.add('into')
            indicator.classList.remove('between')
            indicator.style.gridColumn = `1 / ${this._gridCount + 1}`
            indicator.style.gridRow = String(target.rowIndex + 1)
            indicator.style.alignSelf = 'stretch'
        }
    }

    _applyReorder (cell, target) {
        const rows = this._rows
        const fromRowIdx = rows.findIndex(r => r.cells.includes(cell))
        if (fromRowIdx < 0) return
        const fromRow = rows[fromRowIdx]
        const fromCellIdx = fromRow.cells.indexOf(cell)

        // Remove from source row
        fromRow.cells.splice(fromCellIdx, 1)
        fromRow.spans.splice(fromCellIdx, 1)

        let destRow
        let destRowIdx
        if (target.type === 'between') {
            destRow = { cells: [cell], spans: [this._gridCount] }
            destRowIdx = target.insertAt
            // Insert relative to fromRowIdx removal
            if (fromRowIdx < destRowIdx) destRowIdx -= 1 // account for source-row shift if it's about to be empty (handled below)
            rows.splice(target.insertAt, 0, destRow)
        } else {
            destRowIdx = target.rowIndex
            destRow = rows[destRowIdx]
            destRow.cells.push(cell)
        }

        // Drop empty source row
        if (fromRow.cells.length === 0) {
            const idx = rows.indexOf(fromRow)
            rows.splice(idx, 1)
        }

        // Redistribute affected rows evenly across gridCount
        const distribute = (row) => {
            const n = row.cells.length
            if (n === 0) return
            const base = Math.floor(this._gridCount / n)
            const remainder = this._gridCount - base * n
            row.spans = row.cells.map((_, i) => base + (i < remainder ? 1 : 0))
        }
        if (rows.includes(fromRow)) distribute(fromRow)
        if (target.type === 'into') distribute(destRow)

        // Reorder DOM children to match row order, then persist via cellPattern + re-render
        const flat = rows.flatMap(r => r.cells)
        flat.forEach(c => this.append(c))
        this._persistRowsToPattern()
    }

    /**
     * Encode the current `_rows` layout back into `cellPattern` and re-render.
     * Used after reorder/resize so the new layout survives subsequent renders.
     */
    _persistRowsToPattern () {
        if (!this._rows) return
        const newPattern = this._rows.map(r => r.spans.join(' ')).join(', ')
        this._suppressRender = true
        this.cellPattern = newPattern
        this._suppressRender = false
        this.render()
    }

    static style = `
        komp-masonry {
            display: grid;
            position: relative;
        }
        komp-masonry-handle {
            position: relative;
            z-index: 2;
            background: transparent;
            touch-action: none;
        }
        komp-masonry-handle.vertical {
            cursor: col-resize;
            justify-self: start;
            align-self: stretch;
            width: 8px;
            margin-left: -4px;
        }
        komp-masonry-handle.horizontal {
            cursor: row-resize;
            align-self: end;
            justify-self: stretch;
            height: 8px;
            margin-bottom: -4px;
        }
        komp-masonry-handle:hover,
        komp-masonry-handle.active {
            background: rgba(0, 0, 255, 0.4);
        }
        komp-masonry.reordering > *:not(komp-masonry-handle):not(komp-masonry-drop-indicator) {
            pointer-events: none;
        }
        komp-masonry > .dragging {
            opacity: 0.4;
        }
        komp-masonry-drop-indicator {
            pointer-events: none;
            border: 2px dashed rgba(0, 0, 255, 0.6);
            background: rgba(0, 0, 255, 0.05);
            z-index: 3;
        }
        komp-masonry-drop-indicator.between {
            border: none;
            background: rgba(0, 0, 255, 0.6);
            block-size: 4px;
            margin-block-start: -2px;
        }
    `
}
