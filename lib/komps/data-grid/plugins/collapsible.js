/**
 * A plugin to make a {@link DataGrid}'s (and its subclasses', e.g. {@link Spreadsheet})
 * rows **collapsible** — the windowed counterpart of the Table `collapsible` plugin.
 *
 * The app sets a height budget for rows via `collapseTo` (any valid CSS size). Rows whose
 * cell content overflows that budget are flagged with a `collapsed` attribute, and each
 * overflowing cell is truncated to the whole lines that fit, ending in an ellipsis
 * (`-webkit-line-clamp`, with the line count derived from the budget and the cell's
 * line-height — see `clampCell`). Hovering a truncated cell reveals an expand button in
 * its top-right corner, which expands the row to that cell's full content (and back).
 * Expanding sizes the row via `--expandTo`; the grid's normal measure/reflow pipeline
 * picks the new height up, so offsets, the mounted window, and the body scroll extent
 * stay correct.
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
 * @param {string} [options.collapseTo='auto'] - Valid CSS size for the rows' max-height
 *
 * @example <caption>JS</caption>
 * import DataGrid from 'komps/komps/data-grid.js'
 * import { collapsible } from 'komps/komps/data-grid/plugins.js'
 * DataGrid.include(collapsible)
 * new DataGrid({
 *     style: 'height: 400px',
 *     collapseTo: '50px',
 *     data: [...],
 *     columns: [...]
 * })
 */

import { createElement, listenerElement } from 'dolla'
import { expandIcon, collapseIcon } from '../../../icons.js'

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
        cell.style.removeProperty('--lineClamp')
        cell.style.removeProperty('--clampHeight')
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
        // A manually resized row (resizable plugin) uses its height as the clamp:
        // publish it as this row's --collapseTo so cells stretch/truncate to the
        // forced height instead of stopping at the grid-wide budget.
        if (row._resizedHeight) {
            el.style.setProperty('--collapseTo', row.height + 'px')
        } else {
            el.style.removeProperty('--collapseTo')
        }
        this.resetRowExpand(row)
        let { overflowing, clampHeight } = this.clampRowCells(row)
        // Pull the row's own budget down to the tallest clamped cell so the track hugs
        // whole lines too — otherwise a cell that merely fit the app's budget (2½ lines,
        // say) holds the track taller than the clamped cells, and the slack under them is
        // exactly where the line after the ellipsis would show. Skipped for a manually
        // resized row: the dragged height is the user's, ours to clamp within.
        if (clampHeight && !row._resizedHeight) {
            el.style.setProperty('--collapseTo', clampHeight + 'px')
            // Measure once more, because the lowered budget can truncate a cell that fit
            // the app's budget. Stable after this second pass — the tallest clamped cell
            // now measures exactly the budget, and re-clamping N whole lines gives N.
            overflowing = this.clampRowCells(row).overflowing
        }
        el.toggleAttribute('collapsed', overflowing.length > 0)
        overflowing.forEach(([column, cell]) => this.renderCollapseToggle(row, column, cell, true))
        if (row.expandedCell) this.renderCollapseToggle(row, row.expandedColumn, row.expandedCell, false)
    }

    /**
     * One measure/clamp pass over a row's cells: clear any existing clamp, find the cells
     * whose content doesn't fit their current budget, and clamp each to whole lines.
     *
     * Measuring every cell before clamping any of them matters — cells stretch to the
     * row's track, so clamping one mid-loop moves the boxes still to be measured.
     *
     * @returns {{overflowing: Array, clampHeight: number}} the truncated cells as
     *   `[column, cell]` pairs, and the tallest clamped height in px (0 if none).
     */
    proto.clampRowCells = function (row) {
        row.cellsByColumn.forEach(cell => {
            cell.removeAttribute('clamped')
            cell.style.removeProperty('--lineClamp')
            cell.style.removeProperty('--clampHeight')
        })
        const overflowing = []
        row.cellsByColumn.forEach((cell, column) => {
            if (cell !== row.expandedCell && cell.scrollHeight - cell.clientHeight > 1) {
                overflowing.push([column, cell])
            }
        })
        let clampHeight = 0
        overflowing.forEach(([, cell]) => {
            clampHeight = Math.max(clampHeight, this.clampCell(cell))
        })
        return { overflowing, clampHeight }
    }

    /**
     * Truncate one overflowing cell to whole lines with a trailing ellipsis, by
     * translating its height budget into a line count for `-webkit-line-clamp` (CSS can't
     * floor a division, so the count is computed here and published as `--lineClamp`).
     *
     * The cell's own box is the budget: it's only called for cells that overflow, which
     * means `max-height` is holding this one at the budget already — so measuring the box
     * resolves whatever unit the app wrote `collapseTo` in, at sub-pixel precision, with
     * no percentage or `box-sizing` special cases. Padding and borders come out of it
     * before dividing. An app that leaves `line-height: normal` on its cells gets an
     * approximation (1.2em) — set an explicit line-height for exact fits.
     *
     * @returns {number} the clamped height in px, or 0 if the cell couldn't be measured
     */
    proto.clampCell = function (cell) {
        const style = getComputedStyle(cell)
        const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2
        if (!(lineHeight > 0)) return 0
        const chrome = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
            + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth)
        const content = cell.getBoundingClientRect().height - chrome
        if (!(content > 0)) return 0
        // The epsilon keeps a budget that is a whole number of lines on paper (3 × 18.2px)
        // from losing one to float error in the measurement.
        const lines = Math.max(1, Math.floor(content / lineHeight + 0.02))
        // Pin the cell to exactly those lines rather than letting it stretch to the row's
        // track: any slack is where the line after the ellipsis would show through, and
        // clipping on an exact line boundary is what guarantees it can't.
        const height = lines * lineHeight + chrome
        cell.style.setProperty('--lineClamp', String(lines))
        cell.style.setProperty('--clampHeight', height + 'px')
        cell.setAttribute('clamped', '')
        return height
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
            if (cell && (!row.expandedCell || cell.scrollHeight > row.expandedCell.scrollHeight)) {
                row.expandedColumn = column
                row.expandedCell = cell
            }
        }
        if (row.expandedCell) {
            // Measure unclamped so nested max-height content can't under-report.
            row.expandedCell.style.setProperty('max-height', 'unset')
            el.style.setProperty('--expandTo', row.expandedCell.scrollHeight + 'px')
            row.expandedCell.style.removeProperty('max-height')
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
        /* The cells do the clamping and clipping (they're overflow: hidden in the core
           styles), not the row: the row's track then follows the tallest clamped cell,
           and per-cell decorations at the visible row edge (e.g. border-bottom grid
           lines) stay inside the cell's own box where nothing can clip them. */
        ${this.tagName}-cell,
        ${this.tagName}-collapse-toggle {
            max-height: var(--expandTo, var(--collapseTo));
        }
        ${this.tagName}-cell[clamped] {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: var(--lineClamp, 1);
            max-height: var(--clampHeight);
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
