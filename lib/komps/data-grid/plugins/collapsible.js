/**
 * A plugin to make a {@link DataGrid} (and its subclasses, e.g. {@link DataSpreadsheet})
 * **collapsible** by grouping its (virtualized) rows under collapsible group headers.
 *
 * Rows are grouped by a key (or a key function); each group is preceded by a **group
 * header row** that toggles its members open/closed on click. Because DataGrid is
 * windowed, collapsing must change both *which* rows are mounted and the *total scroll
 * height* — this plugin does that by keeping the group structure as the source of truth
 * and projecting the currently-visible entries (always-visible headers + expanded
 * members) back onto `grid.rows`. The existing geometry/windowing pipeline
 * (`rowGeometry`, `updateWindow()`, the body scrollbar) then works unchanged: a
 * collapsed group simply contributes one header row's worth of height instead of all
 * its members.
 *
 * The group header itself is an ordinary {@link DataGridRow} flagged `isGroupHeader`,
 * so it scrolls, mounts/unmounts, and measures like any other row. A custom render path
 * paints it as a single full-width banner (using the grid's existing `-cell` element with
 * a `group-header` class) carrying the group label, member count, and a twirl-down
 * caret affordance.
 *
 * @function Plugin/DataGridCollapsible
 * @mixin
 *
 * @param {Object} [options={}] - Options added to the grid
 * @param {string|function|null} [options.groupBy=null] - How to group rows. A string reads
 *   that key off each record; a function `(record, row, grid) => groupKey` returns the key.
 *   `null` (default) disables grouping — no headers are inserted and the grid is left ungrouped.
 * @param {function} [options.groupHeader] - Render the group header label; receives
 *   `(groupKey, members, grid)` and returns content (string / node / dolla descriptor).
 *   Defaults to `"<key> (<count>)"`.
 * @param {boolean} [options.collapsed=false] - Initial collapsed state for every group.
 *
 * @fires Plugin/DataGridCollapsible#groupToggled
 *
 * @example <caption>JS — DataGrid</caption>
 * import DataGrid from 'komps/komps/data-grid.js'
 * import { collapsible } from 'komps/komps/data-grid/plugins.js'
 * DataGrid.include(collapsible)
 * new DataGrid({
 *     style: 'height: 400px',
 *     groupBy: 'team',                 // or: record => record.team
 *     collapsed: false,                // start expanded
 *     data: [...],
 *     columns: [...]
 * })
 *
 * @example <caption>JS — DataSpreadsheet</caption>
 * import DataSpreadsheet from 'komps/komps/data-spreadsheet.js'
 * import { collapsible } from 'komps/komps/data-grid/plugins.js'
 * DataSpreadsheet.include(collapsible)
 * new DataSpreadsheet({ groupBy: r => r.category, data: [...], columns: [...] })
 */

/**
 * Fired after a group is expanded or collapsed (re-windows synchronously before firing).
 * @event Plugin/DataGridCollapsible#groupToggled
 * @type {Object}
 * @property {*} key - the group key that was toggled
 * @property {boolean} collapsed - the new collapsed state
 */

import { content as renderContent } from 'dolla'

