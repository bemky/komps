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
<div class="pad-2x min-height-500-px"></div>
<script type="application/json" src="/texas-rangers-roster.json" id="texas-rangers-roster"></script>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        
        fetch("/texas-rangers-roster.json").then(response => {
            response.json().then(data => {
                document.querySelector('div').append(new Spreadsheet({
                    defaultRowSize: 'calc(1lh + 1em)',
                    class: 'height-90-vh',
                    data: data,
                    columns: [{
                            attribute: 'Name',
                            type: 'text'
                        }, {
                            attribute: 'TEAM',
                            type: 'text'
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
headerChange:
    description: fired when header is changed via default input for header
    arguments: columnID:String, newValue:String


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
- [ ] edit header
- [ ] selected columns resize
- [ ] selected columns reorder
- [ ] pasting from text to number or select or checkbox...


BUGS
----
- [ ] Dragging column over frozen column does not scroll panel
- [ ] Grab reorder handle, and scroll opposite direction, and column shadow will cut off with scroll

*/
import { createElement, listenerElement, content, insertAfter } from 'dolla';
import { result, except, placeCaretAtEnd, closest, groupBy, isInView } from '../support';
import EditableDataGrid from './data-grid/editable.js';
import Input from './input.js';
import Floater from './floater.js';

export default class Spreadsheet extends EditableDataGrid {
    static tagName = 'komp-spreadsheet'
    
    static assignableAttributes = {
        reorder: ['columns', 'rows'],
        resize: ['columns', 'rows']
    }
    
    static typeRegistry = {
        text: c => {
            return {
                render: r => r[c.attribute].replaceAll("\n", "<br>"),
                type: 'contentarea'
            }
        },
        default: c => {
            return {
                header: c.attribute,
                render: r => r[c.attribute],
                type: c.type,
                copy: r => r[c.attribute],
                paste: (r, v) => r[c.attribute] = v
            }
        }
    }
    
    #copyData;
    
    constructor (options, ...args) {
        super(options, ...args)
        this.columns = this.columns.map(column => {
            return Object.assign(...[
                {},
                result(this.constructor.typeRegistry, 'default', column),
                result(this.constructor.typeRegistry, column.type, column),
                except(column, 'type')
            ])
        })
        
        this.addEventListenerFor(`${this.localName}-cell`, 'mousedown', e => {
            if (e.button == 0) {
                this.clearSelectedCells()
                this.activateCellSelection(e.delegateTarget, e)
            }
        })
        
        this.addEventListenerFor(`${this.localName}-cell`, 'dblclick', e => {
            this.activateCell(e.delegateTarget);
        })
        
        this.addEventListenerFor(`${this.localName}-cell`, 'contextmenu', e => {
            this.activateContextMenu(e.delegateTarget)
            if (!e.delegateTarget.classList.contains('selected')) {
                this.clearSelectedCells()
                this.selectCells([e.delegateTarget])
            }
            e.preventDefault()
        })
        
        this.addEventListenerFor(`${this.localName}-cell`, 'keydown', e => {
            if (["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) {
                e.preventDefault()
                this.focusAdjacentCell(e.delegateTarget, e.key.replace('Arrow', '').toLowerCase())
            } else if (e.key.match(/^[a-z0-9\-\_\$]$/i) && [e.metaKey,e.ctrlKey,e.altKey].every(x => x == false)) {
                this.activateCell(e.delegateTarget, 'all');
            } else if (e.key == "Enter" && e.delegateTarget == this.getRootNode().activeElement) {
                e.preventDefault();
                this.activateCell(e.delegateTarget);
            } else if (e.key == "Escape") {
                this.clearSelectedCells('')
            }
        })
    }
    
    initialize (...args) {
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
        return super.initialize(...args)
    }
    
    renderHeader () {
        const row = super.renderHeader()
        row.row = 1
        return row
    }
    
    renderHeaderCell (column, index) {
        const cell = super.renderHeaderCell(column, index)
        cell.classList.add(`column-${index}`, `row-1`)
        cell.row = 1
        cell.column = index
        return cell
    }
    
    renderRow (item, index) {
        const row = super.renderRow(item, index)
        row.classList.add(`row-${index}`)
        row.row = index
        return row
    }
    
    renderCell (item, column, colIndex, rowIndex) {
        const cell = super.renderCell(item, column, colIndex, rowIndex)
        if (column.frozen) {
            cell.classList.add('frozen')
        }
        cell.render = () => {
            content(cell, result(column, 'render', item, column, colIndex))
        }
        cell.input = () => this.renderInputCell(item, column, cell.column, cell.row)
        cell.copy = () => column.copy(item)
        cell.paste = (v) => column.paste(item, v)
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
            e.preventDefault()
            mouseOver({ target: currentCell })
        }
        if (header) {
            mouseOver({target: cell})
        }
        
        this.getRootNode().addEventListener('mouseup', mouseUp, {once: true})
        this.addEventListener('mouseover', mouseOver)
    }
    outlineCells (cells) {
        if (!Array.isArray(cells)) { cells = Array.from(cells) }
        const outline = createElement(`${this.localName}-outline`, {
            style: {
                gridArea: [
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
    activateCell (cell, focusType='end') {
        const inputCell = cell.input()
        inputCell.style.setProperty('--remaining-width', this.offsetWidth - cell.offsetLeft + "px")
        inputCell.style.setProperty('--remaining-height', this.offsetHeight - cell.offsetTop + "px")
        insertAfter(cell, inputCell)
        cell.tabIndex = -1
        inputCell.beforeRemove = () => {
            cell.tabIndex = 0
            cell.render()
        }
        
        const focusTarget = inputCell.querySelector('input, textarea, select, [contenteditable]')
        if (focusTarget) {
            if (focusType == 'end') {
                placeCaretAtEnd(focusTarget)
            } else if (focusType == 'all') {
                focusTarget.focus()
                if (focusTarget.select) {
                    focusTarget.select()
                }
            }
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
            inputCell.remove()
        })
        inputCell.addEventListener('keydown', e => {
            if (e.key == "Enter" && [e.metaKey,e.ctrlKey,e.altKey,e.shiftKey].every(x => x == false)) {
                this.focusAdjacentCell(cell, 'down')
            }
        })
        return inputCell
    }
    
    renderInputCell (item, column, colIndex, rowIndex) {
        const cell = createElement(`${this.localName}-input`, {
            style: {
                gridColumn: colIndex,
                gridRow: rowIndex
            },
            content: {
                tag: 'komp-spreadsheet-input-wrapper',
                content: Input.create(column.type, Object.assign({
                    record: item
                }, except(column, 'header', 'type')))
            }
        })
        if (column.frozen) {
            cell.classList.add('frozen')
        }
        return cell
    }
    
    /* ---------------------
        Context Menu
    --------------------- */
    activateContextMenu (cell) {
        const menu = this.renderContextMenu(cell)
        const floater = new Floater({
            content: menu,
            anchor: cell,
            shift: true,
            flip: true,
            placement: 'right-end',
            autoPlacement: false,
            removeOnBlur: true
        })
        this.append(floater)
        menu.querySelector('button')?.focus()
        floater.addEventListener('focusout', e => {
            // floater.remove()
        })
    }
    
    renderContextMenu (cell) {
        const canPaste = window.navigator.clipboard.readText != undefined || this.copyData
        return createElement('komp-spreadsheet-context-menu', {
            content: [
                listenerElement('button', {
                    content: 'Copy'
                }, e => {
                    this.copyCells()
                }),
                listenerElement('button', {
                    content: 'Paste',
                    disabled: !canPaste
                }, async e => {
                    if (window.navigator.clipboard.readText == undefined) {
                        this.pasteData(this.copyData)
                    } else {
                        this.pasteData(await window.navigator.clipboard.readText())
                    }
                })
            ]
        })
    }
    
    /* -----------------
        Copy / Paste
    ----------------- */
    copyCells () {
        const selectedCells = this.selectedCells()
        const data = Object.values(groupBy(Array.from(selectedCells), 'row')).map(row => row.map(cell => cell.copy()).join("\t")).join("\n")
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
                const dataColIndex = colIndex % dataMatrix[dataRowIndex].length
                cell.paste(dataMatrix[dataRowIndex][dataColIndex])
                cell.render()
            })
        })
        this.querySelector(`${this.localName}-outline.copy`).remove()
    }

    static style = `
        komp-spreadsheet {
            --select-color: #1a73e8;
            --handle-size: 10px;
            position: relative;
            overflow: scroll;
            scroll-behavior: smooth;
            scroll-snap-type: both mandatory;
            overscroll-behavior: none;
        }

        komp-spreadsheet-cell {
            cursor: cell;
            user-select: none;
            scroll-snap-stop: always;
            scroll-snap-align: start;
        }
        komp-spreadsheet-cell:focus {
            box-shadow: inset 0 0 0 1px var(--select-color), 0 0 0 1px var(--select-color);
            outline: none;
        }
        komp-spreadsheet-cell.frozen {
            position: sticky;
            left: 0;
        }
        komp-spreadsheet-cell.selected,
        komp-spreadsheet-cell.selecting {
            box-shadow: inset 0 0 0 999px rgba(26, 115, 232, 0.1);
            &:focus {
                box-shadow: inset 0 0 0 999px rgba(26, 115, 232, 0.1), inset 0 0 0 1px var(--select-color), 0 0 0 1px var(--select-color);
            }
        }
        
        komp-spreadsheet-header > * {
            position: sticky;
            top: 0;
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
            box-shadow: inset 0 0 0 1px var(--select-color), 0 0 0 1px var(--select-color), 0 0 0 3px rgba(26, 115, 232, 0.5);
        }
        komp-spreadsheet-input-wrapper > * {
            flex: 1 0 auto;
        }
        komp-spreadsheet-input input,
        komp-spreadsheet-input textarea,
        komp-spreadsheet-input select,
        komp-spreadsheet-input komp-content-area {
            background: none;
            width: auto;
            min-height: 100%;
            min-width: 100%;
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
        komp-spreadsheet-context-menu > button:focus {
            background: rgba(26, 115, 232, 0.2);
        }
        komp-spreadsheet-context-menu > button:hover {
            background: var(--select-color);
            color: white;
        }
        
        komp-spreadsheet-outline {
            pointer-events: none;
            border: 1px solid var(--select-color);
        }
        komp-spreadsheet-outline.copy {
            border: 2px dashed var(--select-color);
        }
        
        
        komp-spreadsheet-cell               { z-index: 1; }
        komp-spreadsheet-cell:focus         { z-index: 2; }
        komp-spreadsheet-input              { z-index: 3; }
        
        komp-spreadsheet-header > *         { z-index: 10; }
        
        komp-spreadsheet-resize-handle      { z-index: 30; }
        komp-spreadsheet-reorder-handle     { z-index: 40; }
        komp-spreadsheet-outline            { z-index: 45; }
        
        komp-spreadsheet-cell.frozen        { z-index: 50; }
        komp-spreadsheet-drag-indicator     { z-index: 60; }
        komp-floater                        { z-index: 70; }
    `
}

window.customElements.define(Spreadsheet.tagName, Spreadsheet);