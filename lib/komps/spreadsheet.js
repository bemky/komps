/*
Description
----
A (Table)[/table] with editable cells

Syntax
----
```javascript
new Spreadsheet({
    data: [{
        name: "Corey Seager",
        team: "Texas Rangers",
        ops: 1.023,
        avg: 0.311,
        positions: ["SS"]
    }, {
        name: "Marcus Semien",
        team: "Texas Rangers",
        ops: 0.823,
        avg: 0.283,
        positions: ["2B"]
    }],
    columns: [{
        render: r => r.name,
        header: 'Name'
    }, {
        render: r => r.team,
        header: 'Team',
    }, {
        render: r => r => r.ops.toLocaleString().replace(/^0/, ''),
        header: 'OPS',
        width: '10%'
    }]
})
```

Example
----
<div class="flex pad-2x width-100-vw height-500-px overflow-hidden">
    <div class="spreadsheet-container width-full"></div>
</div>
<script type="application/json" src="/texas-rangers-roster.json" id="texas-rangers-roster"></script>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        fetch("/texas-rangers-roster.json").then(response => {
            response.json().then(data => {
                document.querySelector('.spreadsheet-container').append(new Spreadsheet({
                    class: 'height-full width-full',
                    data: data,
                    columns: [{
                            attribute: 'Name',
                            resize: false,
                            reorder: false,
                            frozen: true
                        }, {
                            attribute: 'TEAM',
                            frozen: true
                        }, {
                            attribute: 'Team MVP',
                            type: 'radio',
                            frozen: true
                        }, {
                            attribute: 'CAPTAIN',
                            type: 'checkbox'
                        }, {
                            attribute: 'POS',
                            type: 'select',
                            options: [
                                'C', '1B', '2B', '3B', 'SS', 'LF', 'RF', 'CF', 'P',
                            ]
                        }, {
                            header: "Bat Weight",
                            attribute: "weight",
                            splitBy: r => r.bats || [{}]
                        },{
                            attribute: "RBI",
                            type: 'number',
                        },{
                            attribute: "AVG",
                            type: 'number',
                        },{
                            attribute: "DOB",
                            type: 'date',
                        },{
                            attribute: "OPS",
                            type: 'number',
                        },{
                            attribute: "WAR",
                            type: 'number',
                        },{
                            attribute: "TB",
                            type: 'number',
                        },{
                            attribute: "BB",
                            type: 'number',
                        },{
                            attribute: "SO",
                            type: 'number',
                        },{
                            attribute: "SB",
                            type: 'number',
                        },{
                            attribute: "OBP",
                            type: 'number',
                        },{
                            attribute: "SLG",
                            type: 'number',
                        }
                    ]
                }))
            })
        })
        
    });
</script>


Options
----
scrollSnap:
    types: Boolean
    description: Enable scroll snapping (WIP, needs to update scroll-start when frozen rows/columns stick)
    default: false



TODO
----
- [x] Resize
- [x] Reorder
- [x] Input
- [x] Cell Navigation (Arrows, Tab, Enter)
- [x] ContextMenu
- [x] Cell Selection
- [x] Copy/Paste
- [x] scrollTo on focusCell when under frozenCell
- [x] edit header
- [x] selected columns resize
- [x] pasting from text to number or select or checkbox...
- [x] copy cell > select header > paste
- [x] shift click header
- [x] enter on input cell causes scroll
- [x] Update --scroll-start when frozen col/rows stuck and unstuck
- [x] stuck style for header
- [x] shift arrow key to select cells
- [ ] collapse selectedCells when pasting to match dimensinos of copy (like google sheets)
- [ ] expand selectedCells when pastiung to match dimensinos of copy (like google sheets)
- [ ] select multiple columns reorder, only moves one
- [ ] edit header needs to fire event, or provide object to change
- [ ] Tab to a cell causes sheet to scroll instead of using single cell scroll of focusAdjacentCell
- [ ] insert/remove column
- [ ] copy/paste split row
- [ ] mouse select cells, then arrow select, arrow selection starts at original start of mouse and not end
- [ ] selection outline overlays and doesn't track with frozen cells


*/
import { createElement, listenerElement, content, insertAfter } from 'dolla';
import { result, except, placeCaretAtEnd, closest, groupBy, isInView, splitByUnquotedChar } from '../support';
import Table from './table.js';
import Floater from './floater.js';
import Cell from './spreadsheet/cell';
import Column from './spreadsheet/column';
import ReadonlyColumn from './spreadsheet/columns/readonly-column';
import NumberColumn from './spreadsheet/columns/number-column';
import CheckboxColumn from './spreadsheet/columns/checkbox-column';
import SelectColumn from './spreadsheet/columns/select-column';
import { reorderable, resizable } from './plugins';

