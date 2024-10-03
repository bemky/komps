/*
Description
----
DataGrid with editable cells

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
                    defaultRowSize: 'calc(1lh + 1em)',
                    class: 'height-full width-full',
                    data: data,
                    columns: [{
                            attribute: 'Name',
                        }, {
                            attribute: 'TEAM',
                        }, {
                            attribute: 'Team MVP',
                            type: 'radio'
                        }, {
                            attribute: 'CAPTAIN',
                            type: 'checkbox'
                        }, {
                            attribute: 'POS',
                            type: 'select',
                            options: [
                                'C', '1B', '2B', '3B', 'SS', 'LF', 'RF', 'CF', 'P',
                            ]
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
reorder:
    types: Boolean, String
    description: Enable ability to reoder rows and columns. Pass "rows" or "columns" to reorder just one axis.
    default: true
resize:
    types: Boolean, String
    description: Enable ability to resize rows and columns. Pass "rows" or "columns" to reorder just one axis.
    default: true
scrollSnap
    types: Boolean
    description: Enable scroll snapping (WIP, needs to update scroll-start when frozen rows/columns stick)
    default: false

Column Options
----
Columns are modeled by an Object that provides a key for each column and it's options.

```javascript
{
    render: player => player.height,
    header: 'Player Height',
    frozen: true
}
```

attribute:
    types: String
    description: attribute of record to use for input and rendering

type:
    types: String
    description: what type of cell to render (text, number, checkbox, radio, date...)

frozen:
    types: Boolean
    description: freeze this column to the side


Events
----
rowResize:
    description: fired when a row is resized
    arguments: rowID:String, newSize:Integer, rowSizes:Array
colResize:
    description: fired when a column is resized
    arguments: columnID:String, newSize:Integer
rowReorder:
    description: fired when a row is moved
    arguments: newIndex:Integer, oldIndex:Integer
colReorder:
    description: fired when a column is moved
    arguments: newIndex:Integer, oldIndex:Integer


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
- [ ] selected columns reorder
- [ ] enter on input cell causes scroll
- [ ] Update --scroll-start when frozen col/rows stuck and unstuck


*/
import { createElement, listenerElement, content, insertAfter } from 'dolla';
import { result, except, placeCaretAtEnd, closest, groupBy, isInView } from '../support';
import EditableDataGrid from './data-grid/editable.js';
import Floater from './floater.js';
import Cell from './spreadsheet/cell';
import Column from './spreadsheet/column';
import NumberColumn from './spreadsheet/number-column';
import CheckboxColumn from './spreadsheet/checkbox-column';
import SelectColumn from './spreadsheet/select-column';

export default class Spreadsheet extends EditableDataGrid {
    static tagName = 'komp-spreadsheet'
    
    static assignableAttributes = {
        reorder: ['columns', 'rows'],
        resize: ['columns', 'rows'],
        scrollSnap: false
    }
    
    static typeRegistry = {
        select: SelectColumn,
        number: NumberColumn,
        checkbox: CheckboxColumn,
        radio: CheckboxColumn,
        default: Column
    }
    
    #copyData;
    
