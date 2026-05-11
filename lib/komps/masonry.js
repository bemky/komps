/**
 * A managed and customizable CSS-Grid masonry-style layout. Each direct child becomes a cell placed via `cellPattern`.
 *
 * @class Masonry
 * @extends KompElement
 *
 * @param {Object} [options={}]
 * @param {string} [options.cellPattern="1"] - Per-row cell column counts. Rows separated by `,`. Example: `"3 3 6, 6 6, 7 5, 12"`
 * @param {string} [options.rowPattern="auto"] - Repeating row heights (any CSS row track value). Example: `"200px 100px auto"`
 * @param {number} [options.columnCount] - Number of grid columns. Defaults to least common multiple of `cellPattern` row sums.
 * @param {boolean} [options.resizable=false] - When true, render drag handles between cells (horizontal) and between rows (vertical) for live resizing
 * @param {boolean} [options.reorderable=false] - When true, dragging a cell moves it to a new row; the source and destination rows redistribute their cells evenly across `columnCount`
 * @param {string} [options.handleSelector] - CSS selector for an in-cell drag handle. When set, only `pointerdown` on a matching descendant starts the reorder; otherwise the whole cell is grabbable. Has no effect when `reorderable` is false.
 * @param {string|HTMLElement|Array|Object} [options.content] - Initial children. Each becomes a cell.
 *
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
 * Fired after a resize via handle. `event.detail` includes `{ axis, rowIndex, cellIndex, span, neighborSpan }` for column resize, or `{ axis, rowIndex, height }` for row resize.
 * @event Masonry#resize
 */

/**
 * Fired after a drag-reorder. `event.detail` includes `{ cell, fromRow, toRow }`
 * @event Masonry#reorder
 */

import { createElement, innerHeight, insertAfter, insertBefore } from 'dolla';
import { groupBy } from '../support.js';
import KompElement from './element.js';

function gcd (a, b) { return b === 0 ? a : gcd(b, a % b) }
function lcm (a, b) { return (a * b) / gcd(a, b) }

export default class Masonry extends KompElement {
    static tagName = 'komp-masonry'

    static assignableAttributes = {
        cellPattern: { type: 'string', default: '1', null: false },
        rowPattern: { type: 'string', default: 'auto', null: false },
        columnCount: { type: 'number', default: null, null: true },
        resizable: { type: 'boolean', default: false, null: false },
        reorderable: { type: 'boolean', default: false, null: false },
        handleSelector: { type: 'string', default: null, null: true }
    }

    static watch = ['cellPattern', 'rowPattern', 'columnCount', 'resizable', 'reorderable']
    static events = ['resize', 'reorder']
    static bindMethods = ['_onPointerDown', '_onMutation']

    initialize () {
        super.initialize()
        this._mutationObserver = new MutationObserver(this._onMutation)
        this.addEventListener('pointerdown', this._onPointerDown)
        
        // Publish current gap sizes as CSS vars so handles can offset their
        // indicators to land in the gap center without per-handle JS math.
        // NOTE: this may get out of sync if style changes
        const computed = getComputedStyle(this)
        const shorthand = (computed.gap || '').split(/\s+/).filter(Boolean)
        const rowGap = computed.rowGap || shorthand[0] || '0px'
        const colGap = computed.columnGap || shorthand[1] || shorthand[0] || '0px'
        this.style.setProperty('--komp-masonry-column-gap', colGap)
        this.style.setProperty('--komp-masonry-row-gap', rowGap)
    }

    connected () {
        this._mutationObserver?.observe(this, { childList: true })
        this.cellPatternChanged()
    }

    disconnected () {
        this._mutationObserver?.disconnect()
    }