export default function (proto) {
    // assignableAttributes is shared up the prototype chain; clone before adding so a
    // plugin included on a subclass (DataSpreadsheet) doesn't leak options onto DataGrid.
    if (!Object.hasOwn(this, 'assignableAttributes')) {
        this.assignableAttributes = { ...this.assignableAttributes }
    }
    this.assignableAttributes.groupBy = { type: ['string', 'function'], default: null, null: true }
    this.assignableAttributes.groupHeader = { type: 'function', default: null, null: true }
    this.assignableAttributes.collapsed = { type: 'boolean', default: false, null: false }

    this.events.push('groupToggled')

    /* -----------------------------------------------------------------
       Setup — after rows are built, partition them into groups and insert
       a header row per group, then project the visible set onto grid.rows
       (this runs before renderScaffold/updateWindow in DataGrid.initialize).
    ----------------------------------------------------------------- */
    const initializeRowsWas = proto.initializeRows
    proto.initializeRows = async function (...args) {
        await initializeRowsWas.call(this, ...args)
        if (this.groupBy != null) this.buildGroups()
        return this.rows
    }

    /** Resolve the group key for a row's record. */
    proto.groupKeyOf = function (row) {
        if (typeof this.groupBy === 'function') return this.groupBy(row.record, row, this)
        return row.record == null ? undefined : row.record[this.groupBy]
    }

    /**
     * Partition the data rows into groups (stable: group order follows first
     * appearance, member order is preserved), create one header row per group, and
     * build the authoritative ordered list `this._groupOrder` of entries:
     * `{ header, members: [DataGridRow], collapsed }`. Then project the visible
     * entries onto `this.rows`.
     */
    proto.buildGroups = function () {
        const dataRows = this.rows.filter(r => !r.isGroupHeader)
        const groups = new Map() // key -> { header, members, collapsed }
        for (const row of dataRows) {
            const key = this.groupKeyOf(row)
            let group = groups.get(key)
            if (!group) {
                const header = new this.constructor.Row({ grid: this, index: 0, record: null })
                header.isGroupHeader = true
                header.groupKey = key
                header.collapsed = !!this.collapsed
                group = { key, header, members: [] }
                header.group = group
                groups.set(key, group)
            }
            group.members.push(row)
            row.group = group
        }
        this._groups = groups
        this.projectVisibleRows()
    }

    /**
     * Rebuild `this.rows` from the group structure: every header is visible; a group's
     * members are visible only while it is expanded. This is the integration point with
     * virtualization — geometry, windowing, and the scrollbar all consume `this.rows`,
     * so a collapsed group contributes only its (one) header row to the total height.
     */
    proto.projectVisibleRows = function () {
        const out = []
        for (const group of this._groups.values()) {
            out.push(group.header)
            if (!group.header.collapsed) out.push(...group.members)
        }
        this.rows = out
        this.reindexRows(0)
        // Keep the geometry's element list pointed at the new array, then re-sum.
        if (this.rowGeometry) {
            this.rowGeometry.elements = this.rows
            this.rowGeometry.rebuildFrom(0)
        }
    }

    /* -----------------------------------------------------------------
       Group-header rendering — a header row paints as a single full-width
       banner instead of per-column cells. We override the row controller's
       renderCells for header rows; data rows fall through to the original.
    ----------------------------------------------------------------- */
    const renderCellsWas = this.Row.prototype.renderCells
    this.Row.prototype.renderCells = function (...args) {
        if (!this.isGroupHeader) return renderCellsWas.call(this, ...args)
        this.grid.renderGroupHeaderCells(this)
    }

    proto.renderGroupHeaderCells = function (row) {
        row.cellsByColumn = new Map()
        const cell = this.acquireCell()
        // Bind to the first column so pooled-cell bookkeeping (column.cells) stays sane,
        // then override its layout to span the full row as a banner.
        const column = this.columns[0]
        if (column) {
            cell.bind(row, column, null)
            column.cells.add(cell)
            row.cellsByColumn.set(column, cell)
        } else {
            cell.row = row
        }
        cell.classList.add('group-header')
        cell.classList.remove('frozen')
        cell.style.gridColumn = '1 / -1'
        cell.style.left = ''
        cell.removeAttribute('role')
        cell.toggleAttribute('collapsed', !!row.collapsed)

        const label = this.groupHeader
            ? this.groupHeader(row.groupKey, row.group.members, this)
            : `${row.groupKey == null ? '' : row.groupKey} (${row.group.members.length})`

        renderContent(cell, {
            tag: `${this.localName}-group-toggle`,
            content: [
                {
                    tag: 'svg',
                    xmlns: 'http://www.w3.org/2000/svg',
                    width: '12', height: '12', viewBox: '0 0 24 24',
                    fill: 'none', stroke: 'currentColor', 'stroke-width': '3',
                    'stroke-linecap': 'round', 'stroke-linejoin': 'round',
                    class: 'caret',
                    content: { tag: 'polyline', points: '6 9 12 15 18 9' }
                },
                { tag: `${this.localName}-group-label`, content: label }
            ]
        })

        cell.addEventListener('click', () => this.toggleGroup(row.groupKey))
        row.element.appendChild(cell)
    }

    /* -----------------------------------------------------------------
       Toggle — flip the group's collapsed flag, re-project the visible set,
       rebuild the window so the mounted rows + scrollbar reflect the change.
    ----------------------------------------------------------------- */
    /** Collapse or expand a group by its key (no-op if the key is unknown). */
    proto.toggleGroup = function (key, collapsed) {
        const group = this._groups && this._groups.get(key)
        if (!group) return
        const next = collapsed == null ? !group.header.collapsed : !!collapsed
        if (next === group.header.collapsed) return
        group.header.collapsed = next

        // The mounted set may now hold members of a freshly-collapsed group (or be
        // missing newly-revealed ones) — drop them all and re-window from scratch.
        for (const r of Array.from(this.mounted)) r.unmount()
        this.projectVisibleRows()
        this.updateWindow()
        this.trigger('groupToggled', { detail: { key, collapsed: next } })
    }

    /** Collapse every group. */
    proto.collapseAll = function () { this._setAllCollapsed(true) }
    /** Expand every group. */
    proto.expandAll = function () { this._setAllCollapsed(false) }
    proto._setAllCollapsed = function (state) {
        if (!this._groups) return
        let changed = false
        for (const group of this._groups.values()) {
            if (group.header.collapsed !== state) { group.header.collapsed = state; changed = true }
        }
        if (!changed) return
        for (const r of Array.from(this.mounted)) r.unmount()
        this.projectVisibleRows()
        this.updateWindow()
    }

    /* -----------------------------------------------------------------
       Styles — full-width banner + twirl caret for the group header rows.
    ----------------------------------------------------------------- */
    if (!Array.isArray(this.style)) this.style = [this.style]
    this.style.push(function () { return `
        ${this.tagName}-cell.group-header {
            grid-column: 1 / -1;
            position: sticky;
            left: 0;
            display: flex;
            align-items: center;
            gap: 6px;
            box-sizing: border-box;
            inline-size: var(--dg-width);
            padding: 4px 8px;
            font-weight: 600;
            background: var(--dg-group-header-bg, #f3f4f6);
            border-block-end: 1px solid var(--dg-group-header-border, #e5e7eb);
            cursor: pointer;
            user-select: none;
            -webkit-user-select: none;
            z-index: 6;
        }
        ${this.tagName}-cell.group-header:hover {
            background: var(--dg-group-header-bg-hover, #e9eaed);
        }
        ${this.tagName}-group-toggle {
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        ${this.tagName}-group-toggle .caret {
            flex: none;
            transition: transform 0.12s ease;
        }
        ${this.tagName}-cell.group-header[collapsed] .caret {
            transform: rotate(-90deg);
        }
        ${this.tagName}-group-label {
            display: inline-block;
        }
    `})
}
