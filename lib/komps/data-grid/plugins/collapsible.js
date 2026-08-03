/**
 * A plugin to make a {@link DataGrid}'s (and its subclasses', e.g. {@link Spreadsheet})
 * rows **collapsible** — the windowed counterpart of the Table `collapsible` plugin.
 *
 * The app sets a height budget for cell *content* via `collapseTo` (any valid CSS size).
 * Rows holding content that overflows that budget are flagged with a `collapsed`
 * attribute, and each overflowing cell is truncated to the whole lines that fit, ending
 * in an ellipsis (`-webkit-line-clamp`, with the line count derived from the budget and
 * the line-height — see `clampCell`). Hovering a truncated cell reveals an expand button
 * in its top-right corner, which expands the row to that cell's full content (and back).
 * Expanding sizes the row via `--expandTo`; the grid's normal measure/reflow pipeline
 * picks the new height up, so offsets, the mounted window, and the body scroll extent
 * stay correct.
 *
 * The budget applies to each cell's content block ({@link DataGridCell#contentElement}),
 * never to the cell: cells are grid items that stretch to their row's track, and capping
 * one detaches it from that track — its border-bottom stops meeting the row's edge and
 * the {@link Spreadsheet} selection box, drawn from the row geometry, outlines a box
 * taller than the cell. Bounding the block inside it leaves the cell alone, and gives the
 * clamp an ordinary block to work on, where it limits the height to the lines it kept
 * rather than only drawing an ellipsis. Because `collapseTo` sizes that block, it is a
 * content height: it excludes the cell's own padding and borders.
 *
 * Because DataGrid pools and recycles its row and cell elements, the expanded state is
 * kept on the persistent {@link DataGridRow} controller (`row.expandedColumns`, a Set of
 * {@link DataGridColumn}s) and re-applied to whatever live elements the row currently has
 * each time it (re)mounts or resizes — measured row heights already travel with the
 * controller, so an expanded row scrolled out of the window keeps its height and restores
 * its expansion when it scrolls back in.
 *
 * @function Plugin/DataGridCollapsible
 * @mixin
 *
 * @param {Object} [options={}] - Options added to the grid
 * @param {string} [options.collapseTo='auto'] - Valid CSS size for the max-height of a
 *   cell's content; excludes the cell's padding and borders, so `3lh` is three lines
 *
 * @example <caption>JS</caption>
 * import DataGrid from 'komps/komps/data-grid.js'
 * import { collapsible } from 'komps/komps/data-grid/plugins.js'
 * DataGrid.include(collapsible)
 * new DataGrid({
 *     style: 'height: 400px',
 *     collapseTo: '3lh',
 *     data: [...],
 *     columns: [...]
 * })
 */

import { createElement, listenerElement } from 'dolla'
import { expandIcon, collapseIcon } from '../../../icons.js'

/** An element's vertical padding + borders, in px. */
function verticalChrome (el) {
    const style = getComputedStyle(el)
    return parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
        + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth)
}