    /**
     * MutationObserver callback. Reapplies the pattern when direct children
     * are added or removed externally. Ignores:
     *   - internal handle / drop-indicator elements that the component manages itself
     *   - cells that appear in both addedNodes and removedNodes (i.e. moved within the masonry, as during a reorder)
     */
    _onMutation (mutations) {
        const added = new Set()
        const removed = new Set()
        function isLocal (n) {
            return n.localName === 'komp-masonry-handle' ||
                n.localName === 'komp-masonry-drop-indicator' ||
                n.classList.contains('komp-masonry-drag-clone')
        }
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.nodeType === 1 && !isLocal(node)) {
                    added.add(node)
                    if (this.resizable) {
                        if (!node.handle) {
                            node.handle = createElement('komp-masonry-handle', {
                                class: 'vertical'
                            })
                            node.handle.cell = node
                        }
                        insertAfter(node, node.handle)
                    }
                }
            }
            for (const node of m.removedNodes) {
                if (node.nodeType === 1 && !isLocal(node)) {
                    removed.add(node)
                    if (this.resizable) {
                        if (node.handle) {
                            node.handle.remove()
                            delete node.handle.cell
                            delete node.handle
                        }
                    }
                }
            }
        }
        if (added.size || removed.size) {
            this.cellPatternChanged()
        }
    }

    changed (attribute) {
        if (this._suppressRender) return
        if (this.is_initialized && attribute != 'cellPattern' && this.constructor.watch.includes(attribute)) {
            this.cellPatternChanged()
        }
    }

    /**
     * Direct children that aren't internal handle elements
     * @returns {HTMLElement[]}
     */
    get cells () {
        return this.querySelectorAll('& > *:not(komp-masonry-handle):not(.komp-masonry-drag-clone)')
    }
    
    get handles () {
        return this.querySelectorAll('& > komp-masonry-handle')
    }
    
    rowPatternChanged(was, now) {
        if (was == now) return;
        
        this.style.gridAutoRows = now
    }

    /**
     * Walk `cellPattern` to assign each direct child a CSS grid area,
     * compute `columnCount` (LCM of row sums when not explicit), and set the
     * parent grid template. Called automatically on `cellPattern` change
     * and on child mutation.
     */
    cellPatternChanged (was, now) {
        if (this.supressPatternPaint) return;
        now = now || this.cellPattern
        if (was != null && was === now) return;
        const matrix = this._cellPatternToMatrix(now)
        if (matrix.length === 0) return

        this._columnCount = this.columnCount
            || matrix.map(r => r.reduce((a, b) => a + b, 0)).reduce((a, b) => lcm(a, b), 1)
        this.style.gridTemplateColumns = `repeat(${this._columnCount}, 1fr)`

        // matrixRow cycles through `matrix` (0-indexed); cssRow / cssCol are
        // CSS grid lines (1-indexed) and cssRow keeps counting up beyond the
        // pattern length.
        let matrixRow = 0
        let cellInRow = 0
        let cssRow = 1
        let cssCol = 1

        this.cells.forEach(cell => {
            const span = matrix[matrixRow][cellInRow]
            cell.style.gridArea = `${cssRow} / ${cssCol} / span 1 / span ${span}`
            cell.dataset.rowIndex = cssRow - 1
            cell.dataset.colIndex = cssCol - 1
            cell.dataset.cellIndex = cellInRow

            if (this.resizable) {
                if (cell.handle) {
                    // Handle sits at the column line *after* the cell.
                    cell.handle.style.gridArea = `${cssRow} / ${cssCol + span} / span 1 / span 1`
                    cell.handle.dataset.rowIndex = cssRow - 1
                    cell.handle.dataset.cellIndex = cellInRow
                    // Last cell in a row has no right-edge boundary to resize.
                    cell.handle.toggleAttribute('hidden', cellInRow === matrix[matrixRow].length - 1)
                }
            }

            cssCol += span
            cellInRow++
            if (cellInRow >= matrix[matrixRow].length) {
                matrixRow = (matrixRow + 1) % matrix.length
                cellInRow = 0
                cssRow++
                cssCol = 1
            }
        })
        
        if (this.resizable) {
            this.querySelectorAll(`komp-masonry-handle.horizontal`).forEach(el => el.remove())                                                                                                                         
            for (let i = cssRow - 2; i > 0; i--) {                                                                                                                       
                if (!this.querySelector(`komp-masonry-handle.horizontal[data-row-index="${i - 1}"]`)) {                                                                      
                    this.append(createElement('komp-masonry-handle', {                                                                                                   
                        class: 'horizontal',                                                                                                                           
                        data: {rowIndex: i - 1},
                        style: {
                            'grid-area': `${i} / 1 / span 1 / -1`
                        }                                                                                                                      
                    }))                                                                                                                                                  
                }                                                                                                                                                        
            }                                                                                                                                                            
        } 
    }
    
    _cellPatternToMatrix (pattern) {
        return (pattern || this.cellPattern).split(',').map(row =>
            row.trim().split(/\s+/).map(v => parseInt(v, 10)).filter(n => !isNaN(n) && n > 0)
        ).filter(row => row.length > 0)
    } 
    _cellMatrixToPattern (matrix) {
        return matrix.map(x => x.join(" ")).join(",")
    } 

    _removeHandles () {
        this.querySelectorAll(':scope > komp-masonry-handle').forEach(h => h.remove())
    }

    _onPointerDown (e) {
        const handle = e.target.closest('komp-masonry-handle')
        if (handle && this.resizable) {
            this._startResize(e, handle)
            return
        }
        if (this.reorderable) {
            if (this.handleSelector) {
                const grip = e.target.closest(this.handleSelector)
                if (!grip || !this.contains(grip)) return
            }
            const cell = e.target.closest(`${this.localName} > *`)
            if (cell) this._startReorder(e, cell)
        }
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
            const colPx = this._columnPx
            const patternMatrix = this._cellPatternToMatrix()
            const cellIndex = parseInt(handle.dataset.cellIndex, 10)
            const rowPattern = patternMatrix[rowIndex]
            const cell = handle.cell
            const startSpan = rowPattern[cellIndex]
            const startNeighborSpan = rowPattern[cellIndex + 1]
            const totalSpan = startSpan + startNeighborSpan

            const move = (ev) => {
                const delta = Math.round((ev.clientX - startX) / colPx)
                let newSpan = Math.min(Math.max(1, startSpan + delta), totalSpan - 1)
                let newNeighborSpan = totalSpan - newSpan
                rowPattern[cellIndex] = newSpan
                rowPattern[cellIndex + 1] = newNeighborSpan
                this.cellPattern = this._cellMatrixToPattern(patternMatrix)
            }
            const up = (ev) => {
                window.removeEventListener('pointermove', move)
                handle.classList.remove('active')
                this.releasePointerCapture(e.pointerId)
                this.cellPattern = patternMatrix.map(r => r.join(" ")).join(", ")
                this.trigger('resize', { detail: {
                    axis: 'column',
                    cellPattern: this.cellPattern,
                    rowIndex,
                    cellIndex,
                    span: rowPattern[cellIndex],
                    neighborSpan: rowPattern[cellIndex + 1]
                }})
            }
            window.addEventListener('pointermove', move)
            window.addEventListener('pointerup', up, { once: true })
        } else {
            // Row resize: redistribute the combined height of the row above
            // and the row below the handle. Other rows stay fixed. The
            // cyclic rowPattern is expanded to one entry per CSS row so the
            // change doesn't bleed into other rows that share its slot.
            const rowCount = Math.max(0, ...Array.from(this.cells, c => parseInt(c.dataset.rowIndex, 10))) + 1
            const rp = (this.rowPattern || '').split(/\s+/).filter(Boolean)
            const tracks = Array.from({ length: rowCount }, (_, i) => rp[i % rp.length] || 'auto')

            // Group cells by row so we can measure both rows' rendered heights
            const cellsByRow = []
            for (const c of this.cells) {
                const r = parseInt(c.dataset.rowIndex, 10)
                ;(cellsByRow[r] = cellsByRow[r] || []).push(c)
            }
            const heightOf = cells => Math.max(0, ...cells.map(c => c.offsetHeight))
            const startAbove = heightOf(cellsByRow[rowIndex] || [])
            const startBelow = heightOf(cellsByRow[rowIndex + 1] || [])
            const totalHeight = startAbove + startBelow
            const containerHeight = innerHeight(this) || 1

            const move = (ev) => {
                const dy = ev.clientY - startY
                const newAbove = Math.max(10, Math.min(totalHeight - 10, startAbove + dy))
                const newBelow = totalHeight - newAbove
                tracks[rowIndex]     = ((newAbove / containerHeight) * 100).toFixed(2) + '%'
                tracks[rowIndex + 1] = ((newBelow / containerHeight) * 100).toFixed(2) + '%'
                this.rowPattern = tracks.join(' ')
            }
            const up = () => {
                window.removeEventListener('pointermove', move)
                handle.classList.remove('active')
                this.releasePointerCapture(e.pointerId)
                this.trigger('resize', { detail: {
                    axis: 'row',
                    rowPattern: this.rowPattern,
                    rowIndex,
                    aboveHeight: tracks[rowIndex],
                    belowHeight: tracks[rowIndex + 1]
                }})
            }
            window.addEventListener('pointermove', move)
            window.addEventListener('pointerup', up, { once: true })
        }
    }
    
    get _columnPx () {
        const rect = this.getBoundingClientRect()
        const style = getComputedStyle(this)
        const padL = parseFloat(style.paddingLeft) || 0
        const padR = parseFloat(style.paddingRight) || 0
        const gap = parseFloat(style.columnGap) || 0
        const usable = rect.width - padL - padR
        const totalGap = gap * (this._columnCount - 1)
        return (usable - totalGap) / this._columnCount
    }

    _startReorder (e, cell) {
        e.preventDefault()
        this.setPointerCapture(e.pointerId)
        this.classList.add('reordering')
        cell.classList.add('dragging')

        // Snapshots for Escape revert and as the "from" reference for every
        // move event (each pointermove computes the resulting layout fresh
        // from the original state, not from the previous frame's state).
        const cellPatternWas = this.cellPattern
        const rowPatternWas = this.rowPattern
        const N = this._columnCount

        const cellsAtStart = Array.from(this.cells)
        const groupsAtStart = []
        cellsAtStart.forEach(c => {
            const r = parseInt(c.dataset.rowIndex, 10)
            ;(groupsAtStart[r] = groupsAtStart[r] || []).push(c)
        })
        const rawMatrix = this._cellPatternToMatrix(cellPatternWas)
        const expandedAtStart = groupsAtStart.map((_, r) => rawMatrix[r % rawMatrix.length].slice())
        const fromRow = parseInt(cell.dataset.rowIndex, 10)
        const fromCellIdx = parseInt(cell.dataset.cellIndex, 10)
        const draggedSpan = expandedAtStart[fromRow][fromCellIdx]

        const rect = cell.getBoundingClientRect()
        const grabX = e.clientX - rect.left
        const grabY = e.clientY - rect.top

        const clone = cell.cloneNode(true)
        clone.classList.add('komp-masonry-drag-clone')
        clone.style.position = 'fixed'
        clone.style.top = '0'
        clone.style.left = '0'
        clone.style.width = rect.width + 'px'
        clone.style.height = rect.height + 'px'
        clone.style.margin = '0'
        clone.style.transform = `translate(${rect.left}px, ${rect.top}px)`
        clone.style.gridColumn = '1'
        clone.style.gridRow = '1'
        this.prepend(clone)

        const distribute = (count) => {
            const base = Math.floor(N / count)
            const rem = N - base * count
            return Array.from({ length: count }, (_, i) => base + (i < rem ? 1 : 0))
        }

        let lastTargetKey = null

        const move = (ev) => {
            clone.style.transform = `translate(${ev.clientX - grabX}px, ${ev.clientY - grabY}px)`
            const target = this._findDropTarget(ev.clientX, ev.clientY, cell, Array.from(this.cells))
            if (!target || target.type == 'self') return
            const key = `${target.type}:${target.rowIndex ?? '-'}:${target.insertAt}`
            if (key === lastTargetKey) return
            lastTargetKey = key

            // Apply transformation *from the original* state — never compound
            // intermediate frames. This means every distinct target produces
            // one cellPatternChanged repaint, not one per pointermove.
            const groups = groupsAtStart.map(g => g.slice())
            const expanded = expandedAtStart.map(r => r.slice())

            groups[fromRow] = groups[fromRow].filter(c => c !== cell)
            expanded[fromRow].splice(fromCellIdx, 1)

            let toRow = target.type === 'into' ? target.rowIndex : target.insertAt

            if (target.type === 'into' && fromRow === target.rowIndex) {
                // Same-row reorder: keep the dragged cell's span, shuffle.
                groups[toRow].splice(target.insertAt, 0, cell)
                expanded[toRow].splice(target.insertAt, 0, draggedSpan)
            } else {
                // Source row: drop if empty, else redistribute evenly.
                if (groups[fromRow].length === 0) {
                    groups.splice(fromRow, 1)
                    expanded.splice(fromRow, 1)
                    if (toRow > fromRow) toRow--
                } else {
                    expanded[fromRow] = distribute(groups[fromRow].length)
                }
                if (target.type === 'into') {
                    groups[toRow].splice(target.insertAt, 0, cell)
                    expanded[toRow] = distribute(groups[toRow].length)
                } else {
                    // 'new' or 'between' — single-cell new row spanning all columns.
                    groups.splice(toRow, 0, [cell])
                    expanded.splice(toRow, 0, [N])
                }
            }

            // Reorder DOM so each cell is followed by its handle. Snapshot the
            // (cell, handle) pairs first because appendChild moves elements.
            const flat = groups.flat()
            const pairs = flat.map(c => {
                const h = c.nextElementSibling?.localName === 'komp-masonry-handle' ? c.nextElementSibling : null
                return [c, h]
            })
            pairs.forEach(([c, h]) => {
                this.appendChild(c)
                if (h) this.appendChild(h)
            })

            // One write per target change. cellPatternChanged repaints + updates dataset.
            this.cellPattern = expanded.map(r => r.join(' ')).join(', ')
        }

        const teardown = () => {
            window.removeEventListener('pointermove', move)
            window.removeEventListener('pointerup', up)
            window.removeEventListener('keydown', keydown)
            clone.remove()
            cell.classList.remove('dragging')
            this.classList.remove('reordering')
            try { this.releasePointerCapture(e.pointerId) } catch {}
        }
        const up = () => {
            teardown()
            if (cellPatternWas !== this.cellPattern) {
                this.trigger('reorder', { detail: { cellPattern: this.cellPattern } })
            }
        }
        const keydown = (ev) => {
            if (ev.key !== 'Escape') return
            // Revert: cellPatternChanged will repaint with the original pattern.
            // The dragged cell + its handle still need to be moved back to their
            // original DOM position so cellPatternChanged sees them in the right
            // order; rebuild the start-of-drag DOM order and reapply.
            const flat = groupsAtStart.flat()
            const pairs = flat.map(c => {
                const h = c.nextElementSibling?.localName === 'komp-masonry-handle' ? c.nextElementSibling : null
                return [c, h]
            })
            pairs.forEach(([c, h]) => {
                this.appendChild(c)
                if (h) this.appendChild(h)
            })
            this.cellPattern = cellPatternWas
            this.rowPattern = rowPatternWas
            teardown()
        }
        window.addEventListener('pointermove', move)
        window.addEventListener('pointerup', up)
        window.addEventListener('keydown', keydown)
    }

    /**
     * Resolve a pointer position to a drop target.
     * @returns {Object|null} `{ type: 'between', insertAt }` or
     *   `{ type: 'into', rowIndex, insertIndex }` or null when outside.
     */
    _findDropTarget (clientX, clientY, draggedCell, cells) {
        const myRect = this.getBoundingClientRect()
        const localY = clientY - myRect.top
        const localX = clientX - myRect.left

        // Group cells by their CSS row (dataset.rowIndex set by cellPatternChanged).
        // Indexed array — row gaps would leave holes, but in practice rows are
        // consecutive starting at 0.
        const rows = []
        for (const c of cells) {
            const r = parseInt(c.dataset.rowIndex, 10)
            ;(rows[r] = rows[r] || []).push(c)
        }
        const rowMetrics = rows.map(cs => ({
            top: Math.min(...cs.map(c => c.offsetTop)),
            bottom: Math.max(...cs.map(c => c.offsetTop + c.offsetHeight))
        }))
        
        // Between-row zones (8px tolerance around row edges)
        for (let i = 0; i < rowMetrics.length; i++) {
            const m = rowMetrics[i]
            if (i === 0 && localY < m.top + 8) {
                return { type: 'new', insertAt: 0 }
            }
            const edge = i === 0 ? m.top : (rowMetrics[i - 1].bottom + m.top) / 2
            if (Math.abs(localY - edge) < 8) {
                return { type: 'between', insertAt: i }
            }
        }
        const last = rowMetrics[rowMetrics.length - 1]
        if (last && localY > last.bottom - 8) {
            return { type: 'new', insertAt: rowMetrics.length }
        }

        // Into-row: find vertical band, then horizontal slot
        for (let i = 0; i < rowMetrics.length; i++) {
            const m = rowMetrics[i]
            if (localY >= m.top && localY <= m.bottom) {
                if (rows[i].length == 1 && rows[i][0] == draggedCell) {
                    return {type: 'self'}
                }
                const insertAt = this._computeInsertIndex(rows[i], draggedCell, localX)
                return { type: 'into', rowIndex: i, insertAt }
            }
        }
        return null
    }

    /**
     * Within `row`, find the index where `draggedCell` should be inserted
     * given a cursor X (in masonry-local coordinates). After insertion the
     * row will have N+1 cells (or N if the cell was already there) and
     * redistribute evenly, so we treat the row as N+1 equal-width slots.
     */
    _computeInsertIndex (cells, draggedCell, localX) {
        const otherCells = cells.filter(c => c !== draggedCell)
        if (otherCells.length === 0) return 0
        const lefts = otherCells.map(c => c.offsetLeft)
        const rights = otherCells.map(c => c.offsetLeft + c.offsetWidth)
        const rowLeft = Math.min(...lefts)
        const rowRight = Math.max(...rights)
        const K = otherCells.length + 1
        const slotWidth = (rowRight - rowLeft) / K
        if (slotWidth <= 0) return 0
        const slot = Math.floor((localX - rowLeft) / slotWidth)
        return Math.max(0, Math.min(K - 1, slot))
    }

    static style = `
        komp-masonry {
            display: grid;
            position: relative;
        }
        komp-masonry-handle {
            position: relative;
            z-index: 5;
            background: transparent;
            touch-action: none;
        }
        komp-masonry-handle.vertical {
            cursor: col-resize;
            justify-self: start;
            align-self: stretch;
            inline-size: 16px;
            margin-inline-start: calc(-8px - var(--komp-masonry-column-gap, 0px) / 2);
        }
        komp-masonry-handle.horizontal {
            cursor: row-resize;
            justify-self: stretch;
            align-self: end;
            block-size: 16px;
            margin-block-end: calc(-8px - var(--komp-masonry-row-gap, 0px) / 2);
        }
        komp-masonry-handle::after {
            content: '';
            position: absolute;
            pointer-events: none;
            background: transparent;
            transition: background 100ms ease;
        }
        komp-masonry-handle.vertical::after {
            inset-block: 0;
            inset-inline-start: 7px;
            inline-size: 2px;
        }
        komp-masonry-handle.horizontal::after {
            inset-inline: 0;
            inset-block-start: 7px;
            block-size: 2px;
        }
        komp-masonry-handle:hover::after {
            background: rgba(0, 0, 255, 0.5);
        }
        komp-masonry-handle.active::after {
            background: rgba(0, 0, 255, 0.9);
        }
        komp-masonry.reordering > *:not(komp-masonry-handle):not(komp-masonry-drop-indicator) {
            pointer-events: none;
        }
        komp-masonry > .dragging {
            opacity: 0.3;
        }
        .komp-masonry-drag-clone {
            pointer-events: none;
            opacity: 0.9;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
            z-index: 9999;
            will-change: transform;
        }
    `
    static { this.define() }
}
