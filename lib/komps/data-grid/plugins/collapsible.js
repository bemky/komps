/**
 * A plugin to make a {@link DataGrid}'s (and its subclasses', e.g. {@link DataSpreadsheet})
 * rows **collapsible** — the windowed counterpart of the Table `collapsible` plugin.
 *
 * The app sets a height budget for rows via `collapseTo` (any valid CSS size). Rows whose
 * cell content overflows that budget are truncated, flagged with a `collapsed` attribute,
 * and each overflowing cell gets a toggle that expands the row to that cell's full content
 * (and back). Expanding sizes the row via `--expandTo`; the grid's normal measure/reflow
 * pipeline picks the new height up, so offsets, the mounted window, and the body scroll
 * extent stay correct.
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

export default function (proto) {
    // assignableAttributes is shared up the prototype chain; clone before adding so a
    // plugin included on a subclass (DataSpreadsheet) doesn't leak options onto DataGrid.
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
     * expansion, flag the element `collapsed` when any cell's content is truncated, and
     * (re)render the expand/collapse toggles. Idempotent — runs on every resize of the
     * row element, so it always rebuilds from controller state rather than diffing.
     */
    proto.checkRowCollapse = function (row) {
        const el = row.element
        if (!el || !row.cellsByColumn) return
        el.querySelectorAll(`${this.localName}-collapse-toggle`).forEach(t => t.remove())
        row.cellsByColumn.forEach(cell => cell.removeAttribute('collapse-toggle'))
        this.resetRowExpand(row)
        const overflowing = []
        row.cellsByColumn.forEach((cell, column) => {
            if (cell !== row.expandedCell && cell.scrollHeight - cell.clientHeight > 1) {
                overflowing.push([column, cell])
            }
        })
        el.toggleAttribute('collapsed', overflowing.length > 0)
        overflowing.forEach(([column, cell]) => this.renderCollapseToggle(row, column, cell, true))
        if (row.expandedCell) this.renderCollapseToggle(row, row.expandedColumn, row.expandedCell, false)
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
                content: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${expand ? 'expand' : 'collapse'}"><polyline points="1 1 7 7 13 1"></polyline></svg>`
            }, () => {
                row.expandedColumns ??= new Set()
                if (expand) {
                    row.expandedColumns.add(column)
                } else {
                    row.expandedColumns.clear()
                }
                this.checkRowCollapse(row)
            })
        })
        if (cell.classList.contains('frozen')) toggle.style.left = cell.style.left
        // Keep the toggle from starting a selection / edit underneath (DataSpreadsheet).
        toggle.addEventListener('pointerdown', e => e.stopPropagation())
        toggle.addEventListener('mousedown', e => e.stopPropagation())
        row.element.prepend(toggle)
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
        ${this.tagName}-cell[collapse-toggle] {
            padding-bottom: 16px;
        }
        ${this.tagName}-collapse-toggle {
            display: flex;
            flex-direction: column;
            justify-content: end;
            text-align: center;
            grid-row: 1 / -1;
            /* Above DataSpreadsheet's active cell (z 3) so the button stays clickable
               when its cell is selected, but below frozen cells (z 5) so a scrolling
               toggle still slides under frozen columns. */
            z-index: 4;
            pointer-events: none;
            margin-bottom: 1px; /* keep the gradient off the cell's border line */
        }
        ${this.tagName}-collapse-toggle:hover {
            color: var(--select-color, #1a73e8);
        }
        ${this.tagName}-collapse-toggle:hover svg {
            opacity: 1;
        }
        ${this.tagName}-collapse-toggle.frozen {
            position: sticky;
            z-index: 6;
        }
        ${this.tagName}-collapse-toggle button {
            outline: none;
            appearance: none;
            border: none;
            padding: 0;
            margin: 0;
            text-decoration: none;
            color: inherit;
            pointer-events: auto;

            background: linear-gradient(rgba(255,255,255, 0), rgba(255,255,255, 0.7) 30%, white);
            cursor: pointer;
            font-size: 0.8em;

            padding: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        ${this.tagName}-collapse-toggle svg {
            display: inline-block;
            opacity: 0.5;
        }
        ${this.tagName}-collapse-toggle svg.collapse {
            transform: rotate(180deg)
        }
    `})
}
