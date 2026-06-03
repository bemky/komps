/**
 * An editable {@link DataGrid} — the virtualized counterpart to {@link Spreadsheet}.
 *
 * Built as a **new component (not a change to `Spreadsheet`)** so the two can be
 * diffed and a migration planned. It mirrors Spreadsheet's editing behaviour but
 * adapts the parts that virtualization breaks: selection is a **range over the row/
 * column model** (repainted onto mounted cells as they scroll), copy/paste read and
 * write **records** (off-screen cells don't exist), and keyboard navigation
 * **scrolls a target cell into view and mounts it** before focusing.
 *
 * Mirrored: single + range selection (mouse drag, shift-arrow), inline editing
 * (text / number / select / checkbox / readonly column types), copy/paste (TSV),
 * keyboard nav (arrows / Tab / Enter / Escape / Delete / type-to-edit), `invalidPaste`.
 * Deferred (vs Spreadsheet): Floater/Input-based editors, context menu, column
 * resize/reorder, `splitInto`/group-aware selection, scroll-snap.
 *
 * @class DataSpreadsheet
 * @extends DataGrid
 *
 * @fires DataSpreadsheet#cellChanged
 * @fires DataSpreadsheet#invalidPaste
 */

import { createElement } from 'dolla'
import DataGrid from './data-grid.js'
import Floater from './floater.js'
import DataSpreadsheetCell from './data-spreadsheet/cell.js'
import DataSpreadsheetColumn from './data-spreadsheet/column.js'
import NumberColumn from './data-spreadsheet/columns/number-column.js'
import SelectColumn from './data-spreadsheet/columns/select-column.js'
import CheckboxColumn from './data-spreadsheet/columns/checkbox-column.js'
import ReadonlyColumn from './data-spreadsheet/columns/readonly-column.js'

export default class DataSpreadsheet extends DataGrid {
    static tagName = 'komp-data-spreadsheet'

    static Cell = DataSpreadsheetCell
    static Column = DataSpreadsheetColumn
    static columnTypeRegistry = {
        default: DataSpreadsheetColumn,
        number: NumberColumn,
        select: SelectColumn,
        checkbox: CheckboxColumn,
        radio: CheckboxColumn,
        readonly: ReadonlyColumn
    }
    static cellSelector = this.Cell.tagName

    static events = ['invalidPaste', 'cellChange', 'cellChanged']

    constructor(...args) {
        super(...args)
        this.selection = null        // { anchor:{row,col}, focus:{row,col} } | null
        this.active = null           // { row, col } — the active cell: focused + outlined, the selection's anchor
        this.cursor = null           // { row, col } — the moving edge of the range while extending (drag / shift+arrow)
        this._editing = null         // { cell, column, record, input } | null
    }

    async initialize(...args) {
        const result = await super.initialize(...args)
        this.setupSelection()
        return result
    }

    /** Make cells focusable, set once per physical element (pooled cells keep it). */
    acquireCell() {
        const cell = super.acquireCell()
        if (cell.tabIndex < 0) cell.tabIndex = 0 // freshly created cells default to -1
        return cell
    }

    /**
     * Add a grid-level **utilities** layer (above the header/frozen z-stack, clipped
     * by the grid's overflow) for transient overlays — the edit-input floater today,
     * and things like column-resize indicators later.
     */
    renderScaffold() {
        super.renderScaffold()
        this.utilities = createElement(`${this.localName}-utilities`)
        this.append(this.utilities)
    }

    /* -----------------------------------------------------------------
       Window hook — repaint selection whenever the mounted set changes
    ----------------------------------------------------------------- */
    updateWindow() {
        super.updateWindow()
        this.paintSelection()
    }

    /* -----------------------------------------------------------------
       Selection range (over the model) + paint onto mounted cells
    ----------------------------------------------------------------- */
    range(sel = this.selection) {
        if (!sel) return null
        return {
            r0: Math.min(sel.anchor.row, sel.focus.row), r1: Math.max(sel.anchor.row, sel.focus.row),
            c0: Math.min(sel.anchor.col, sel.focus.col), c1: Math.max(sel.anchor.col, sel.focus.col)
        }
    }

