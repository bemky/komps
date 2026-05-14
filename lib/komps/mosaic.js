/**
 * A managed CSS-Grid container. The mosaic sizes the grid
 * (`columnCount` × `rowHeight`); each child cell declares its own
 * `grid-area`. When `resizable` or `reorderable` is on, drag interactions
 * update the affected cell's `grid-area` in place and run a "bump down"
 * pass: any cell that would overlap the moved/resized cell is shifted
 * down by enough rows to clear, cascading as needed.
 *
 * @class Mosaic
 * @extends KompElement
 *
 * @param {Object} [options={}]
 * @param {number} [options.columnCount=12] - Number of grid columns.
 * @param {number} [options.rowHeight] - Row height in pixels. Defaults to `offsetWidth / columnCount` (square cells), tracked via ResizeObserver.
 * @param {boolean} [options.resizable=false] - Render per-cell drag handles for live resizing.
 * @param {boolean} [options.reorderable=false] - Drag a cell to reposition it on the grid; cells in the way bump down.
 * @param {string} [options.handleSelector] - When set, only `pointerdown` on a matching descendant of a cell starts a reorder. Has no effect when `reorderable` is false.
 * @param {string|HTMLElement|Array|Object} [options.content] - Initial children. Each must declare its own `grid-area`.
 *
 * @fires Mosaic#resize
 * @fires Mosaic#reorder
 *
 * Each cell whose grid-area changes also gets a bubbling
 * `gridAreaChanged` event with `event.detail = { rect, previousRect }`.
 * Includes cells that moved only because they were bumped by the cascade.
 * Fires once at the end of a resize/reorder, not on intermediate paints.
 *
 * @example
 * new Mosaic({
 *     columnCount: 12,
 *     rowHeight: 100,
 *     resizable: true,
 *     reorderable: true,
 *     content: items.map((item, i) => createElement('div', {
 *         style: { gridArea: `${i + 1} / 1 / span 1 / span 4` },
 *         content: item.label
 *     }))
 * })
 */

/**
 * Fired after a resize. `event.detail` is `{ cell, axis, edge, rect }`.
 * @event Mosaic#resize
 */

/**
 * Fired after a reorder. `event.detail` is `{ cell, rect }`.
 * @event Mosaic#reorder
 */

import { createElement } from 'dolla';
import KompElement from './element.js';

// Resolve a grid-line computed value to an absolute line number.
// Handles "auto", "span N", and explicit "N". `start` is the resolved
// start-line of the same axis (used to expand "span N" into N + start).
function parseLine (val, start) {
    if (typeof val !== 'string' || val === 'auto') return NaN
    if (val.startsWith('span ')) return start + parseInt(val.slice(5), 10)
    return parseInt(val, 10)
}

export default class Mosaic extends KompElement {
    static tagName = 'komp-mosaic'

    static assignableAttributes = {
        columnCount: { type: 'number', default: 12, null: false },
        rowHeight: { type: 'number', default: null, null: true },
        resizable: { type: 'boolean', default: false, null: false },
        reorderable: { type: 'boolean', default: false, null: false },
        handleSelector: { type: 'string', default: null, null: true }
    }

    static watch = ['columnCount', 'rowHeight', 'resizable', 'reorderable']
    static events = ['resize', 'reorder']
    static bindMethods = ['_onPointerDown', '_onMutation', '_onContainerResize']

    initialize () {
        super.initialize()
        this._mutationObserver = new MutationObserver(this._onMutation)
        this._resizeObserver = new ResizeObserver(this._onContainerResize)
        this.addEventListener('pointerdown', this._onPointerDown)

        // Snapshot the current row/column gap so handles can offset their
        // negative margin into the gap center via CSS vars (no per-handle JS
        // math). One-shot — may go stale if `gap` changes after mount.
        const computed = getComputedStyle(this)
        const shorthand = (computed.gap || '').split(/\s+/).filter(Boolean)
        const rowGap = computed.rowGap || shorthand[0] || '0px'
        const colGap = computed.columnGap || shorthand[1] || shorthand[0] || '0px'
        this.style.setProperty('--komp-mosaic-column-gap', colGap)
        this.style.setProperty('--komp-mosaic-row-gap', rowGap)
    }

    connected () {
        this._mutationObserver?.observe(this, { childList: true })
        this._resizeObserver?.observe(this)
        this._applyGridTemplate()
        if (this.resizable) {
            for (const cell of this.cells) this._ensureCellHandles(cell)
        }
    }