    constructor (options, ...args) {
        super(options, ...args)
        this.initializeColumns()
        if (this.scrollSnap) {
            this.classList.add('scroll-snap')
        }
        
        this.addEventListenerFor(`${this.localName}-cell`, 'mousedown', e => {
            if (e.button == 0) {
                this.clearSelectedCells()
                this.activateCellSelection(e.delegateTarget, e)
            }
        })
        
        this.addEventListenerFor(`${this.localName}-cell`, 'dblclick', e => {
            this.activateCell(e.delegateTarget);
        })
        
        this.addEventListenerFor(`${this.tagName}-reorder-handle`, ['click', 'contextmenu'], e => {
            this.activateContextMenu(e)
            e.preventDefault()
        })
        
        this.addEventListenerFor(`${this.localName}-cell`, 'contextmenu', e => {
            this.activateContextMenu(e)
            if (!e.delegateTarget.classList.contains('selected')) {
                this.clearSelectedCells()
                this.selectCells([e.delegateTarget])
            }
            e.preventDefault()
        })
        
        this.addEventListenerFor(`${this.localName}-cell`, 'keydown', async e => {
            if (["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) {
                e.preventDefault()
                this.focusAdjacentCell(e.delegateTarget, e.key.replace('Arrow', '').toLowerCase())
            } else if ((e.key.match(/^[a-z0-9\-\_\$]$/i) || e.key == " ") && [e.metaKey,e.ctrlKey,e.altKey].every(x => x == false)) {
                this.activateCell(e.delegateTarget, {
                    value: e.key
                });
                e.preventDefault()
            } else if (e.key == "Enter" && e.delegateTarget == this.getRootNode().activeElement) {
                e.preventDefault();
                this.activateCell(e.delegateTarget);
            } else if (e.key == "Escape") {
                this.clearSelectedCells('')
            }
        })
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
    
    async initializeColumns () {
        this.columns = await Promise.all(this.columns.map(async column => {
            column = await column
            const klass = this.constructor.typeRegistry[column.type] || this.constructor.typeRegistry.default
            return new klass(column)
        }))
    }
    
    async renderHeader () {
        const row = await super.renderHeader()
        row.row = 1
        return row
    }
    
    createHeaderCell (column, index) {
        const cell = new Cell({ column, header: true, render: function () {
            content(this, result(column, 'header'))
        } })
        if (column.frozen) {
            cell.classList.add('frozen')
        }
        if (column.class) {
            cell.classList.add(...column.class.split(' '))
        }
        cell.classList.add(`column-${index}`, `row-1`)
        cell.tabIndex = 0
        cell.row = 1
        cell.column = index
        return cell
    }
    
    renderHeaderCell (column, index) {
        const cell = super.renderHeaderCell(column, index)
        return cell
    }
    
    async renderRow (record, index) {
        const row = await super.renderRow(record, index)
        row.classList.add(`row-${index}`)
        row.row = index
        return row
    }
    
    createCell (record, column, colIndex, rowIndex) {
        const cell = new Cell({
            record: record,
            column: column
        })
        cell.render()
        return cell
    }
    
    renderCell (record, column, colIndex, rowIndex) {
        const cell = super.renderCell(record, column, colIndex, rowIndex)
        if (column.frozen) {
            cell.classList.add('frozen')
        }
        if (column.class) {
            cell.classList.add(...column.class.split(' '))
        }
        
        cell.classList.add(`column-${colIndex}`, `row-${rowIndex}`)
        cell.column = colIndex
        cell.row = rowIndex
        cell.tabIndex = 0
        return cell
    }

    focusAdjacentCell (cell, direction) {
        const target = this.adjacentCell(cell, ...{
            right: [1, 0],
            left: [-1, 0],
            up: [0, -1],
            down: [0, 1]
        }[direction])
        if (target) {
            this.style.setProperty('scroll-snap-type', 'unset')
            const bb = target.getBoundingClientRect()
            const point = ['left', 'up'].includes(direction) ? [bb.x + 1, bb.y + 1] : [bb.x + bb.width - 1, bb.y + bb.height - 1]
            const topEl = document.elementFromPoint(...point)
            if (target != topEl) {
                if (topEl && this.contains(topEl)) {
                    this.scrollBy({
                        right: {left: topEl.offsetWidth * -1},
                        left: {left: topEl.offsetWidth},
                        up: {top: topEl.offsetHeight * -1},
                        down: {top: topEl.offsetHeight}
                    }[direction])
                } else {
                    this.scroll({
                        right: {top: target.offsetLeft - this.offsetWidth},
                        left: {top: target.offsetLeft + target.offsetWidth - this.offsetWidth},
                        up: {top: target.offsetTop - this.offsetHeight},
                        down: {top: target.offsetTop + target.offsetHeight - this.offsetHeight}
                    }[direction])
                }
            }
            target.focus({preventScroll: true})
            this.style.removeProperty('scroll-snap-type')
        }
    }

    adjacentCell(cell, x, y) {
        return this.querySelector(`${this.localName}-cell.row-${cell.row + y}.column-${cell.column + x}`)
    }
    
    /* -------------------
        Cell Selection
    ------------------- */
    selectCells(cells) {
        cells.forEach(cell => cell.classList.add('selected'))
        this.outlineCells(cells)
    }
    selectedCells () {
        let cells = this.querySelectorAll(`${this.localName}-cell.selected`)
        if (cells.length == 0) {
            cells = this.querySelectorAll(`${this.localName}-cell:focus`)
        }
        return cells
    }
    clearSelectedCells (scope=':not(.copy)') {
        this.querySelectorAll(`${this.localName}-cell.selecting${scope}, ${this.localName}-cell.selected${scope}`).forEach(el => {
            el.classList.remove('selecting', 'selected')
        })
        this.querySelectorAll(`${this.localName}-outline${scope}`).forEach(el => el.remove())
    }
    activateCellSelection (cell, e) {
        const header = cell.closest(`${this.localName}-header`)
        
        const mouseOver = e => {
            const currentCell = closest(e.target, `${this.localName}-cell`)
            if (currentCell) {
                this.querySelectorAll(`${this.localName}-cell.selecting`).forEach(el => el.classList.remove('selecting'))
                const colsMinMax = [cell.column, currentCell.column]
                const rowsMinMax = [cell.row, currentCell.row]
                for (let colIndex = Math.min(...colsMinMax); colIndex <= Math.max(...colsMinMax); colIndex++) {
                    if (header) {
                        this.querySelectorAll(`.column-${colIndex}`).forEach(target => {
                            target.classList.add('selecting')
                        })
                    } else {
                        for (let rowIndex = Math.min(...rowsMinMax); rowIndex <= Math.max(...rowsMinMax); rowIndex++) {
                            const target = this.querySelector(`.row-${rowIndex}.column-${colIndex}`)
                            if (target) { target.classList.add('selecting') }
                        }
                    }
                }
            }
        }
        
        const mouseUp = e => {
            const endCell = closest(e.target, `${this.localName}-cell`)
            if (endCell != cell) {
                const selectingCells = this.querySelectorAll(`${this.localName}-cell.selecting`)
                selectingCells.forEach(el => {
                    el.classList.remove('selecting')
                    el.classList.add('selected')
                })
                this.outlineCells(selectingCells)
            }
            this.removeEventListener('mouseover', mouseOver)
            cell.focus()
        }
        
        if (e.shiftKey) {
            const currentCell = cell
            cell = this.querySelector(`${this.localName}-cell:focus`)
            cell = cell || this.querySelector(`${this.localName}-cell.selecting`)
            e.preventDefault()
            mouseOver({ target: currentCell })
        } else if (header) {
            mouseOver({target: cell})
        }
        
        this.getRootNode().addEventListener('mouseup', mouseUp, {once: true})
        this.addEventListener('mouseover', mouseOver)
    }
    outlineCells (cells) {
        if (!Array.isArray(cells)) { cells = Array.from(cells) }
        const outline = createElement(`${this.localName}-outline`, {
            style: {
                'grid-area': [
                    Math.min(...cells.map(c => c.row)),
                    Math.min(...cells.map(c => c.column)),
                    Math.max(...cells.map(c => c.row)) + 1,
                    Math.max(...cells.map(c => c.column)) + 1,
                ].join(" / ")
            }
        })
        this.append(outline)
        return outline
    }
    
    /* -------------------
        Cell Input
    ------------------- */
    activateCell (cell, options={}) {
        if (cell.spawnInput === undefined || cell.spawnInput === null) { return }
        const inputCell = cell.spawnInput(options)
        if (inputCell === undefined || inputCell === null || inputCell === false) { return }
        inputCell.style.setProperty('--remaining-width', this.offsetWidth - cell.offsetLeft + "px")
        inputCell.style.setProperty('--remaining-height', this.offsetHeight - cell.offsetTop + "px")
        insertAfter(cell, inputCell)
        cell.tabIndex = -1
        inputCell.beforeRemove = () => {
            cell.tabIndex = 0
            cell.render()
        }
        
        const focusTarget = inputCell.querySelector('input, textarea, select, [contenteditable]')
        const setFocus = () => {
            placeCaretAtEnd(focusTarget)
            if (focusTarget.showPicker) {
                focusTarget.showPicker()
            }
        }
        
        if (focusTarget._loading && focusTarget._loading instanceof Promise) {
            focusTarget._loading.then(setFocus)
        } else {
            setFocus()
        }
        
        inputCell.addEventListener('keyup', e => {
            if (e.key == "Escape") {
                inputCell.setAttribute('preventChange', true)
                cell.focus()
                e.preventDefault()
            }
        })
        inputCell.addEventListener('focusout', e => {
            inputCell.beforeRemove()
            if (inputCell.checkValidity === undefined || inputCell.checkValidity()) {
                inputCell.remove()
            }
        })
        inputCell.addEventListener('keydown', e => {
            if (e.key == "Enter" && [e.metaKey,e.ctrlKey,e.altKey,e.shiftKey].every(x => x == false)) {
                this.focusAdjacentCell(cell, 'down')
            }
        })
        return inputCell
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
            onHide: () => {
                this.style.removeProperty('overflow')
            }
        })
        this.style.overflow = 'hidden';
        this.append(this.contextMenu)
    }
    
