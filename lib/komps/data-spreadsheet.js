/**
 * An editable {@link DataGrid} — the virtualized counterpart to {@link Spreadsheet}.
 *
 * @class DataSpreadsheet
 * @extends DataGrid
 *
 * @param {Object} [options={}]
 * @param {function} [options.readonly] - Function called with each `record` to determine whether its row should render readonly (non-editable) cells. Resolved per-record before editing, pasting, or clearing. A column that is explicitly non-editable (`editable: false`) stays non-editable regardless; per-record `readonly` additionally makes otherwise-editable cells readonly.
 *
 * @fires DataSpreadsheet#cellChanged
 * @fires DataSpreadsheet#invalidPaste
 */

import { createElement, listenerElement } from 'dolla'

import { splitByUnquotedChar } from '../support.js';

import DataGrid from './data-grid.js'
import Floater from './floater.js'
import Modal from './modal.js'
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

    static assignableAttributes = {
        readonly: { type: 'function', default: null, null: true }
    }

    static events = ['invalidPaste', 'cellChanged']

    constructor(...args) {
        super(...args)
        this.selection = null        // { anchor:{row,col}, focus:{row,col} } | null
        this.active = null           // { row, col } — the active cell: focused + outlined, the selection's anchor
        this.cursor = null           // { row, col } — the moving edge of the range while extending (drag / shift+arrow)
        this._editing = null         // { cell, column, record, input } | null
        this._copying = false        // copy pending → the selection indicator shows the dashed marquee
    }

    async initialize(...args) {
        const result = await super.initialize(...args)
        this.setupSelection()
        return result
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
                this.setSelection(pos) // setSelection clears the copy marquee
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
                // First Escape cancels the copy marquee; otherwise clears the selection.
                if (this._copying) { this._copying = false; this.paintSelection() }
                else this.clearSelection()
            } else if (key === 'Backspace' || key === 'Delete') {
                e.preventDefault()
                this.clearSelectedCells()
            } else if (key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
                e.preventDefault()
                this.activateCell(cell, { value: key })
            }
        })
    
        this.addEventListenerFor(sel, 'contextmenu', e => {
            e.preventDefault()
            const cell = e.delegateTarget
            const pos = { row: cell.rowIndex, col: cell.cellIndex }
            // If the right-clicked cell isn't part of the current selection, collapse to it.
            const r = this.range()
            const inSel = !!r && pos.row >= r.r0 && pos.row <= r.r1 && pos.col >= r.c0 && pos.col <= r.c1
            if (!inSel) {
                this.active = pos
                this.cursor = pos
                this.setSelection(pos)
                cell.focus({ preventScroll: true })
            }
            this.activateContextMenu(e)
        })

        this.addEventListener('copy', e => {
            if (this.selection && this.contains(this.getRootNode().activeElement)) {
                e.preventDefault();
                this.copyCells()
            }
        })
        this.addEventListener('paste', e => {
            if (this.selection && !this._editing && this.contains(this.getRootNode().activeElement)) {
                e.preventDefault()
                if (e.clipboardData.files.length > 0) {
                    this.pasteData(e.clipboardData.files)
                } else {
                    this.pasteData(e.clipboardData.getData("text/plain"))
                }
            }
        })
    }

    /** Make cells focusable, set once per physical element (pooled cells keep it). */
    acquireCell() {
        const cell = super.acquireCell()
        if (cell.tabIndex < 0) cell.tabIndex = 0 // freshly created cells default to -1
        return cell
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
        this._copying = false // any new/changed selection cancels the copy marquee
        this.selection = { anchor, focus }
        this.paintSelection()
    }
    clearSelection() {
        this._copying = false
        this.selection = null
        this.paintSelection()
    }

    /** Whether a record's row renders readonly (non-editable) cells. */
    isRecordReadonly(record) {
        return this.readonly ? !!this.readonly(record) : false
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
                // `readonly` is a per-binding property, applied in DataSpreadsheetCell#bind.
            }
        }
        this.renderSelectionIndicator(r)
    }

    /**
     * The border box around the selection range — solid normally, dashed (`.copy`)
     * while a copy is pending (the marquee).
     */
    renderSelectionIndicator(r = this.range()) {
        if (!r) {
            if (this._selectIndicator) { this._selectIndicator.remove(); this._selectIndicator = null }
            return
        }
        const el = this._selectIndicator || (this._selectIndicator = this.body.appendChild(createElement(`${this.localName}-select-indicator`)))
        const cg = this.columnGeometry, rg = this.rowGeometry
        el.style.left = cg.offsetAt(r.c0) + 'px'
        el.style.top = rg.offsetAt(r.r0) + 'px'
        el.style.width = (cg.offsetAt(r.c1) + cg.sizeAt(r.c1) - cg.offsetAt(r.c0)) + 'px'
        el.style.height = (rg.offsetAt(r.r1) + rg.sizeAt(r.r1) - rg.offsetAt(r.r0)) + 'px'
        el.classList.toggle('copy', !!this._copying)
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
            this.setSelection({ row, col }) // setSelection clears the copy marquee
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
     * Begin editing a cell.
     */
    async activateCell(cell, options = {}) {
        if (this._editing) this._editing.floater.hide()
        const { column } = cell
        if (!column || cell.record == null || column.editable === false) return
        if (this.isRecordReadonly(cell.record)) return

        // `readonly` is gated on the cell's row record above; input/toggle/paste act on the
        // column's (possibly resolved) record. Resolved + memoized via the row.
        const record = await cell.row.resolvedRecordFor(column)
        if (record == null) return

        if (column.toggleable) {
            column.toggle(record)
            cell.render()
            this.trigger('cellChanged', { detail: { cell, column, record } })
            return
        }

        // Pass the live cell so editors that need it (re-render, navigate after select) can
        // use it; the base column input ignores the extra arg.
        const input = column.input(record, options.value != null ? { value: options.value } : {}, cell)
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
            },
            onHidden: e => {
                cell.tabIndex = 0
                if (this._editing && this._editing.floater === floater) this._editing = null
                cell.render() // reflect the value the bound input wrote (or the unchanged value on cancel)
                this.trigger('cellChanged', { detail: { cell, column, record } })
            }
        })
        this._editing = { cell, column, record, floater }
        cell.tabIndex = -1
        
        floater.addEventListener('keydown', e => {
            e.stopPropagation()
            if (e.key === 'Enter' && !e.shiftKey) {
                // push this to end of event stack so other callbacks fire
                // select column was not firing click on <enter>
                requestAnimationFrame(() => {
                    e.preventDefault();
                    this.moveActive('down')
                })
                
            }
            else if (e.key === 'Tab') {
                e.preventDefault();
                this.moveActive(e.shiftKey ? 'left' : 'right')
            }
            else if (e.key === 'Escape') {
                e.preventDefault();
                floater.setAttribute('preventChange', true);
                cell.focus({ preventScroll: true })
            }
        })

        floater.show() // appends into this.utilities (see container option above)

        // Focus the editor once it's positioned (the bound input is the element itself).
        requestAnimationFrame(() => {
            input.focus?.()
            if (input.select && options.value == undefined) input.select()
            if (input.showPicker && input.tagName === 'SELECT') { /* selects open on focus/click */ }

        })
    }

    /* -----------------------------------------------------------------
       Copy / paste / clear (record-driven, work across off-screen ranges)
    ----------------------------------------------------------------- */
    quote(v) {
        return (typeof v === 'string' && (v.includes('\n') || v.includes('\t'))) ? '"' + v + '"' : v
    }

    /**
     * TSV for the selection. Resolves each column's record per row (so off-screen rows are
     * included and resolver columns serialize their sub-record). Returns a Promise; it
     * settles synchronously when records are already loaded.
     */
    async copyText() {
        const r = this.range()
        if (!r) return ''
        const lines = []
        for (let row = r.r0; row <= r.r1; row++) {
            const cols = []
            for (let col = r.c0; col <= r.c1; col++) {
                const column = this.columns[col]
                cols.push(this.quote(column.valueFor(await this.rows[row].resolvedRecordFor(column))))
            }
            lines.push(cols.join('\t'))
        }
        return lines.join('\n')
    }

    copyCells() {
        if (!this.selection) return
        // Show the marquee immediately; copyText is async (records may resolve), so write the
        // clipboard once it settles — via the async Clipboard API (can't use the copy event's
        // clipboardData after an await).
        this._copying = true
        this.paintSelection()
        this.copyText().then(tsv => { if (navigator.clipboard) navigator.clipboard.writeText(tsv) })
    }

    pasteData(data) {
        if (data == null) return
        const r = this.range() || (this.active && { r0: this.active.row, r1: this.active.row, c0: this.active.col, c1: this.active.col })
        if (!r) return
        let matrix
        if (typeof data == 'string') {
            matrix = splitByUnquotedChar(data, "\n").map(r => splitByUnquotedChar(r, "\t"))
        } else {
            matrix = [[data]]
        }

        if (matrix.length > 1 && matrix[matrix.length - 1].length === 1 && matrix[matrix.length - 1][0] === '') {
            matrix.pop()
        }
        const srcRows = matrix.length
        const srcCols = Math.max(0, ...matrix.map(m => m.length))
        if (!srcRows || !srcCols) return

        // Tile the copied block in whole segments to fill the target range; any partial
        // segment beyond the last whole repeat is left empty (e.g. a 1x3 block into a 1x7
        // target fills two segments — [1,2,3,1,2,3] — leaving the 7th cell empty). A target
        // smaller than the block still pastes one whole copy (extending past the selection).
        const repRows = Math.max(1, Math.floor((r.r1 - r.r0 + 1) / srcRows))
        const repCols = Math.max(1, Math.floor((r.c1 - r.c0 + 1) / srcCols))

        for (let tr = 0; tr < repRows; tr++) {
            for (let tc = 0; tc < repCols; tc++) {
                this.pasteMatrixAt(matrix, r.r0 + tr * srcRows, r.c0 + tc * srcCols)
            }
        }

        this.active = { row: r.r0, col: r.c0 }
        this.cursor = {
            row: Math.min(this.rows.length - 1, r.r0 + repRows * srcRows - 1),
            col: Math.min(this.columns.length - 1, r.c0 + repCols * srcCols - 1)
        }
        this.setSelection(this.active, this.cursor) // selects the filled region; clears the copy marquee
        this.trigger('cellChanged', { detail: { range: this.range() } })
    }

    pasteMatrixAt(matrix, row0, col0) {
        matrix.forEach((cols, dr) => cols.forEach(async (data, dc) => {
            const row = this.rows[row0 + dr]
            const column = this.columns[col0 + dc]
            if (!row || !column) return
            if (this.isRecordReadonly(row.record)) return
            const record = await row.resolvedRecordFor(column)
            if (record == null) return
            if (typeof data == 'string') {
                if (column.accepts('text/plain')) {
                    await column.paste(record, data)
                } else {
                    this.trigger('invalidPaste', { detail: data });
                    return
                }
            } else if (data instanceof FileList) {
                const files = []
                for (const file of data) {
                    if (column.accepts(file.type)) {
                        files.push(file)
                    } else {
                        this.trigger('invalidPaste', {
                            detail: data
                        })
                        return
                    }
                }
                if (files.length > 0) {
                    await column.paste(record, files)
                }
            }
            
            const cell = row.cellOf(column)
            if (cell) cell.render()
        }))
    }

    /**
     * Read the system clipboard and paste it into the current selection. Use this for
     * programmatic paste (e.g. a context-menu Paste action); the native `paste` event in
     * {@link DataSpreadsheet#setupSelection} handles ⌘V/Ctrl+V directly. When the async
     * Clipboard API or its permission is unavailable, fall back to {@link DataSpreadsheet#renderPasteModal}
     * which explains the keyboard shortcuts.
     */
    async pasteFromClipboard() {
        if (!window.navigator.permissions || !window.navigator.clipboard || !window.navigator.clipboard.readText) {
            this.renderPasteModal()
            return
        }
        try {
            await window.navigator.permissions.query({
                name: 'clipboard-read',
                requestedOrigin: window.location.origin,
            })
            this.pasteData(await window.navigator.clipboard.readText())
        } catch (e) {
            this.renderPasteModal()
        }
    }

    /**
     * Fallback shown when the clipboard can't be read programmatically — explains the
     * ⌘C/⌘X/⌘V (or Ctrl) shortcuts the user can still use.
     */
    renderPasteModal() {
        const modifier = window.navigator.userAgent.toLowerCase().includes('mac') ? "&#8984;" : "Ctrl"
        this.getRootNode().body.append(new Modal({
            class: 'paste-modal',
            content: [
                {
                    tag: 'h1',
                    content: 'Copying and Pasting'
                },
                {
                    tag: 'p',
                    content: 'These actions are unavailable using the Edit menus, but you can still use:',
                    style: {
                        'margin-block': '1em'
                    }
                },
                {
                    class: 'flex text-center',
                    style: {
                        display: 'flex',
                        gap: '1em',
                    },
                    content: [{
                        content: [{
                            tag: 'h1',
                            content: `${modifier}C`
                        }, {
                            content: 'copy'
                        }]
                    }, {
                        content: [{
                            tag: 'h1',
                            content: `${modifier}X`
                        }, {
                            content: 'cut'
                        }]
                    }, {
                        content: [{
                            tag: 'h1',
                            content: `${modifier}V`
                        }, {
                            content: 'paste'
                        }]
                    }]
                }
            ]
        }))
    }

    async clearSelectedCells() {
        const r = this.range()
        if (!r) return
        for (let row = r.r0; row <= r.r1; row++) {
            if (this.isRecordReadonly(this.rows[row].record)) continue
            for (let col = r.c0; col <= r.c1; col++) {
                const column = this.columns[col]
                await column.clear(await this.rows[row].resolvedRecordFor(column))
                const cell = this.rows[row].cellOf(column)
                if (cell) cell.render()
            }
        }
        this.trigger('cellChanged', { detail: { range: r } })
    }

    /* -----------------------------------------------------------------
       Context menu (right-click) — Copy / Paste, with a per-column hook
    ----------------------------------------------------------------- */
    activateContextMenu(e) {
        const cell = e.delegateTarget
        const menu = this.renderContextMenu(cell)
        if (!menu) return
        if (this.contextMenu) {
            this.contextMenu.hide()
            delete this.contextMenu
        }
        const targetBB = cell.getBoundingClientRect()
        this.contextMenu = new Floater({
            class: `${this.localName}-context-menu-floater`,
            content: menu,
            anchor: cell,
            container: this.utilities, // grid-level layer above the header/frozen z-stack
            offset: {
                mainAxis: e.offsetX - targetBB.width,
                crossAxis: e.offsetY
            },
            placement: 'right-start',
            shift: false,
            flip: true,
            autoPlacement: false,
            removeOnBlur: true,
            autoUpdate: false
        })
        this.contextMenu.show()
    }

    renderContextMenu(cell) {
        // Nothing selected → no menu.
        if (!this.selection || !cell.column) return null
        const menu = createElement(`${this.localName}-context-menu`, {
            content: [
                listenerElement('button', {
                    name: 'copy',
                    type: 'button',
                    content: 'Copy'
                }, () => {
                    this.copyCells()
                    if (this.contextMenu) {
                        this.contextMenu.remove()
                        delete this.contextMenu
                    }
                }),
                listenerElement('button', {
                    name: 'paste',
                    type: 'button',
                    content: 'Paste'
                }, () => {
                    // Reads the clipboard programmatically; falls back to the
                    // keyboard-shortcut modal when that's unavailable (see #55).
                    this.pasteFromClipboard()
                    if (this.contextMenu) {
                        this.contextMenu.remove()
                        delete this.contextMenu
                    }
                })
            ]
        })
        // Per-column customization hook (mirrors Spreadsheet): a column type may
        // augment or replace the menu.
        return cell.column.contextMenu(menu, cell, cell.column)
    }

    static style = function () { return `
        ${this.tagName} {
            --select-oklch: 57.37% 0.1946 257.86;
            --select-color: oklch(var(--select-oklch));
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
        ${this.tagName}-cell.readonly {
            cursor: default;
        }
        ${this.tagName}-cell.readonly.active,
        ${this.tagName}-cell.readonly:focus {
            outline-color: var(--disabled-color, #cecece);
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
            outline: 1px solid var(--select-color);
            z-index: 5;
        }
        ${this.tagName}-select-indicator.copy {
            outline-style: dashed;
            outline-width: 2px;
            box-shadow: 0 0 0 1px var(--select-color);
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

        komp-modal.paste-modal {
            background: white;
            padding: 1em;
        }

        /* Right-click context menu — a small floating button list, above the
           selection/editor layers (mirrors komp-spreadsheet-context-menu). */
        .${this.tagName}-context-menu-floater {
            z-index: 6;
        }
        ${this.tagName}-context-menu {
            display: block;
            border-radius: 0.35em;
            background: white;
            padding: 0.5em;
            font-size: 0.8em;
            box-shadow: 0 2px 12px 2px rgba(0,0,0, 0.2), 0 1px 2px 1px rgba(0,0,0, 0.3);
        }
        ${this.tagName}-context-menu > button {
            display: block;
            width: 100%;
            outline: none;
            appearance: none;
            border: none;
            background: none;
            padding: 0.2em 0.5em;
            border-radius: 0.25em;
        }
        ${this.tagName}-context-menu > button:disabled {
            opacity: 0.5;
        }
        ${this.tagName}-context-menu > button:disabled:hover {
            background: white;
            color: inherit;
        }
        ${this.tagName}-context-menu > button:focus,
        ${this.tagName}-context-menu > button:hover {
            background: oklch(var(--select-oklch) / 0.2);
        }
        ${this.tagName}-context-menu > button:hover {
            color: var(--select-color);
        }
    `}

    static { this.define() }
}