    setSelection(anchor, focus = anchor) {
        this.selection = { anchor, focus }
        this.paintSelection()
    }
    clearSelection() {
        this.selection = null
        this.paintSelection()
    }

    paintSelection() {
        if (!this.body) return
        const r = this.range()
        const a = this.active
        for (const row of this.mountedRows) {
            for (const column of this.columns) {
                const cell = row.cellOf(column)
                if (!cell) continue
                const inSel = !!r && row.index >= r.r0 && row.index <= r.r1 && column.index >= r.c0 && column.index <= r.c1
                cell.classList.toggle('selected', inSel)
                cell.classList.toggle('active', !!a && a.row === row.index && a.col === column.index)
            }
        }
        this.renderSelectionIndicator(r)
    }

    /**
     * Draw a single border box around the whole selection range. Geometry comes from
     * row/column geometry (not the cells), so it spans off-screen rows/columns too.
     * Lives in body space (scrolls with content, hidden under the sticky header).
     *
     * Known limitation (as in Spreadsheet): the box is positioned in body space, so a
     * range starting in a frozen column won't track that column when scrolled sideways.
     */
    renderSelectionIndicator(r = this.range()) {
        if (!r) {
            if (this._selectIndicator) { this._selectIndicator.remove(); this._selectIndicator = null }
            return
        }
        const left = this.columnGeometry.offsetAt(r.c0)
        const right = this.columnGeometry.offsetAt(r.c1) + this.columnGeometry.sizeAt(r.c1)
        const top = this.rowGeometry.offsetAt(r.r0)
        const bottom = this.rowGeometry.offsetAt(r.r1) + this.rowGeometry.sizeAt(r.r1)

        let el = this._selectIndicator
        if (!el) {
            el = this._selectIndicator = createElement(`${this.localName}-select-indicator`)
            this.body.append(el)
        }
        el.style.left = left + 'px'
        el.style.top = top + 'px'
        el.style.width = (right - left) + 'px'
        el.style.height = (bottom - top) + 'px'
    }

    cellElementAt(row, col) {
        const r = this.rows[row], c = this.columns[col]
        return (r && c) ? r.cellOf(c) : null
    }

    /* -----------------------------------------------------------------
       Navigation — move the active cell, scrolling off-screen into view
    ----------------------------------------------------------------- */
    moveActive(dir, extend = false) {
        if (extend) {
            // Extend: move the cursor (range edge); the active cell stays put.
            const from = this.cursor || this.active
            if (!from) return
            const { row, col } = this.stepFrom(from, dir)
            this.cursor = { row, col }
            this.setSelection(this.active || this.cursor, this.cursor)
            // Reveal the cursor, but keep focus + outline on the active cell. Fall back to
            // the cursor only when the active has scrolled out of view — so we never show
            // two outlines at once.
            this.scrollCellIntoView(row, col)
            this.updateWindow()
            const activeCell = this.active && this.cellElementAt(this.active.row, this.active.col)
            ;(activeCell || this.cellElementAt(row, col))?.focus({ preventScroll: true })
        } else {
            // Move the active cell; collapse the selection to it.
            const from = this.active || (this.selection && this.selection.focus)
            if (!from) return
            const { row, col } = this.stepFrom(from, dir)
            this.active = { row, col }
            this.cursor = { row, col }
            this.setSelection({ row, col })
            this.focusCellAt(row, col)
        }
    }

    /** One step from {row,col} in a direction, clamped to the grid. */
    stepFrom(from, dir) {
        let row = from.row, col = from.col
        if (dir === 'up') row--
        else if (dir === 'down') row++
        else if (dir === 'left') col--
        else if (dir === 'right') col++
        return {
            row: Math.max(0, Math.min(row, this.rows.length - 1)),
            col: Math.max(0, Math.min(col, this.columns.length - 1))
        }
    }