    renderContextMenu (cell) {
        return cell.contextMenu(createElement('komp-spreadsheet-context-menu', {
            content: [
                listenerElement('button', {
                    type: 'button',
                    content: 'Copy',
                    disabled: !cell.canCopy()
                }, e => {
                    this.copyCells()
                    if (this.contextMenu) {
                        this.contextMenu.remove()
                        delete this.contextMenu
                    }
                }),
                listenerElement('button', {
                    type: 'button',
                    content: 'Paste',
                    disabled: !(cell.canPaste() && (window.navigator.clipboard.readText != undefined || this.copyData))
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
    
    /* -----------------
        Copy / Paste
    ----------------- */
    async copyCells () {
        const selectedCells = this.selectedCells()
        const rows = Object.values(groupBy(Array.from(selectedCells), 'row')).map(async row => {
            return (await Promise.all(row.map(cell => cell.copy()))).join("\t")
        })
        const data = (await Promise.all(rows)).join("\n")
        window.navigator.clipboard.writeText(data)
        this.#copyData = data
        
        let outline = this.querySelector(`${this.localName}-outline`)
        if (!outline) {
            outline = this.outlineCells(selectedCells)
        }
        outline.classList.add('copy')
    }
    
    pasteData(data) {
        if (data == undefined) { return }
        const cellMatrix = Object.values(groupBy(Array.from(this.selectedCells()), 'row'))
        const dataMatrix = data.split("\n").map(r => r.split("\t"))
        cellMatrix.forEach((row, rowIndex) => {
            const dataRowIndex = rowIndex % dataMatrix.length
            row.forEach((cell, colIndex) => {
                if (cell.paste) {
                    const dataColIndex = colIndex % dataMatrix[dataRowIndex].length
                    cell.paste(dataMatrix[dataRowIndex][dataColIndex])
                    cell.render()
                }
            })
        })
        this.querySelector(`${this.localName}-outline.copy`)?.remove()
    }

    static style = `
        komp-spreadsheet {
            --select-color: #1a73e8;
            --handle-size: 10px;
            --scroll-start: 0px;
            position: relative;
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

        komp-spreadsheet-cell {
            cursor: cell;
            user-select: none;
        }
        komp-spreadsheet-cell:focus,
        komp-spreadsheet-cell.focus {
            outline: 2px solid var(--select-color);
            outline-offset: -1px;
        }
        komp-spreadsheet-cell.frozen {
            position: sticky;
            left: 0;
        }
        komp-spreadsheet-cell.selected,
        komp-spreadsheet-cell.selecting {
            box-shadow: inset 0 0 0 999px rgba(26, 115, 232, 0.1);
        }
        
        komp-spreadsheet-header > * {
            position: sticky;
            top: 0;
            cursor: default;
        }
        komp-spreadsheet-header > *:focus,
        komp-spreadsheet-header > *.selecting,
        komp-spreadsheet-header > *.selected {
            box-shadow: inset 0 2px 0 0 rgba(26, 115, 232, 1), inset 0 0 0 999px rgba(26, 115, 232, 0.1);
            outline: none !important;
        }
        
        komp-spreadsheet-input {
            position: relative;
        }
        komp-spreadsheet-input-wrapper {
            position: absolute;
            top: 0;
            left: 0;
            width: auto;
            display: flex;
            flex-direction: column;
            min-height: 100%;
            min-width: 100%;
            background: white;
            box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.5);
            outline: 2px solid var(--select-color);
            outline-offset: -1px;
        }
        komp-spreadsheet-input-wrapper > * {
            flex: 1 0 auto;
        }
        komp-spreadsheet-input-wrapper > input,
        komp-spreadsheet-input-wrapper > textarea,
        komp-spreadsheet-input-wrapper > select,
        komp-spreadsheet-input-wrapper > komp-content-area {
            background: none;
            width: auto;
            min-height: 100%;
            min-width: 100%;
            outline: none;
        }
        komp-spreadsheet-input komp-content-area {
            width: max-content;
            max-width: var(--remaining-width);
            max-height: var(--remaining-height);
        }
        komp-spreadsheet-input input {
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
        
        komp-spreadsheet-header > *         { z-index: 10; }
        komp-spreadsheet-cell.frozen        { z-index: 20; }
        komp-spreadsheet-header > .frozen   { z-index: 21; }
        
        komp-spreadsheet-cell:focus         { z-index: 25; }
        komp-spreadsheet-input              { z-index: 26; }
        
        komp-spreadsheet-resize-handle      { z-index: 30; }
        komp-spreadsheet-reorder-handle     { z-index: 40; }
        komp-spreadsheet-outline            { z-index: 45; }
        
        komp-spreadsheet-drag-indicator     { z-index: 60; }
        komp-floater                        { z-index: 70; }
    `
}

window.customElements.define(Spreadsheet.tagName, Spreadsheet);