/*

Description
----
Render DataTable with editable cells

Syntax
----
JS
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
    columns: {
        name: {order: true},
        team: {},
        ops: [
            r => r.ops.toLocaleString().replace(/^0/, ''),
            {
                header: 'OPS',
                order: true,
            }
        ]
    }
})
```

Example
----
<div class="pad-2x"></div>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelector('div').append(new Spreadsheet({
            data: [
              {
                name: "Marcus Semien",
                team: "Texas Rangers",
                age: 32,
                war: 7.4,
                bats: "R"
              },
              {
                name: "Corey Seager",
                team: "Texas Rangers",
                age: 29,
                war: 6.9,
                bats: "L"
              },
              {
                name: "Adolis García",
                team: "Texas Rangers",
                age: 30,
                war: 4.2,
                bats: "R"
              },
              {
                name: "Nathan Eovaldi",
                team: "Texas Rangers",
                age: 33,
                war: 3.1,
                bats: "R"
              },
              {
                name: "Dane Dunning",
                team: "Texas Rangers",
                age: 28,
                war: 3,
                bats: "R"
              },
              {
                name: "Jonah Heim",
                team: "Texas Rangers",
                age: 28,
                war: 2.9,
                bats: "S"
              },
              {
                name: "Leody Taveras",
                team: "Texas Rangers",
                age: 24,
                war: 2.7,
                bats: "S"
              },
              {
                name: "Nathaniel Lowe",
                team: "Texas Rangers",
                age: 27,
                war: 2.6,
                bats: "L"
              },
              {
                name: "Josh Jung",
                team: "Texas Rangers",
                age: 25,
                war: 2.4,
                bats: "R"
              },
              {
                name: "Mitch Garver",
                team: "Texas Rangers",
                age: 32,
                war: 2.1,
                bats: "R"
              },
              {
                name: "Jon Gray",
                team: "Texas Rangers",
                age: 31,
                war: 2.1,
                bats: "R"
              }
            ],
            columns: {
                name: {order: true},
                team: {},
                age: {},
                bats: {},
                war: {}
            }
        }))
    });
</script>

Methods
----
### `render()`
Emptys contents and renders rows

Options
----
data: 
    types: Array
    description: Each item of the array generates a row by passing the item to each render method of the defined columns
    
columns:
    types: Object, Array
    description: See Column Options

Column Options
----
Columns can be modeled as an Array or an Object. If Object, key will be used as an id on the column model.

```
[function]
[ {render: function, ...options} ]
[ [function, {...options}] ]
{ id1: function }
{ id1: [function, {...options}] }
{ id1: {render: function, ...options} }
```

render: 
    types: Function
    arguments: item:Object, columnModel:Object, table:Spreadsheet
    description: Render method for the cell
    
header:
    types: Function, String
    arguments: columnModel:Object, table:Spreadsheet
    description: Render method for the header

width:
    types: String
    description: Valid value for [css grid template](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns) (i.e. px, percent, min-content...)

*/

import { createElement, listenerElement, remove, addEventListenerFor, getBoundingClientRect, insertAfter, insertBefore } from 'dolla';
import { indexOfNode, closest, result, groupBy } from '../support.js';

import DataTable from './data-table.js';
import KompElement from './element.js';
import Floater from './floater.js';
import { handleIcon } from '../icons.js'

export default class Spreadsheet extends DataTable {
    static tagName = 'komp-spreadsheet'
    