    focusCellAt(row, col) {
        this.scrollCellIntoView(row, col)
        let cell = this.cellElementAt(row, col)
        // Single-step moves land within overscan, so the cell is already mounted.
        // Only force a synchronous window pass for a target beyond overscan (a far
        // jump, or overscan: 0); otherwise the scroll event re-settles the window.
        if (!cell) {
            this.updateWindow()
            cell = this.cellElementAt(row, col)
        }
        if (cell) cell.focus({ preventScroll: true })
    }

    frozenWidth() {
        let w = 0
        for (const c of this.columns) if (c.frozen) w += this.columnGeometry.sizeAt(c.index)
        return w
    }

    scrollCellIntoView(row, col) {
        const headerH = this.body.offsetTop
        const top = headerH + this.rowGeometry.offsetAt(row)
        const bottom = top + this.rowGeometry.sizeAt(row)
        if (top < this.scrollTop + headerH) this.scrollTop = top - headerH
        else if (bottom > this.scrollTop + this.clientHeight) this.scrollTop = bottom - this.clientHeight

        if (!(this.columns[col] && this.columns[col].frozen)) {
            const frozenW = this.frozenWidth()
            const left = this.columnGeometry.offsetAt(col)
            const right = left + this.columnGeometry.sizeAt(col)
            if (left < this.scrollLeft + frozenW) this.scrollLeft = left - frozenW
            else if (right > this.scrollLeft + this.clientWidth) this.scrollLeft = right - this.clientWidth
        }
    }

    /* -----------------------------------------------------------------
       Editing
    ----------------------------------------------------------------- */
    /**
     * Begin editing a cell. Mirrors Spreadsheet: the column builds an {@link Input}-
     * bound editor (writes to the record on change/blur), shown in a {@link Floater}
     * anchored to the cell so it can overflow the cell bounds. Boolean columns toggle
     * inline instead. Navigation/blur commits (the bound input dumps to the record);
     * Escape cancels via the floater's `preventChange` flag.
     */
    activateCell(cell, options = {}) {
        if (this._editing) this.closeEditor()
        const { column, record } = cell
        if (!column || record == null || column.editable === false) return

        if (column.toggleable) {
            column.toggle(record)
            cell.render()
            this.trigger('cellChanged', { detail: { cell, column, record } })
            return
        }

        const input = column.input(record, options.value != null ? { value: options.value } : {})
        if (!input) return

        const floater = new Floater({
            class: `${this.localName}-input`,
            anchor: cell,
            container: this.utilities, // grid-level layer above the header/frozen z-stack
            content: { tag: 'label', content: input, class: column.class },
            placement: 'bottom-start',
            autoPlacement: { alignment: 'start', allowedPlacements: ['top', 'bottom'] },
            removeOnBlur: true,
            offset: ({ rects }) => ({ mainAxis: -rects.reference.height }),
            style: {
                '--cell-width': cell.column.width + "px",
                '--cell-height': cell.row.height + "px"
            }
        })
        this._editing = { cell, column, record, floater }
        cell.tabIndex = -1

        floater.addEventListener('hidden', () => {
            cell.tabIndex = 0
            if (this._editing && this._editing.floater === floater) this._editing = null
            cell.render() // reflect the value the bound input wrote (or the unchanged value on cancel)
            this.trigger('cellChanged', { detail: { cell, column, record } })
        })

        floater.addEventListener('keydown', e => {
            e.stopPropagation()
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.moveActive('down') }
            else if (e.key === 'Tab') { e.preventDefault(); this.moveActive(e.shiftKey ? 'left' : 'right') }
            else if (e.key === 'Escape') { e.preventDefault(); floater.setAttribute('preventChange', true); cell.focus({ preventScroll: true }) }
        })

        floater.show() // appends into this.utilities (see container option above)