export default function (proto) {
    // assignableAttributes is shared up the prototype chain; clone before adding so a
    // plugin included on a subclass (Spreadsheet) doesn't leak options onto DataGrid.
    if (!Object.hasOwn(this, 'assignableAttributes')) {
        this.assignableAttributes = { ...this.assignableAttributes }
    }
    this.assignableAttributes.collapseTo = { type: 'string', default: 'auto', null: false }

    proto.collapseToChanged = function (was, now) {
        this.style.setProperty('--collapseTo', now)
    }

    const initializeWas = proto.initialize
    proto.initialize = function (...args) {
        // Re-check a row whenever its element resizes: content rendering in, --expandTo
        // changing, a column resize rewrapping cells. Observation also fires when it
        // starts, which gives each row its first check on mount (see syncMounted below).
        this.collapseObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                if (entry.target.row) this.checkRowCollapse(entry.target.row)
            }
        })
        // Interplay with the resizable plugin (order-independent — listens for its
        // event): dragging a row edge is the user explicitly setting that row's height,
        // so it replaces any expansion and becomes the row's clamp (see checkRowCollapse).
        this.addEventListener('rowResized', e => {
            e.detail.row.expandedColumns?.clear()
            this.checkRowCollapse(e.detail.row)
        })
        return initializeWas.call(this, ...args)
    }

    const disconnectedWas = proto.disconnected
    proto.disconnected = function (...args) {
        this.collapseObserver.disconnect()
        return disconnectedWas.call(this, ...args)
    }

    // unmount() scrubs style/class but not other attributes, so a recycled element can
    // carry collapse state from its previous binding — scrub it on acquire.
    const acquireRowElementWas = proto.acquireRowElement
    proto.acquireRowElement = function (...args) {
        const el = acquireRowElementWas.apply(this, args)
        el.removeAttribute('collapsed')
        return el
    }
    const acquireCellWas = proto.acquireCell
    proto.acquireCell = function (...args) {
        const cell = acquireCellWas.apply(this, args)
        cell.removeAttribute('collapse-toggle')
        cell.removeAttribute('clamped')
        cell.removeAttribute('budgeted')
        cell.style.removeProperty('--lineClamp')
        return cell
    }

    // Track the window: observe mounted row elements, drop pooled ones. Unobserving on
    // unmount matters beyond hygiene — it makes the observe() on remount a fresh
    // observation, whose initial fire runs the recycled element's first check even when
    // its size didn't change across bindings.
    const syncMountedWas = proto.syncMounted
    proto.syncMounted = function (...args) {
        syncMountedWas.apply(this, args)
        for (const el of this._rowPool) this.collapseObserver.unobserve(el)
        for (const row of this.mounted) this.collapseObserver.observe(row.element)
    }

    // Cells render after the loadRecords batch settles, which may not resize the row
    // (placeholder and clamped cells can land at the same height) — check explicitly.
    const renderCellsWas = this.Row.prototype.renderCells
    this.Row.prototype.renderCells = async function (...args) {
        await renderCellsWas.apply(this, args)
        if (this.mounted) this.grid.checkRowCollapse?.(this)
    }

    /**
     * Recompute the truncation state of one mounted row: re-apply its persisted
     * expansion, line-clamp the cells whose content doesn't fit, flag the element
     * `collapsed`, and (re)render the expand/collapse buttons. Idempotent — runs on every
     * resize of the row element, so it always rebuilds from controller state rather than
     * diffing. That it resizes the row as it goes is fine: the clamping happens inside one
     * synchronous call, and a ResizeObserver compares against the size at the end of the
     * frame, so a call that lands on the same result never re-triggers itself.
     */
    proto.checkRowCollapse = function (row) {
        const el = row.element
        if (!el || !row.cellsByColumn) return
        el.querySelectorAll(`${this.localName}-collapse-toggle`).forEach(t => t.remove())
        row.cellsByColumn.forEach(cell => cell.removeAttribute('collapse-toggle'))
        this.applyRowBudget(row)
        this.resetRowExpand(row)
        const overflowing = this.clampRowCells(row)
        el.toggleAttribute('collapsed', overflowing.length > 0)
        overflowing.forEach(([column, cell]) => this.renderCollapseToggle(row, column, cell, true))
        if (row.expandedCell) this.renderCollapseToggle(row, row.expandedColumn, row.expandedCell, false)
    }

    /**
     * The truncation budget in force for a cell, or null when it has none. Reading the
     * inherited `--collapseTo` per cell is what lets an app exempt a column — set
     * `--collapseTo: none` on it — from a grid-wide budget: a cell holding an avatar or an
     * icon button is taller than a line of text, which would otherwise read as overflow
     * and offer to expand content that was never cut off.
     */
    proto.cellBudget = function (cell) {
        const value = getComputedStyle(cell).getPropertyValue('--collapseTo').trim()
        return (!value || value === 'none' || value === 'auto') ? null : value
    }

    /**
     * Give each cell of a row the box its content should be bounded in — and cells with no
     * budget none at all, leaving their content block `display: contents` so they lay out
     * exactly as they would without this plugin.
     *
     * The budget itself is the inherited `--collapseTo`, applied to the block in CSS. A
     * manually resized row (resizable plugin) truncates within its dragged height instead;
     * that is a *row* height, so each cell's padding and borders come out of it first.
     */
    proto.applyRowBudget = function (row) {
        row.cellsByColumn.forEach(cell => {
            const box = cell.contentElement.style
            // `budgeted` is what gives the block a box, in CSS rather than inline: the
            // clamp needs to set `display: -webkit-box` on it later, and an inline display
            // would win over that — costing the ellipsis, which only the legacy box draws.
            if (!this.cellBudget(cell)) {
                cell.removeAttribute('budgeted')
                box.removeProperty('max-height')
                return
            }
            cell.setAttribute('budgeted', '')
            if (row._resizedHeight) {
                box.maxHeight = Math.max(0, row.height - verticalChrome(cell)) + 'px'
            } else {
                box.removeProperty('max-height')
            }
        })
    }

    /**
     * One measure/clamp pass over a row's cells: clear any existing clamp, find the cells
     * whose content doesn't fit its budget, and clamp each to whole lines.
     *
     * Measuring every cell before clamping any of them matters — cells stretch to the
     * row's track, so clamping one mid-loop moves the boxes still to be measured.
     *
     * @returns {Array} the truncated cells, as `[column, cell]` pairs
     */
    proto.clampRowCells = function (row) {
        row.cellsByColumn.forEach(cell => {
            cell.removeAttribute('clamped')
            cell.style.removeProperty('--lineClamp')
        })
        const overflowing = []
        row.cellsByColumn.forEach((cell, column) => {
            const box = cell.contentElement
            if (cell !== row.expandedCell && box.scrollHeight - box.clientHeight > 1) {
                overflowing.push([column, cell])
            }
        })
        overflowing.forEach(([, cell]) => this.clampCell(cell))
        return overflowing
    }

    /**
     * Truncate one overflowing cell to whole lines with a trailing ellipsis, by
     * translating its budget into a line count for `-webkit-line-clamp` (CSS can't floor a
     * division, so the count is computed here and published as `--lineClamp`).
     *
     * The content block's own box is the budget: this only runs for cells that overflow,
     * which means `max-height` is holding the block at the budget already — so measuring
     * it resolves whatever unit the app wrote `collapseTo` in, at sub-pixel precision,
     * with no percentage or `box-sizing` special cases.
     *
     * The block is then pinned to exactly those lines. The clamp doesn't do that on its
     * own: the lines past the ellipsis are still laid out, so the box keeps the budget's
     * full height, and a budget that isn't a whole number of lines leaves a few pixels at
     * the bottom for the next line to show through. Pinning it also leaves the cell around
     * the block free to go on stretching to its row's track. An app that leaves
     * `line-height: normal` on its cells gets an approximation (1.2em) — set an explicit
     * line-height for exact fits.
     */
    proto.clampCell = function (cell) {
        const box = cell.contentElement
        const style = getComputedStyle(box)
        const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2
        if (!(lineHeight > 0)) return
        const content = box.getBoundingClientRect().height - verticalChrome(box)
        if (!(content > 0)) return
        // The epsilon keeps a budget that is a whole number of lines on paper (3 × 18.2px)
        // from losing one to float error in the measurement.
        const lines = Math.max(1, Math.floor(content / lineHeight + 0.02))
        cell.style.setProperty('--lineClamp', String(lines))
        // Re-set from the budget on the next pass, by applyRowBudget.
        box.style.maxHeight = lines * lineHeight + verticalChrome(box) + 'px'
        cell.setAttribute('clamped', '')
    }

    /**
     * Re-apply a row's expansion from its controller state: of the columns the user has
     * expanded, size the row to the tallest one's full content via `--expandTo` (cleared
     * when nothing is expanded). The live cell is re-resolved on every pass because cell
     * elements are pooled; a stale column (spliced out) simply resolves to no cell.
     */
    proto.resetRowExpand = function (row) {
        const el = row.element
        el.style.removeProperty('--expandTo')
        row.expandedColumns ??= new Set()
        row.expandedColumn = null
        row.expandedCell = null
        for (const column of row.expandedColumns) {
            const cell = row.cellOf(column)
            if (cell && (!row.expandedCell ||
                cell.contentElement.scrollHeight > row.expandedCell.contentElement.scrollHeight)) {
                row.expandedColumn = column
                row.expandedCell = cell
            }
        }
        if (row.expandedCell) {
            // Measure unclamped so nested max-height content can't under-report. Note this
            // is the *content* height, which is what --expandTo bounds.
            const box = row.expandedCell.contentElement
            const budget = box.style.maxHeight // applyRowBudget's, if this row was dragged
            box.style.setProperty('max-height', 'unset')
            el.style.setProperty('--expandTo', box.scrollHeight + 'px')
            box.style.maxHeight = budget
        }
    }

    proto.renderCollapseToggle = function (row, column, cell, expand = true) {
        cell.setAttribute('collapse-toggle', expand ? 'expand' : 'collapse')
        const toggle = createElement(`${this.localName}-collapse-toggle`, {
            class: cell.classList.contains('frozen') ? 'frozen' : '',
            style: { 'grid-column': String(column.index + 1) },
            content: listenerElement({
                type: 'button',
                'aria-label': expand ? 'Expand row' : 'Collapse row',
                title: expand ? 'Expand row' : 'Collapse row',
                content: expand ? expandIcon() : collapseIcon()
            }, () => {
                row.expandedColumns ??= new Set()
                if (expand) {
                    row.expandedColumns.add(column)
                    // Expanding means "size to content" — release a manual resize
                    // (resizable plugin) so the forced height can't pin the row.
                    if (row._resizedHeight) {
                        row._resizedHeight = false
                        row.element.style.height = ''
                    }
                } else {
                    row.expandedColumns.clear()
                }
                this.checkRowCollapse(row)
            })
        })
        if (cell.classList.contains('frozen')) toggle.style.left = cell.style.left
        // Keep the toggle from starting a selection / edit underneath (Spreadsheet).
        toggle.addEventListener('pointerdown', e => e.stopPropagation())
        toggle.addEventListener('mousedown', e => e.stopPropagation())
        // after for css psuedo class support
        cell.after(toggle)
    }

    if (!Array.isArray(this.style)) this.style = [this.style]
    this.style.push(function () { return `
        ${this.tagName} {
            --collapseTo: auto;
        }
        /* The budget bounds each cell's content block, not the cell, so cells go on
           stretching to their row's track: their border-bottom keeps meeting the row's
           edge, and a Spreadsheet selection box (drawn from the row geometry) keeps
           matching the cell it outlines. The block clips its own overflow, and once
           clamped it shrinks to the lines it kept — leaving no slack for the line after
           the ellipsis to paint into. */
        /* Only cells with a budget give the block a box; the rest leave it at the core
           styles' display: contents, laying out as if it weren't there. */
        ${this.tagName}-cell[budgeted] > ${this.tagName}-cell-content {
            display: block;
            max-height: var(--expandTo, var(--collapseTo));
            overflow: hidden;
            min-width: 0;
            /* The block clips now, so an app's cell-level ellipsis has to reach it —
               text-overflow doesn't inherit on its own. */
            text-overflow: inherit;
        }
        /* Later than the rule above, and no more specific, so this display wins. */
        ${this.tagName}-cell[clamped] > ${this.tagName}-cell-content {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: var(--lineClamp, 1);
        }
        ${this.tagName}-collapse-toggle {
            display: flex;
            align-items: start;
            justify-content: end;
            grid-row: 1 / -1;
            /* Above Spreadsheet's active cell (z 3) so the button stays clickable */
            z-index: 4;
            pointer-events: none;
            opacity: 0;
            transition: opacity 100ms ease;
            padding: 3px;
        }
        ${this.tagName}-cell[collapse-toggle]:hover + ${this.tagName}-collapse-toggle,
        ${this.tagName}-collapse-toggle:hover {
            opacity: 1;
        }
        ${this.tagName}-collapse-toggle.frozen {
            position: sticky;
            z-index: 6;
        }
        ${this.tagName}-collapse-toggle button {
            appearance: none;
            padding: 2px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: inherit;
            cursor: pointer;
            background: var(--dg-cell-bg, white);
            border: 1px solid rgba(0, 0, 0, 0.2);
            border-radius: 3px;
            box-shadow: 0 0 0 2px var(--dg-cell-bg, white), 0 1px 2px rgba(0, 0, 0, 0.12);
            pointer-events: auto;
        }
        ${this.tagName}-collapse-toggle button svg {
            opacity: 0.65;
        }
        ${this.tagName}-collapse-toggle button:hover {
            color: var(--select-color, #1a73e8);
            border-color: currentColor;
        }
        ${this.tagName}-collapse-toggle button:hover svg {
            opacity: 1;
        }
    `})
}