    constructor (...args) {
        super(...args)
        
        this.cellTag = `${this.constructor.tagName}-cell`
        this.rowTag = `${this.constructor.tagName}-row`
        this.menuTag = `${this.constructor.tagName}-menu`
        this.dragHandleTag = `${this.constructor.tagName}-drag-handle`
        this.dragBoxTag = `${this.constructor.tagName}-drag-box`
        
        addEventListenerFor(this, this.cellTag, 'mousedown', e => {
            if (e.button == 2) {
                if (e.delegateTarget.classList.contains('selected')) {
                    e.preventDefault() 
                } else {
                    this.deselectCells()
                }
                return 
            }
            if (!e.metaKey && !e.shiftKey) {
                this.deselectCells();
            }
            this.initializeCellSelection(e.delegateTarget)
        })
        addEventListenerFor(this, this.cellTag, 'mouseover', e => {
            this.showDragHandleFor(e.delegateTarget)
        })
        addEventListenerFor(this, this.cellTag, 'keydown', e => {
            if (["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) {
                e.preventDefault()
                this.changeFocusByDirection(e.key)
            }
            if (e.key.toLowerCase() == "c" && (e.metaKey || e.cntlKey)) {
                this.copyCell(e.delegateTarget)
            }
            if (e.key.toLowerCase() == "v" && (e.metaKey || e.cntlKey)) {
                this.pasting = e.delegateTarget;
            }
        })
        addEventListenerFor(this, this.cellTag, 'keyup', e => {
            if (e.key == "Enter" && e.delegateTarget == this.getRootNode().activeElement) {
                this.activateCellInput(e.delegateTarget);
            }
        })
        addEventListenerFor(this, this.cellTag, 'dblclick', e => {
            this.activateCellInput(e.delegateTarget);
        })
        
        this.addEventListener('mouseleave', e => {
            this.querySelectorAll(`${this.tagName}-handle`).forEach(x => x.remove());
        })
        this.addEventListener('keyup', e => {
            if (e.key == "Escape") {
                this.deselectCells(true)
            }
        })
        this.addEventListener('contextmenu', e => {
            e.preventDefault();
            const cell = closest(e.target, this.cellTag)
            if (cell) {
                this.renderContextMenu(cell)
            }
        })
    }
    
    connected () {
        if (!this.getRootNode()) { return }
        this.manageEventListenerFor(this.getRootNode(), 'paste', e => {
            if (this.pasting) {
                this.pasteCells(e.clipboardData.getData("text/plain"))
                delete this.pasting
            }
        })
    }
    
    changeFocusByDirection(direction, currentCell) {
        currentCell = currentCell || this.querySelector(`${this.cellTag}:focus, ${this.cellTag}:focus-within`)
        if (currentCell) {
            let targetCell;
            switch (direction) {
                case 'ArrowDown': targetCell = this.querySelector(`.row-${currentCell.rowIndex + 1}.col-${currentCell.colIndex}`); break;
                case 'ArrowUp': targetCell = this.querySelector(`.row-${currentCell.rowIndex - 1}.col-${currentCell.colIndex}`); break;
                case 'ArrowLeft': targetCell = this.querySelector(`.row-${currentCell.rowIndex}.col-${currentCell.colIndex - 1}`); break;
                case 'ArrowRight': targetCell = this.querySelector(`.row-${currentCell.rowIndex}.col-${currentCell.colIndex + 1}`); break;
            }
            if (targetCell) { targetCell.focus() }
        }
    }
    
    activateCellInput (cell) {
        this.deselectCells(true);
        const input = result(cell.columnModel, 'input', cell.record)
        if (input) {
            const inputField = createElement(`${this.tagName}-input`, {
                content: input,
                style: {
                    gridArea: [cell.rowIndex, cell.colIndex, cell.rowIndex, cell.colIndex].map(i => `body ${i}`).join(" / ")
                }
            })
            insertAfter(cell, inputField)
            inputField.querySelector('input, textarea, button').focus()
            cell.tabIndex = -1

            inputField.beforeRemove = () => {
                cell.tabIndex = 0
                cell.render()
            }
            inputField.addEventListener('focusout', e => {
                inputField.beforeRemove()
                inputField.remove()
            })
            inputField.addEventListener('keyup', e => {
                if (e.key == "Enter" && [e.metaKey,e.ctrlKey,e.altKey,e.shiftKey].every(x => x == false)) {
                    this.changeFocusByDirection('ArrowDown', cell);
                }
            })
        }
    }

    initColumn (key, options, ...args) {
        const model = super.initColumn(key, options, ...args)
        model.input = options.input || this.defaultInput(key, options)
        model.copy = record => record[key]
        model.paste = (record, value) => record[key] = value
        return model
    }
    
    defaultInput (key) {
        return r => {
            const input = createElement('input', {
                value: r[key],
            })
            input.addEventListener('change', e => {
                r[key] = input.value
            })
            return input
        }
    }
    
    renderCell (record, column, ...args) {
        const el = super.renderCell(record, column, ...args)
        el.record = record
        el.tabIndex = 0
        el.columnModel = column
        return el
    }
    
    renderContextMenu(cell) {
        if (this.contextMenu && this.contextMenu.anchor == cell) {
            return
        } else if (this.contextMenu) {
            this.contextMenu.hide()
        }
        this.contextMenu = new Floater({
            anchor: cell,
            placement: 'right-end',
            shift: true,
            flip: true,
            autoPlacement: false,
            removeOnBlur: true,
            class: `${this.constructor.tagName}-menu`,
            content: [
                listenerElement('button', {
                    content: 'Copy'
                }, e => {
                    this.copyCell(cell)
                    this.contextMenu.hide()
                }),
                listenerElement('button', {
                    content: 'Paste',
                    disabled: window.navigator.clipboard.readText == undefined
                }, async e => {
                    if (window.navigator.clipboard.readText) {
                        this.pasteCells(await window.navigator.clipboard.readText())
                    }
                    this.contextMenu.hide()
                })
            ]
        })
        this.append(this.contextMenu)
    }
    
    // -----------------
    // Column / Row Dragging
    // -----------------
    initializeAxisDrag (e) {
        const axis = e.currentTarget.classList.contains('row') ? 'row' : 'col'
        const handle = axis == "row" ? this.rowDragHandle : this.colDragHandle
        const axixIndex = axis == "row" ? 'rowIndex' : 'colIndex'
        let lastCell;
        
        e.dataTransfer.setDragImage(createElement(), 0, 0);
        this.deselectCells(true)
        
        if (axis == "col") {
            this.dragStartIndex = handle.colIndex
            handle.style.width = handle.offsetWidth + "px"
            handle.style.left = e.x - (handle.offsetWidth / 2) - this.offsetLeft + "px"
            this.querySelectorAll(`${this.cellTag}.col-${handle.colIndex}`).forEach(el => el.classList.add('selecting'));
        } else {
            this.dragStartIndex = handle.rowIndex
            handle.style.height = handle.offsetHeight + "px"
            handle.style.top = e.y - (handle.offsetHeight / 2) - this.offsetTop + "px"
            this.querySelectorAll(`${this.cellTag}.row-${handle.rowIndex}`).forEach(el => el.classList.add('selecting'));
        }
        handle.style.gridArea = null
        this.classList.add('dragging')
        this.dragIndicator = createElement(`${this.constructor.tagName}-drag-indicator`, {
            class: axis,
            style: {
                [axis == "col" ? "gridRow" : "gridColumn"]: 'handle / -1'
            }
        })
        this.append(this.dragIndicator)
        
        let dragOver = e => {
            e.preventDefault()
            const cell = closest(e.target, `${this.cellTag}, ${this.dragHandleTag}`)
            lastCell = cell;
            if (axis == "col") {
                let x = e.x - (handle.offsetWidth / 2) - this.offsetLeft
                x = x < 0 ? 0 : x
                x = x > this.offsetWidth - handle.offsetWidth ? this.offsetWidth - handle.offsetWidth : x
                handle.style.left = x + "px"
            
                if (cell) {
                    this.dragIndicator.style.gridColumn = `body ${cell.colIndex} / body ${cell.colIndex}`
                    this.dragIndicator.classList.toggle('end', cell.colIndex > this.dragStartIndex)
                }
            } else {
                let y = e.y - (handle.offsetHeight / 2) - this.offsetTop
                y = y < 0 ? 0 : y
                y = y > this.offsetHeight - handle.offsetHeight ? this.offsetHeight - handle.offsetHeight : y
                handle.style.top = y + "px"
            
                if (cell) {
                    this.dragIndicator.style.gridRow = `body ${cell.rowIndex} / body ${cell.rowIndex}`
                    this.dragIndicator.classList.toggle('end', cell.rowIndex > this.dragStartIndex)
                }
            }
        }
        dragOver = dragOver.bind(this)
        
        let drop = e => {
            const cell = closest(e.target, `${this.cellTag}, ${this.dragHandleTag}`) || lastCell
            lastCell = cell;
            if (cell) {
                const index = axis == "col" ? "colIndex" : "rowIndex"
                const gridAxis = axis == "col" ? "gridColumn" : "gridRow"
                const newIndex = cell[index]
                const oldIndex = this.dragStartIndex
                const delta = newIndex > oldIndex ? -1 : 1;
                this.querySelectorAll(this.cellTag).forEach(cell => {
                    cell.classList.remove(`${axis}-${cell[index]}`)
                    if (cell[index] == oldIndex) {
                        cell[index] = newIndex
                        const anchorIndex = newIndex + Math.max(delta, 0)
                        const method = delta == -1 ? insertAfter : insertBefore
                        if (axis == "col") {
                            method(cell.parentElement.querySelector(`${this.cellTag}.col-${anchorIndex}`), cell)
                        } else {
                            const anchor = this.querySelector(`${this.cellTag}.row-${anchorIndex}.col-${cell.colIndex}`).parentElement
                            method(anchor, cell.parentElement)
                        }
                    } else if (cell[index] == newIndex) {
                        cell[index] += delta
                    } else if (Math.min(oldIndex, newIndex) < cell[index] && cell[index] < Math.max(oldIndex, newIndex)) {
                        cell[index] += delta
                    }
                    if (cell.classList.contains('komp-header') && axis == "row") {
                        cell.classList.add(`${axis}-${cell[index]}`)
                    } else {
                        cell.style[`${gridAxis}Start`] = `body ${cell[index]}`
                        cell.style[`${gridAxis}End`] = `body ${cell[index]}`
                        cell.classList.add(`${axis}-${cell[index]}`)
                    }
                    
                })
            }
            
            this.querySelectorAll(`${this.cellTag}.selecting`).forEach(el => {
                el.classList.remove('selecting')
                el.classList.add('selected')
            })
        }
        drop = drop.bind(this)
        
        let dragEnd = (e) => {
            const cell = lastCell || this.querySelector(`${this.cellTag}.selecting, ${this.cellTag}.selected`)
            this.dragIndicator.remove()
            delete this.dragIndicator

            this.classList.remove('dragging')
            handle.style.left = ''
            handle.style.width = ''
            handle.style.top = ''
            handle.style.height = ''
            this.showDragHandleFor(cell)
            this.querySelectorAll(`${this.cellTag}.selecting`).forEach(el => {
                el.classList.remove('selecting')
            })
            
            this.removeEventListener('dragover', dragOver)
            this.removeEventListener('drop', drop)
            this.removeEventListener('dragend', dragEnd)
        }
        dragEnd = dragEnd.bind(this)
        
        this.addEventListener('dragover', dragOver)
        this.addEventListener('drop', drop)
        this.addEventListener('dragend', dragEnd)
    }
    
    showDragHandleFor (cell) {
        if (!this.colDragHandle) {
            this.colDragHandle = createElement(this.dragHandleTag, {
                class: 'col',
                draggable: true,
                content: {
                    content: handleIcon()
                }
            })
            this.manageEventListenerFor(this.colDragHandle, 'dragstart', this.initializeAxisDrag.bind(this))
        }
        if (!this.rowDragHandle) {
            this.rowDragHandle = createElement(this.dragHandleTag, {
                class: 'row',
                draggable: true,
                content: {
                    content: handleIcon()
                }
            })
            this.manageEventListenerFor(this.rowDragHandle, 'dragstart', this.initializeAxisDrag.bind(this))
        }
        if (!this.classList.contains('dragging')) {
            this.colDragHandle.rowIndex = 1
            this.colDragHandle.colIndex = cell.colIndex
            this.colDragHandle.style.gridArea = ['handle', `body ${cell.colIndex}`, 'handle', `body ${cell.colIndex}`].join(" / ")
            if (cell.classList.contains('col-header')) {
                this.colDragHandle.remove();
            } else {
                this.append(this.colDragHandle);
            }

            this.rowDragHandle.rowIndex = cell.rowIndex
            this.rowDragHandle.colIndex = 1
            this.rowDragHandle.style.gridArea = [`body ${cell.rowIndex}`, 'handle', `body ${cell.rowIndex}`, 'handle'].join(" / ")
            if (cell.classList.contains('row-header')) {
                this.rowDragHandle.remove();
            } else {
                this.append(this.rowDragHandle);
            }
        }
    }
    
    // -----------------
    // Cell Selection
    // -----------------
    initializeCellSelection (startCell) {
        if (!this.getRootNode()) { return }
        
        const mouseOver = e => {
            const overCell = closest(e.target, this.cellTag)
            if (overCell) {
                this.querySelectorAll(`${this.cellTag}.selecting`).forEach(el => el.classList.remove('selecting'))
                const rowsMinMax = [startCell.rowIndex, overCell.rowIndex]
                const colsMinMax = [startCell.colIndex, overCell.colIndex]
                for (let rowIndex = Math.min(...rowsMinMax); rowIndex <= Math.max(...rowsMinMax); rowIndex++) {
                    for (let colIndex = Math.min(...colsMinMax); colIndex <= Math.max(...colsMinMax); colIndex++) {
                        const target = this.querySelector(`.row-${rowIndex}.col-${colIndex}`)
                        if (target) {
                            target.classList.add('selecting')
                        }
                    }
                }
            }
        }
        
        const mouseUp = e => {
            const endCell = closest(e.target, this.cellTag)
            if (endCell && endCell != startCell) {
                this.querySelectorAll(`${this.cellTag}.selecting`).forEach(el => {
                    el.classList.remove('selecting')
                    el.classList.add('selected')
                })
                this.append(createElement(`${this.tagName}-selection`, {
                    style: {
                        gridArea: [
                            Math.min(endCell.rowIndex, startCell.rowIndex),
                            Math.min(endCell.colIndex, startCell.colIndex),
                            Math.max(endCell.rowIndex, startCell.rowIndex) + 1,
                            Math.max(endCell.colIndex, startCell.colIndex) + 1
                        ].map(i => `body ${i}`).join(" / ")
                    }
                }))
            } else {
                this.deselectCells()
            }
            this.removeEventListener('mouseover', mouseOver)
        }
        
        this.getRootNode().addEventListener('mouseup', mouseUp, {once: true})
        this.addEventListener('mouseover', mouseOver)
    }
    
    deselectCells (includeCopy=false) {
        this.querySelectorAll(`${this.cellTag}.selected`).forEach(el => el.classList.remove('selected'));
        this.querySelectorAll(`${this.tagName}-selection`).forEach(el => el.remove());
        this.querySelectorAll(`${this.tagName}-input`).forEach(el => {
            el.beforeRemove()
            el.remove()
        });
        if (includeCopy) {
            this.querySelectorAll(`${this.tagName}-copy-selection`).forEach(el => el.remove());
        }
    }
    
    selectedCells () {
        const selectedCells = this.querySelectorAll(`${this.cellTag}.selected, ${this.cellTag}:focus, ${this.cellTag}:focus-within`)
        if (selectedCells.length > 0) {
            const rows = groupBy(selectedCells, 'rowIndex')
            return Object.keys(rows).map(rowIndex => rows[rowIndex])
        } else {
            return []
        }
    }
    
    // -----------------
    // Copy / Paste
    // -----------------
    copyCell(cell) {
        const selectedCells = this.selectedCells()
        const data = this.selectedCells().map(row => row.map(cell => {
            return cell.columnModel.copy(cell.record)
        }).join("\t")).join("\n")
        window.navigator.clipboard.writeText(data)
        
        this.append(createElement(`${this.tagName}-copy-selection`, {
            style: {
                gridArea: [
                    Math.min(...selectedCells.flat().map(x => x.rowIndex)),
                    Math.min(...selectedCells.flat().map(x => x.colIndex)),
                    Math.max(...selectedCells.flat().map(x => x.rowIndex)) + 1,
                    Math.max(...selectedCells.flat().map(x => x.colIndex)) + 1
                ].map(i => `body ${i}`).join(" / ")
            }
        }))
    }
    
    pasteCells(data) {
        const selectedCells = this.selectedCells()
        const pasteMatrix = data.split("\n").map(r => r.split("\t"))
        let rowIndex = 0
        selectedCells.forEach(row => {
            rowIndex = rowIndex == pasteMatrix.length ? 0 : rowIndex
            let colIndex = 0
            row.forEach(cell => {
                colIndex = colIndex == pasteMatrix[rowIndex].length ? 0 : colIndex
                this.pasteCell(cell, pasteMatrix[rowIndex][colIndex])
                colIndex++
            })
            rowIndex++
        })

        this.querySelectorAll(`${this.tagName}-copy-selection`).forEach(el => el.remove());
    }
    
    pasteCell(cell, value) {
        cell.columnModel.paste(cell.record, value)
        cell.render()
    }
    
    static style = function() { return `
        ${this.tagName} {
            --select-color: #1a73e8;
            --handle-size: 20px;
            position: relative;
        }
        ${this.tagName}-cell {
            cursor: cell;
            user-select: none;
            position: relative;
            z-index: 1;
        }
        ${this.tagName}-cell:focus {
            box-shadow: inset 0 0 0 1px var(--select-color), 0 0 0 1px var(--select-color);
            z-index: 2;
            outline: none;
        }
        ${this.tagName}-cell.selecting,
        ${this.tagName}-cell.selected {
            box-shadow: inset 0 0 0 999px rgba(26, 115, 232, 0.1);
        }
        
        ${this.tagName}-selection {
            pointer-events: none;
            border: 1px solid var(--select-color);
            z-index: 3
        }
        ${this.tagName}-copy-selection {
            pointer-events: none;
            border: 2px dashed var(--select-color);
            z-index: 3
        }
        
        ${this.tagName}-input {
            z-index: 3;
        }
        ${this.tagName}-input input,
        ${this.tagName}-input textarea {
            width: 100%;
            height: 100%;
        }
        
        .${this.tagName}-menu {
            border-radius: 0.35em;
            background: white;
            padding: 0.5em;
            font-size: 0.8em;
            z-index: 100;
            box-shadow: 0 2px 12px 2px rgba(0,0,0, 0.2), 0 1px 2px 1px rgba(0,0,0, 0.3);
        }
        .${this.tagName}-menu > button {
            display: block;
            outline: none;
            appearance: none;
            border: none;
            background:none;
            padding: 0.2em 0.5em;
            border-radius: 0.25em;
        }
        .${this.tagName}-menu > button:disabled {
            opacity: 0.5;
        }
        .${this.tagName}-menu > button:disabled:hover {
            background: white;
            color: inherit;
        }
        .${this.tagName}-menu > button:hover {
            background: var(--select-color);
            color: white;
        }
        ${this.tagName} ${this.tagName}-row:first-child ${this.tagName}-cell:before {
            content: "";
            position: absolute;
            bottom: 100%;
            left: 0;
            height: var(--handle-size);
            width: 100%;
        }
        ${this.tagName} ${this.tagName}-cell:first-child:after {
            content: "";
            position: absolute;
            right: 100%;
            top: 0;
            width: var(--handle-size);
            height: 100%;
        }

        ${this.tagName}-drag-handle {
            position: relative;
            z-index: 5;
        }
        ${this.tagName}.dragging ${this.tagName}-cell {
            cursor: grabbing;
        }
        ${this.tagName}.dragging ${this.tagName}-drag-handle {
            position: absolute;
            background: rgba(0,0,0, 0.2);
            top: 0;
            left: 0;
            height: 100%;
            pointer-events: none;
        }
        ${this.tagName}.dragging ${this.tagName}-drag-handle.row {
            width: 100%;
        }
        ${this.tagName}-drag-handle > * {
            position: absolute;
            bottom: 100%;
            width: 100%;
            height: var(--handles-size);
            background: white;
            display: flex;
            justify-content: center;
            align-items: center;
            border-top-left-radius: 0.3em;
            border-top-right-radius: 0.3em;
        }
        ${this.tagName}-drag-handle.row > * {
            height: 100%;
            width: var(--handle-size);
            bottom: auto;
            right: 100%;
            border-top-right-radius: 0;
            border-top-left-radius: 0.3em;
            border-bottom-left-radius: 0.3em;
        }
        ${this.tagName}-drag-handle svg {
            cursor: grab;
        }
        ${this.tagName}-drag-handle.row svg {
            transform: rotate(90deg);
        }
        ${this.tagName}-drag-indicator {
            pointer-events: none;
            position: relative;
            z-index: 3;
            border-width: 3px;
            border-color: var(--select-color);
            border-style: none;
            border-left-style: solid;
            margin: 0 -2px;
        }
        ${this.tagName}-drag-indicator.end {
            border-left-style: none;
            border-right-style: solid;
        }
        ${this.tagName}-drag-indicator.row {
            border-style: none;
            border-top-style: solid;
            margin: -2px 0;
        }
        ${this.tagName}-drag-indicator.row.end {
            border-top-style: none;
            border-bottom-style: solid;
        }
    `}

}

window.customElements.define(Spreadsheet.tagName, Spreadsheet);