        // Focus the editor once it's positioned (the bound input is the element itself).
        setTimeout(() => {
            input.focus?.()
            if (input.select && options.value == undefined) input.select()
            if (input.showPicker && input.tagName === 'SELECT') { /* selects open on focus/click */ }
        }, 0)
    }

    /** Close any open editor (commits via the input's blur dump). */
    closeEditor() {
        if (this._editing) this._editing.floater.hide()
    }

    /* -----------------------------------------------------------------
       Copy / paste / clear (record-driven, work across off-screen ranges)
    ----------------------------------------------------------------- */
    quote(v) {
        return (typeof v === 'string' && (v.includes('\n') || v.includes('\t'))) ? '"' + v + '"' : v
    }

    /** TSV for the current selection — reads from records, so off-screen rows are included. */
    copyText() {
        const r = this.range()
        if (!r) return ''
        const lines = []
        for (let row = r.r0; row <= r.r1; row++) {
            const record = this.rows[row].record
            const cols = []
            for (let col = r.c0; col <= r.c1; col++) cols.push(this.quote(this.columns[col].valueFor(record)))
            lines.push(cols.join('\t'))
        }
        return lines.join('\n')
    }

    copyCells(e) {
        if (!this.selection) return
        const tsv = this.copyText()
        if (e && e.clipboardData) e.clipboardData.setData('text/plain', tsv)
        else if (navigator.clipboard) navigator.clipboard.writeText(tsv)
    }

    pasteData(text) {
        if (text == null) return
        const start = this.active
        if (!start) return
        const matrix = text.split(/\r?\n/).map(l => l.split('\t'))
        if (matrix.length > 1 && matrix[matrix.length - 1].length === 1 && matrix[matrix.length - 1][0] === '') matrix.pop()

        matrix.forEach((cols, dr) => cols.forEach((val, dc) => {
            const row = this.rows[start.row + dr]
            const column = this.columns[start.col + dc]
            if (!row || !column) return
            if (!column.accepts('text/plain')) { this.trigger('invalidPaste', { detail: val }); return }
            column.paste(row.record, val)
            const cell = row.cellOf(column)
            if (cell) cell.render()
        }))

        const endR = Math.min(this.rows.length - 1, start.row + matrix.length - 1)
        const endC = Math.min(this.columns.length - 1, start.col + Math.max(...matrix.map(m => m.length)) - 1)
        this.setSelection(start, { row: endR, col: endC })
        this.trigger('cellChanged', { detail: { range: this.range() } })
    }

    clearSelectedCells() {
        const r = this.range()
        if (!r) return
        for (let row = r.r0; row <= r.r1; row++) {
            const record = this.rows[row].record
            for (let col = r.c0; col <= r.c1; col++) {
                this.columns[col].clear(record)
                const cell = this.rows[row].cellOf(this.columns[col])
                if (cell) cell.render()
            }
        }
        this.trigger('cellChanged', { detail: { range: r } })
    }

    /* -----------------------------------------------------------------
       Event wiring
    ----------------------------------------------------------------- */
    setupSelection() {
        const sel = this.constructor.cellSelector

        this.addEventListenerFor(sel, 'mousedown', e => {
            if (e.button !== 0) return
            const cell = e.delegateTarget
            const pos = { row: cell.rowIndex, col: cell.cellIndex }
            if (e.shiftKey && this.active) {
                // Shift-click extends the range from the active cell, which stays.
                this.cursor = pos
                this.setSelection(this.active, pos)
            } else {
                this.active = pos
                this.cursor = pos
                this.setSelection(pos)
            }
            cell.focus({ preventScroll: true })

            // Drag moves the cursor (range edge) from the active cell, which stays put.
            const move = ev => {
                const c = ev.target instanceof Element ? ev.target.closest(sel) : null
                if (c && c.column) {
                    this.cursor = { row: c.rowIndex, col: c.cellIndex }
                    this.setSelection(this.active, this.cursor)
                }
            }
            const up = () => this.removeEventListener('mousemove', move)
            this.addEventListener('mousemove', move)
            this.getRootNode().addEventListener('mouseup', up, { once: true })
        })

        this.addEventListenerFor(sel, 'dblclick', e => this.activateCell(e.delegateTarget))

        // Only seed `active` on a genuine first focus (e.g. tabbing in). Don't override
        // it when focus follows the moving edge during a range extend.
        this.addEventListenerFor(sel, 'focusin', e => {
            if (this.active == null) {
                const cell = e.delegateTarget
                this.active = { row: cell.rowIndex, col: cell.cellIndex }
            }
        })

        this.addEventListenerFor(sel, 'keydown', e => {
            if (this._editing) return
            const cell = e.delegateTarget
            const key = e.key
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
                e.preventDefault()
                this.moveActive(key.replace('Arrow', '').toLowerCase(), e.shiftKey)
            } else if (key === 'Enter') {
                e.preventDefault()
                this.activateCell(cell)
            } else if (key === 'Tab') {
                e.preventDefault()
                this.moveActive(e.shiftKey ? 'left' : 'right')
            } else if (key === 'Escape') {
                this.clearSelection()
            } else if (key === 'Backspace' || key === 'Delete') {
                e.preventDefault()
                this.clearSelectedCells()
            } else if (key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
                e.preventDefault()
                this.activateCell(cell, { value: key })
            }
        })

        this.addEventListener('copy', e => {
            if (this.selection && this.contains(this.getRootNode().activeElement)) { e.preventDefault(); this.copyCells(e) }
        })
        this.addEventListener('paste', e => {
            if (this.selection && !this._editing && this.contains(this.getRootNode().activeElement)) {
                e.preventDefault()
                this.pasteData(e.clipboardData.getData('text/plain'))
            }
        })
    }

    static style = function () { return `
        ${this.tagName} {
            --select-oklch: 57.37% 0.1946 257.86;
            --select-color: oklch(var(--select-oklch));
        }
        ${this.tagName}-utilities {
            position: absolute;
            inset-block-start: 0;
            inset-inline-start: 0;
            width: 0;
            height: 0;
            z-index: 100;
        }
        ${this.tagName}-cell {
            cursor: cell;
            user-select: none;
            position: relative;
        }
        ${this.tagName}-cell.selected::after {
            content: '';
            position: absolute;
            inset: 0;
            pointer-events: none;
            background: color-mix(in oklab, var(--ds-select, #1a73e8) 12%, transparent);
        }
        ${this.tagName}-cell.active {
            outline: 2px solid var(--select-color);
            outline-offset: -1px;
            z-index: 3;
        }
        /* The focused cell is outlined. moveActive keeps focus on the active cell while
           extending (so this coincides with .active — one outline, not two). */
        ${this.tagName}-cell:focus {
            outline: 2px solid var(--select-color);
            outline-offset: -1px;
        }
        ${this.tagName}-cell.number-cell {
            text-align: right;
        }
        ${this.tagName}-cell.checkbox-cell {
            text-align: center;
        }

        /* Border box encompassing the selected range (positioned in body space by
           renderSelectionIndicator, so it spans off-screen cells). */
        ${this.tagName}-select-indicator {
            position: absolute;
            pointer-events: none;
            box-sizing: border-box;
            outline: 2px solid var(--select-color);
            outline-offset: -1px;
            z-index: 5;
        }

        ${this.tagName}-row:has(${this.tagName}-cell.active) {
            z-index: 4;
        }

        /* Editor floater: a bordered box over the cell that can overflow the cell
           bounds for larger input contexts (mirrors Spreadsheet's komp-spreadsheet-input). */
        .${this.tagName}-input {
            z-index: 4;
        }
        .${this.tagName}-input > label {
            display: flex;
            min-width: var(--cell-width, auto);
            min-height: var(--cell-height, auto);
            background: white;
            outline: 2px solid var(--select-color);
            outline-offset: -1px;
            box-shadow: 0 0 0 3px oklch(var(--select-oklch) / 0.35);
            
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .${this.tagName}-input > label > input,
        .${this.tagName}-input > label > textarea,
        .${this.tagName}-input > label > select,
        .${this.tagName}-input > label > komp-content-area,
        .${this.tagName}-input > label > komp-select > button {
            font: inherit;
            border: none;
            outline: none;
            background: none;
            min-width: 100%;
            min-height: 100%;
            box-sizing: border-box;
            padding: 0.4em 0.6em;
            border-radius: unset;
        }
        .${this.tagName}-input > label > input {
            width: 1px; // make so doesn't initially overflow column
        }
    `}

    static { this.define() }
}