export default class Spreadsheet extends Table {
    static tagName = 'komp-spreadsheet'
    
    static assignableAttributes = {
        scrollSnap: false
    }
    
    static columnTypeRegistry = {
        select: SelectColumn,
        number: NumberColumn,
        checkbox: CheckboxColumn,
        radio: CheckboxColumn,
        readonly: ReadonlyColumn,
        default: Column
    }
    
    _copyData;
    
    initialize () {
        if (this.scrollSnap) {
            this.classList.add('scroll-snap')
        }
        this.addEventListenerFor(this.cellSelector, 'mousedown', e => {
            if (e.button == 0) {
                this.clearSelectedCells()
                this.activateMouseCellSelection(e.delegateTarget, e)
            }
        })
        this.addEventListenerFor(this.cellSelector, 'dblclick', e => {
            e.delegateTarget.activate();
        })
        
        this.addEventListenerFor(`${this.tagName}-reorder-handle`, ['click', 'contextmenu'], e => {
            this.activateContextMenu(e)
            e.preventDefault()
        })
        
        this.addEventListenerFor(this.cellSelector, 'contextmenu', e => {
            this.activateContextMenu(e)
            if (!e.delegateTarget.classList.contains('selected')) {
                this.clearSelectedCells()
                this.selectCells(e.delegateTarget, e.delegateTarget, true)
            }
            e.preventDefault()
        })
        this.addEventListenerFor(this.cellSelector, 'keydown', async e => {
            if (["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) {
                e.preventDefault()
                const targetCell = e.delegateTarget.focusAdjacentCell(e.key.replace('Arrow', '').toLowerCase())
                if (e.shiftKey) {
                    this.selectStartCell = this.selectStartCell || e.delegateTarget
                    this.selectCells(this.selectStartCell, targetCell, true)
                } else {
                    this.clearSelectedCells()
                }
            } else if (e.key == "Enter" && e.delegateTarget == this.getRootNode().activeElement) {
                e.preventDefault();
                e.delegateTarget.activate();
            } else if (e.key == "Tab") {
                e.preventDefault()
                e.delegateTarget.focusAdjacentCell(e.shiftKey ? 'left' : 'right')
            } else if (e.key == "Escape") {
                this.clearSelectedCells('')
            } else if (['Backspace', 'Delete', 'Clear'].some(x => x == e.key)) {
                e.delegateTarget.clear()
            } else if (e.key.length == 1 && [e.metaKey,e.ctrlKey,e.altKey].every(x => x == false)) {
                e.delegateTarget.activate({
                    value: e.key
                });
                e.preventDefault()
            }
        })
        return super.initialize()
    }
    
    connected (...args) {
        if (!this.getRootNode()) { return }
        this.cleanupEventListenerFor(this.getRootNode(), 'paste', e => {
            if (this.contains(document.activeElement)) {
                e.preventDefault()
                this.pasteData(e.clipboardData.getData("text/plain"))
            }
        })
        
        this.cleanupEventListenerFor(this.getRootNode(), 'copy', e => {
            if (this.contains(document.activeElement)) {
                e.preventDefault()
                this.copyCells()
            }
        })
        return super.connected(...args)
    }
    
    /* -------------------
        Cell Selection
    ------------------- */
    selectCells (start, end, isDone=false) {
        const isHeader = start.localName.includes('header') || end.localName.includes('header')
        const selectClass = isDone ? 'selected' : 'selecting';

        this.queryCells('.' + selectClass).forEach(el => el.classList.remove(selectClass))
        this.querySelectorAll(`${this.localName}-outline:not(.copy)`).forEach(el => el.remove())
        let [colMin, colMax] = [start.cellIndex, end.cellIndex].sort((a,b)=>a-b)
        let [rowMin, rowMax] = [start.rowIndex, end.rowIndex].sort((a,b)=>a-b)
        if (isHeader) { [rowMin, rowMax] = [0, -1] }
        
        let cellSplitMin, cellSplitMax
        if (start.cellSplitIndex && end.cellSplitIndex) {
            if (start.rowIndex < end.rowIndex) {
                cellSplitMin = start.cellSplitIndex
                cellSplitMax = end.cellSplitIndex
            } else if (start.rowIndex == end.rowIndex && start.cellSplitIndex < end.cellSplitIndex) {
                cellSplitMin = start.cellSplitIndex
                cellSplitMax = end.cellSplitIndex
            } else {
                cellSplitMin = end.cellSplitIndex
                cellSplitMax = start.cellSplitIndex
            }
        }
        
        
        const cells = this.slice([colMin, rowMin, cellSplitMin], [colMax, rowMax, cellSplitMax])
        cells.forEach(cell => {
            cell.classList.add(selectClass)
        })
        
        if (isDone) {
            this.outlineCells(cells)
        }
    }
    selectedCells () {
        let cells = this.queryCells('.selected')
        if (cells.length == 0) {
            cells = this.queryCells(':focus')
        }
        return cells
    }
    clearSelectedCells (scope=':not(.copy)') {
        delete this.selectStartCell
        this.queryCells(`.selecting${scope}`).forEach(el => el.classList.remove('selecting'))
        this.queryCells(`.selected${scope}`).forEach(el => el.classList.remove('selected'))
        this.querySelectorAll(`${this.localName}-outline${scope}`).forEach(el => el.remove())
        if (this.inputCell) {
            this.inputCell.beforeRemove()
            this.inputCell.remove()
        }
    }
    activateMouseCellSelection (startingCell, e) {
        const is_header = startingCell.localName.includes('header')
        
        const mouseOver = e => {
            const currentCell = closest(e.target, this.cellSelector)
            if (currentCell) {
                this.selectCells(startingCell, currentCell)
            }
        }
        
        const mouseUp = e => {
            const endCell = closest(e.target, this.cellSelector)
            if (endCell != startingCell || endCell.localName.includes('header')) {
                const selectingCells = this.queryCells('.selecting')
                selectingCells.forEach(el => {
                    el.classList.remove('selecting')
                    el.classList.add('selected')
                })
                this.outlineCells(selectingCells)
            }
            this.removeEventListener('mouseover', mouseOver)
            startingCell.focus()
        }
        
        if (e.shiftKey) {
            const currentCell = startingCell
            startingCell = this.queryCell(':focus')
            startingCell = startingCell || this.queryCell('.selecting')
            e.preventDefault()
            mouseOver({ target: currentCell })
        } else if (is_header) {
            mouseOver({target: startingCell})
        }
        
        this.getRootNode().addEventListener('mouseup', mouseUp, {once: true})
        this.addEventListener('mouseover', mouseOver)
    }
    outlineCells (cells) {
        if (!Array.isArray(cells)) { cells = Array.from(cells) }
        const outline = createElement(`${this.localName}-outline`, {
            style: {
                'grid-area': [
                    Math.min(...cells.map(c => c.rowIndex)),
                    Math.min(...cells.map(c => c.cellIndex)),
                    Math.max(...cells.map(c => c.rowIndex)) + 1,
                    Math.max(...cells.map(c => c.cellIndex)) + 1,
                ].join(" / ")
            }
        })
        this.append(outline)
        
        const cellsTop = Math.min(...cells.map(c => c.offsetTop))
        const cellsBottom = Math.max(...cells.map(c => c.offsetTop + c.offsetHeight))
        if (outline.offsetTop < cellsTop) {
            outline.style.marginTop = cellsTop - outline.offsetTop + "px"
        }
        if (outline.offsetTop + outline.offsetHeight > cellsBottom) {
            outline.style.marginBottom = ((outline.offsetTop + outline.offsetHeight) - cellsBottom) + "px"
        }
        
        return outline
    }
    
    /* ---------------------
        Context Menu
    --------------------- */
    activateContextMenu (e) {
        const cell = e.delegateTarget.cell || e.delegateTarget
        const menu = this.renderContextMenu(cell)
        const targetBB = e.target.getBoundingClientRect()
        if (this.contextMenu) {
            this.contextMenu.hide()
            delete this.contextMenu
        }
        this.contextMenu = new Floater({
            content: menu,
            anchor: {
                x: e.offsetX + targetBB.x,
                y: e.offsetY + targetBB.y
            },
            shift: true,
            flip: true,
            placement: 'right-start',
            autoPlacement: false,
            removeOnBlur: true,
            onAfterRemove: () => {
                this.style.removeProperty('overflow')
            }
        })
        this.style.overflow = 'hidden';
        this.append(this.contextMenu)
    }
    
    renderContextMenu (cell) {
        if (cell.contextMenu) {
            return cell.contextMenu(createElement('komp-spreadsheet-context-menu', {
                content: [
                    listenerElement('button', {
                        name: 'copy',
                        type: 'button',
                        content: 'Copy',
                        disabled: !cell.canCopy || !cell.canCopy()
                    }, e => {
                        this.copyCells()
                        if (this.contextMenu) {
                            this.contextMenu.remove()
                            delete this.contextMenu
                        }
                    }),
                    listenerElement('button', {
                        name: 'paste',
                        type: 'button',
                        content: 'Paste',
                        disabled: !cell.canPaste || !(cell.canPaste() && (window.navigator.clipboard.readText != undefined || this.copyData))
                    }, async e => {
                        if (window.navigator.clipboard.readText == undefined) {
                            this.pasteData(this.copyData)
                        } else {
                            this.pasteData(await window.navigator.clipboard.readText())
                        }
                        if (this.contextMenu) {
                            this.contextMenu.remove()
                            delete this.contextMenu
                        }
                    })
                ]
            }))
        }
    }
    
    /* -----------------
        Copy / Paste
    ----------------- */
    async copyCells () {
        const selectedCells = this.selectedCells()
        const rows = Object.values(groupBy(Array.from(selectedCells), 'rowIndex')).map(async row => {
            return (await Promise.all(row.map(async cell => {
                const v = await cell.copy()
                if (typeof v == "string" && (v.includes("\n") || v.includes("\t"))) {
                    return "\"" + v + "\""
                }
                return v
            }))).join("\t")
        })
        const data = (await Promise.all(rows)).join("\n")
        window.navigator.clipboard.writeText(data)
        this._copyData = data
        this.clearSelectedCells('')
        const outline = this.outlineCells(selectedCells)
        outline.classList.add('copy')
    }
    
    pasteData(data) {
        if (data == undefined) { return }
        const cellMatrix = Object.values(groupBy(Array.from(this.selectedCells()), 'rowIndex'))
        const dataMatrix = splitByUnquotedChar(data, "\n").map(r => splitByUnquotedChar(r, "\t"))
        cellMatrix.forEach((row, rowIndex) => {
            const dataRowIndex = rowIndex % dataMatrix.length
            row.forEach(async (cell, colIndex) => {
                if (cell.paste) {
                    const dataColIndex = colIndex % dataMatrix[dataRowIndex].length
                    await cell.paste(dataMatrix[dataRowIndex][dataColIndex])
                    cell.render()
                }
            })
        })
        this.querySelector(`${this.localName}-outline.copy`)?.remove()
    }

    static style = `
        komp-spreadsheet {
            --select-color: #1a73e8;
            --scroll-start: 0px;
            overflow: scroll;
            scroll-behavior: smooth;
            overscroll-behavior: none;
        }
        komp-spreadsheet.scroll-snap {
            scroll-snap-type: both mandatory;
            scroll-padding-inline-start: var(--scroll-start);
        }
        komp-spreadsheet.scroll-snap komp-spreadsheet-cell {
            scroll-snap-stop: always;
            scroll-snap-align: start;
        }
        
        komp-spreadsheet-header-cell,
        komp-spreadsheet-cell {
            cursor: cell;
            user-select: none;
        }
        komp-spreadsheet-cell:focus,
        komp-spreadsheet-cell.focus {
            outline: 2px solid var(--select-color);
            outline-offset: -1px;
        }
        komp-spreadsheet-cell.selected,
        komp-spreadsheet-cell.selecting {
            box-shadow: inset 0 0 0 999px rgba(26, 115, 232, 0.1);
        }
        komp-spreadsheet komp-table-header > *:focus,
        komp-spreadsheet komp-table-header > *.selecting,
        komp-spreadsheet komp-table-header > *.selected {
            box-shadow: inset 0 2px 0 0 rgba(26, 115, 232, 1), inset 0 0 0 999px rgba(26, 115, 232, 0.1);
            outline: none !important;
        }
        
        komp-spreadsheet-input {
            position: relative;
        }
        komp-spreadsheet-input > label {
            position: absolute;
            top: 0;
            left: 0;
            width: auto;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 100%;
            min-width: 100%;
            background: white;
            box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.35);
            outline: 2px solid var(--select-color);
            outline-offset: -2px;
            margin: -1px
        }
        komp-spreadsheet-input > label > input,
        komp-spreadsheet-input > label > textarea,
        komp-spreadsheet-input > label > select,
        komp-spreadsheet-input > label > komp-content-area {
            background: none;
            width: auto;
            min-height: 100%;
            min-width: 100%;
            outline: none;
            padding: var(--padding, unset);
            border: none;
        }
        komp-spreadsheet-input komp-content-area {
            width: max-content;
            max-width: var(--remaining-width);
            max-height: var(--remaining-height);
        }
        komp-spreadsheet-input > label > input {
            width: 1px; // make so doesn't initially overflow column
        }
        
        komp-spreadsheet-context-menu {
            display: block;
            border-radius: 0.35em;
            background: white;
            padding: 0.5em;
            font-size: 0.8em;
            box-shadow: 0 2px 12px 2px rgba(0,0,0, 0.2), 0 1px 2px 1px rgba(0,0,0, 0.3);
        }
        komp-spreadsheet-context-menu > button {
            display: block;
            width: 100%;
            outline: none;
            appearance: none;
            border: none;
            background:none;
            padding: 0.2em 0.5em;
            border-radius: 0.25em;
        }
        komp-spreadsheet-context-menu > button:disabled {
            opacity: 0.5;
        }
        komp-spreadsheet-context-menu > button:disabled:hover {
            background: white;
            color: inherit;
        }
        komp-spreadsheet-context-menu > button:focus,
        komp-spreadsheet-context-menu > button:hover {
            background: rgba(26, 115, 232, 0.2);
        }
        komp-spreadsheet-context-menu > button:hover {
            color: var(--select-color);
        }
        
        komp-spreadsheet-outline {
            pointer-events: none;
            outline: 1px solid var(--select-color);
        }
        komp-spreadsheet-outline.copy {
            outline: 2px dashed var(--select-color);
        }
        
        
        komp-spreadsheet-cell               { z-index: 1; }
        komp-spreadsheet-cell:focus,
        komp-spreadsheet-cell.focus         { z-index: 2; }
        
        komp-spreadsheet-cell:focus         { z-index: 25; }
        komp-spreadsheet-input              { z-index: 26; }
        
        

        komp-spreadsheet-cell.frozen                   { z-index: 100; }
        komp-spreadsheet-cell.frozen.focus,
        komp-spreadsheet-cell.frozen:focus             { z-index: 101; }
        komp-spreadsheet-input.frozen                  { z-index: 102; }
        komp-spreadsheet komp-table-header             { z-index: 110; }
        komp-spreadsheet komp-table-header > .frozen   { z-index: 111; }
        
        komp-spreadsheet-drag-indicator     { z-index: 200; }
        komp-spreadsheet-resize-handle      { z-index: 200; }
        komp-spreadsheet-reorder-handle     { z-index: 200; }
        komp-spreadsheet-outline            { z-index: 201; }
        komp-spreadsheet komp-floater       { z-index: 300; }
    `
}
Spreadsheet.include(resizable)
Spreadsheet.include(reorderable)
window.customElements.define(Spreadsheet.tagName, Spreadsheet);