    disconnected () {
        this._mutationObserver?.disconnect()
        this._resizeObserver?.disconnect()
    }

    columnCountChanged () {
        this._applyGridTemplate()
    }
    rowHeightChanged () {
        this._applyGridTemplate()
    }
    resizableChanged () {
        for (const cell of this.cells) {
            if (this.resizable) this._ensureCellHandles(cell)
            else this._removeCellHandles(cell)
        }
    }

    /** Direct children that aren't internal handle or drag-clone elements. */
    get cells () {
        return this.querySelectorAll(':scope > *:not(komp-mosaic-handle):not(.komp-mosaic-drag-clone)')
    }

    _isCell (node) {
        return node.localName !== 'komp-mosaic-handle' &&
               !node.classList.contains('komp-mosaic-drag-clone')
    }

    _onContainerResize () {
        // Recompute only when rowHeight is implicit (offsetWidth-driven).
        if (this.rowHeight == null) this._applyGridTemplate()
    }

    _onMutation (mutations) {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.nodeType === 1 && this._isCell(node) && this.resizable) {
                    this._ensureCellHandles(node)
                }
            }
            for (const node of m.removedNodes) {
                if (node.nodeType === 1 && this._isCell(node)) {
                    this._removeCellHandles(node)
                }
            }
        }
    }

    _applyGridTemplate () {
        const cols = this.columnCount
        const h = this.rowHeight ?? (this.offsetWidth / cols)
        this.style.gridTemplateColumns = `repeat(${cols}, 1fr)`
        this.style.gridAutoRows = `${h}px`
        // Cell pixel sizes may have changed; reposition handles.
        if (this.resizable) {
            for (const cell of this.cells) this._positionCellHandles(cell)
        }
    }

    /** Read a cell's grid placement as a `{rowStart, colStart, rowEnd, colEnd}` rect (grid line numbers). */
    _rectOf (cell) {
        const cs = getComputedStyle(cell)
        const rowStart = parseLine(cs.gridRowStart, 0)
        const colStart = parseLine(cs.gridColumnStart, 0)
        const rowEnd = parseLine(cs.gridRowEnd, rowStart)
        const colEnd = parseLine(cs.gridColumnEnd, colStart)
        if ([rowStart, rowEnd, colStart, colEnd].some(n => isNaN(n))) return null
        return { rowStart, colStart, rowEnd, colEnd }
    }

    _setRect (cell, r) {
        cell.style.gridRowStart = r.rowStart
        cell.style.gridRowEnd = r.rowEnd
        cell.style.gridColumnStart = r.colStart
        cell.style.gridColumnEnd = r.colEnd
        this._positionCellHandles(cell)
    }

    _ensureCellHandles (cell) {
        cell._handles ??= {}
        for (const edge of ['top', 'right', 'bottom', 'left']) {
            if (cell._handles[edge]) continue
            const axis = (edge === 'left' || edge === 'right') ? 'vertical' : 'horizontal'
            const h = createElement('komp-mosaic-handle', {
                class: axis,
                data: { edge }
            })
            h.cell = cell
            cell._handles[edge] = h
            this.appendChild(h)
        }
        this._positionCellHandles(cell)
    }

    _removeCellHandles (cell) {
        for (const h of Object.values(cell._handles || {})) h.remove()
        delete cell._handles
    }

    _positionCellHandles (cell) {
        const r = this._rectOf(cell)
        if (!r || !cell._handles) return
        // Each handle occupies a 1-track-thick grid area pinned to its edge.
        // CSS (justify/align-self + negative margin) centers the hit area on
        // the cell boundary / gap.
        const slots = {
            right:  { rowStart: r.rowStart,     rowEnd: r.rowEnd,         colStart: r.colEnd - 1, colEnd: r.colEnd },
            left:   { rowStart: r.rowStart,     rowEnd: r.rowEnd,         colStart: r.colStart,   colEnd: r.colStart + 1 },
            bottom: { rowStart: r.rowEnd - 1,   rowEnd: r.rowEnd,         colStart: r.colStart,   colEnd: r.colEnd },
            top:    { rowStart: r.rowStart,     rowEnd: r.rowStart + 1,   colStart: r.colStart,   colEnd: r.colEnd },
        }
        for (const [edge, h] of Object.entries(cell._handles)) {
            const s = slots[edge]
            h.style.gridRowStart = s.rowStart
            h.style.gridRowEnd = s.rowEnd
            h.style.gridColumnStart = s.colStart
            h.style.gridColumnEnd = s.colEnd
        }
    }

    _onPointerDown (e) {
        const handle = e.target.closest('komp-mosaic-handle')
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
            if (cell && this._isCell(cell)) this._startReorder(e, cell)
        }
    }

    _overlaps (a, b) {
        return a.rowStart < b.rowEnd && a.rowEnd > b.rowStart &&
               a.colStart < b.colEnd && a.colEnd > b.colStart
    }

    /**
     * Apply `newRect` to `movedCell` inside `rects` and bump any cells it
     * collides with downward by enough rows to clear. Bumps cascade: a
     * bumped cell that now overlaps another also pushes it down. Columns
     * are preserved — only row lines move.
     */
    _resolveCollisions (movedCell, newRect, rects) {
        rects.set(movedCell, newRect)
        const queue = [movedCell]
        while (queue.length) {
            const c = queue.shift()
            const cr = rects.get(c)
            for (const [other, or] of rects) {
                if (other === c) continue
                if (!this._overlaps(cr, or)) continue
                const bump = cr.rowEnd - or.rowStart
                rects.set(other, {
                    rowStart: or.rowStart + bump,
                    rowEnd: or.rowEnd + bump,
                    colStart: or.colStart,
                    colEnd: or.colEnd
                })
                queue.push(other)
            }
        }
    }

    _snapshotRects () {
        const rects = new Map()
        for (const c of this.cells) {
            const r = this._rectOf(c)
            if (r) rects.set(c, r)
        }
        return rects
    }

    /**
     * Compare current cell rects against `startRects` and dispatch a bubbling
     * `gridAreaChanged` event on every cell whose rect differs.
     * `event.detail = { rect, previousRect }`. Called once at the end of a
     * resize or reorder — never on intermediate paints — so listeners can
     * react without per-frame overhead.
     */
    _emitGridAreaChanges (startRects) {
        for (const cell of this.cells) {
            const previousRect = startRects.get(cell)
            if (!previousRect) continue
            const rect = this._rectOf(cell)
            if (!rect) continue
            if (rect.rowStart === previousRect.rowStart && rect.colStart === previousRect.colStart &&
                rect.rowEnd === previousRect.rowEnd && rect.colEnd === previousRect.colEnd) continue
            cell.dispatchEvent(new CustomEvent('gridAreaChanged', {
                detail: { rect, previousRect },
                bubbles: true
            }))
        }
    }

    /**
     * Cells abutting `cell` along `edge` whose perpendicular extent fits
     * inside the cell's. A split-resize moves these in lockstep with the
     * dragged edge — wider neighbors fall through to the collision cascade
     * so they're bumped instead of clamping the drag to zero.
     */
    _edgeNeighbors (cell, rects, edge) {
        const ar = rects.get(cell)
        const ns = []
        for (const [other, or] of rects) {
            if (other === cell) continue
            let fits = false
            switch (edge) {
                case 'right':  fits = or.colStart === ar.colEnd   && or.rowStart >= ar.rowStart && or.rowEnd <= ar.rowEnd; break
                case 'left':   fits = or.colEnd   === ar.colStart && or.rowStart >= ar.rowStart && or.rowEnd <= ar.rowEnd; break
                case 'bottom': fits = or.rowStart === ar.rowEnd   && or.colStart >= ar.colStart && or.colEnd <= ar.colEnd; break
                case 'top':    fits = or.rowEnd   === ar.rowStart && or.colStart >= ar.colStart && or.colEnd <= ar.colEnd; break
            }
            if (fits) ns.push(other)
        }
        return ns
    }

    _startResize (e, handle) {
        e.preventDefault()
        this.setPointerCapture(e.pointerId)
        handle.classList.add('active')

        const cell = handle.cell
        const edge = handle.dataset.edge
        const isVertical = edge === 'left' || edge === 'right'
        const isEnd = edge === 'right' || edge === 'bottom'
        // Which line of the cell moves, and which line of each neighbor mirrors it.
        // right:  cell.colEnd ↔ neighbor.colStart   left:  cell.colStart ↔ neighbor.colEnd
        // bottom: cell.rowEnd ↔ neighbor.rowStart   top:   cell.rowStart ↔ neighbor.rowEnd
        const cellKey = isVertical ? (isEnd ? 'colEnd' : 'colStart') : (isEnd ? 'rowEnd' : 'rowStart')
        const neighborKey = isVertical ? (isEnd ? 'colStart' : 'colEnd') : (isEnd ? 'rowStart' : 'rowEnd')
        const startKey = isVertical ? 'colStart' : 'rowStart'
        const endKey = isVertical ? 'colEnd' : 'rowEnd'

        const startRect = this._rectOf(cell)
        if (!startRect) return

        const cellBR = cell.getBoundingClientRect()
        const colPx = cellBR.width / (startRect.colEnd - startRect.colStart)
        const rowPx = cellBR.height / (startRect.rowEnd - startRect.rowStart)
        const startX = e.clientX
        const startY = e.clientY

        const startRects = this._snapshotRects()
        const working = new Map(startRects)
        // Neighbors at minimum size on the resize axis can't shrink any
        // further — exclude them so the boundary isn't frozen. The collision
        // cascade picks them up and bumps them instead.
        const neighbors = this._edgeNeighbors(cell, startRects, edge).filter(n => {
            const nr = startRects.get(n)
            return (isVertical ? nr.colEnd - nr.colStart : nr.rowEnd - nr.rowStart) > 1
        })

        // Clamp the drag so neither the dragged cell nor any neighbor falls
        // below 1 unit on the resize axis. The cell shrinks when its dragged
        // edge moves inward; each neighbor shrinks when its mirror edge moves
        // outward (toward its own far edge).
        let minDelta, maxDelta
        if (isEnd) {
            minDelta = startRect[startKey] + 1 - startRect[cellKey]
            maxDelta = neighbors.length
                ? Math.min(...neighbors.map(n => {
                    const nr = startRects.get(n)
                    return nr[endKey] - 1 - nr[neighborKey]
                }))
                : (isVertical ? this.columnCount + 1 - startRect.colEnd : Infinity)
        } else {
            maxDelta = startRect[endKey] - 1 - startRect[cellKey]
            minDelta = neighbors.length
                ? Math.max(...neighbors.map(n => {
                    const nr = startRects.get(n)
                    return nr[startKey] + 1 - nr[neighborKey]
                }))
                : (1 - startRect[cellKey])
        }

        const move = (ev) => {
            const raw = isVertical
                ? Math.round((ev.clientX - startX) / colPx)
                : Math.round((ev.clientY - startY) / rowPx)
            const delta = Math.max(minDelta, Math.min(maxDelta, raw))

            // Reset every frame so deltas apply to the start state, not the
            // accumulating intermediate one.
            for (const [c, r] of startRects) working.set(c, { ...r })

            // Shift each neighbor's mirror line by `delta` so the boundary
            // moves in lockstep with the cell's edge.
            for (const n of neighbors) {
                const ns = startRects.get(n)
                working.set(n, { ...ns, [neighborKey]: ns[neighborKey] + delta })
            }

            const newRect = { ...startRect, [cellKey]: startRect[cellKey] + delta }

            // Run the cascade in case the cell grew into a non-adjacent cell.
            this._resolveCollisions(cell, newRect, working)
            for (const [c, r] of working) this._setRect(c, r)
        }
        const up = () => {
            window.removeEventListener('pointermove', move)
            handle.classList.remove('active')
            this.releasePointerCapture(e.pointerId)
            this._emitGridAreaChanges(startRects)
            const finalRect = this._rectOf(cell)
            if (finalRect && finalRect[cellKey] !== startRect[cellKey]) {
                this.trigger('resize', { detail: {
                    axis: isVertical ? 'column' : 'row',
                    edge,
                    cell,
                    rect: finalRect
                }})
            }
        }
        window.addEventListener('pointermove', move)
        window.addEventListener('pointerup', up, { once: true })
    }

    _startReorder (e, cell) {
        e.preventDefault()
        this.setPointerCapture(e.pointerId)
        this.classList.add('reordering')
        cell.classList.add('dragging')

        const startRect = this._rectOf(cell)
        if (!startRect) return
        const colSpan = startRect.colEnd - startRect.colStart
        const rowSpan = startRect.rowEnd - startRect.rowStart

        const cellBR = cell.getBoundingClientRect()
        const myBR = this.getBoundingClientRect()
        const colPx = myBR.width / this.columnCount
        const rowPx = cellBR.height / rowSpan

        const grabX = e.clientX - cellBR.left
        const grabY = e.clientY - cellBR.top

        const startRects = this._snapshotRects()
        const working = new Map(startRects)

        const clone = cell.cloneNode(true)
        clone.classList.add('komp-mosaic-drag-clone')
        clone.style.position = 'fixed'
        clone.style.top = '0'
        clone.style.left = '0'
        clone.style.width = cellBR.width + 'px'
        clone.style.height = cellBR.height + 'px'
        clone.style.margin = '0'
        clone.style.transform = `translate(${cellBR.left}px, ${cellBR.top}px)`
        clone.style.gridColumn = '1'
        clone.style.gridRow = '1'
        this.prepend(clone)

        const move = (ev) => {
            clone.style.transform = `translate(${ev.clientX - grabX}px, ${ev.clientY - grabY}px)`

            // Snap the cell's top-left to the nearest grid line under the cursor,
            // preserving the cursor's grab offset.
            const targetX = ev.clientX - myBR.left - grabX
            const targetY = ev.clientY - myBR.top - grabY
            let colStart = Math.round(targetX / colPx) + 1
            let rowStart = Math.round(targetY / rowPx) + 1
            colStart = Math.max(1, Math.min(this.columnCount + 1 - colSpan, colStart))
            rowStart = Math.max(1, rowStart)
            const newRect = { rowStart, colStart, rowEnd: rowStart + rowSpan, colEnd: colStart + colSpan }

            for (const [c, r] of startRects) working.set(c, { ...r })
            this._resolveCollisions(cell, newRect, working)
            for (const [c, r] of working) this._setRect(c, r)
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
            this._emitGridAreaChanges(startRects)
            const finalRect = this._rectOf(cell)
            if (finalRect && (finalRect.rowStart !== startRect.rowStart || finalRect.colStart !== startRect.colStart)) {
                this.trigger('reorder', { detail: { cell, rect: finalRect } })
            }
        }
        const keydown = (ev) => {
            if (ev.key !== 'Escape') return
            for (const [c, r] of startRects) this._setRect(c, r)
            teardown()
        }
        window.addEventListener('pointermove', move)
        window.addEventListener('pointerup', up)
        window.addEventListener('keydown', keydown)
    }

    static style = `
        komp-mosaic {
            display: grid;
            position: relative;
        }
        komp-mosaic.reordering {
            cursor: grabbing;
        }
        komp-mosaic-handle {
            position: relative;
            z-index: 5;
            background: transparent;
            touch-action: none;
        }
        /* Where a left/top handle shares a boundary with another cell's
           right/bottom handle, the right/bottom one wins the click — its
           cell can grow into the boundary; the opposing cell would need to
           shrink (often impossible for 1-track cells). */
        komp-mosaic-handle[data-edge="right"],
        komp-mosaic-handle[data-edge="bottom"] {
            z-index: 6;
        }
        komp-mosaic-handle.vertical {
            cursor: col-resize;
            align-self: stretch;
            inline-size: 16px;
        }
        komp-mosaic-handle.vertical[data-edge="right"] {
            justify-self: end;
            margin-inline-end: calc(-8px - var(--komp-mosaic-column-gap, 0px) / 2);
        }
        komp-mosaic-handle.vertical[data-edge="left"] {
            justify-self: start;
            margin-inline-start: calc(-8px - var(--komp-mosaic-column-gap, 0px) / 2);
        }
        komp-mosaic-handle.horizontal {
            cursor: row-resize;
            justify-self: stretch;
            block-size: 16px;
        }
        komp-mosaic-handle.horizontal[data-edge="bottom"] {
            align-self: end;
            margin-block-end: calc(-8px - var(--komp-mosaic-row-gap, 0px) / 2);
        }
        komp-mosaic-handle.horizontal[data-edge="top"] {
            align-self: start;
            margin-block-start: calc(-8px - var(--komp-mosaic-row-gap, 0px) / 2);
        }
        komp-mosaic-handle::after {
            content: '';
            position: absolute;
            pointer-events: none;
            background: transparent;
            transition: background 100ms ease;
        }
        komp-mosaic-handle.vertical::after {
            inset-block: 0;
            inset-inline-start: 7px;
            inline-size: 2px;
        }
        komp-mosaic-handle.horizontal::after {
            inset-inline: 0;
            inset-block-start: 7px;
            block-size: 2px;
        }
        komp-mosaic-handle:hover::after {
            background: rgba(0, 0, 255, 0.5);
        }
        komp-mosaic-handle.active::after {
            background: rgba(0, 0, 255, 0.9);
        }
        komp-mosaic.reordering > *:not(komp-mosaic-handle):not(.komp-mosaic-drag-clone) {
            pointer-events: none;
        }
        komp-mosaic > .dragging {
            opacity: 0.3;
            cursor: grabbing;
        }
        .komp-mosaic-drag-clone {
            pointer-events: none;
            opacity: 0.9;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
            z-index: 9999;
            will-change: transform;
        }
    `
    static { this.define() }
}
