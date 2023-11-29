/*

Description
----
Render DataTable with editable cells

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
<div class="pad-2x min-height-500-px"></div>
<script type="application/json" src="/texas-rangers-roster.json" id="texas-rangers-roster"></script>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        
        fetch("/texas-rangers-roster.json").then(response => {
            response.json().then(data => {
                document.querySelector('div').append(new Spreadsheet({
                    class: 'height-90-vh',
                    data: data,
                    columns: {
                        "Name": {
                            frozen: true,
                            render: r => {
                                const el = document.createElement("a")
                                el.append(r.Name);
                                el.setAttribute('href', r.URL)
                                return el
                            }
                        },
                        "TEAM": {},
                        "POS": {},
                        "GP": {},
                        "RBI": {},
                        "AVG": {
                            class: 'text-right',
                            header: {
                                class: 'text-right'
                            }
                        },
                        "OPS": {},
                        "WAR": {},
                        "TB": {},
                        "BB": {},
                        "SO": {},
                        "SB": {},
                        "OBP": {},
                        "SLG": {}
                    }
                }))
            })
        })
        
    });
</script>


Options
----
reorder:
    types: Boolean, String
    description: Enable ability to reoder rows and columns. Pass "rows" or "cols" to reorder just one axis.
    default: true
resize:
    types: Boolean, String
    description: Enable ability to resize rows and columns. Pass "rows" or "cols" to reorder just one axis.
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
- [x] Scroll bars that are sticky to columns
- [x] Frozen Axis
- [x] Resizeable Axis
- [x] Editable Headers
- [x] Reordering Columns
- [x] Events for column model changes (width, header, order...)
- [x] Shift/Cntl Click cells to add to selection
- [x] Paste from multi cell on single cell
- [x] Autosize Input
- [x] Update Docs
- [x] Clicking Column Header should select whole column
- [x] Support Escape out of edit
- [ ] Support resizing multiple rows/cols
- [ ] Default row height to 1lh (need to include padding as an option for spreadsheet, because it's needed for calc), maybe read from css var
- [ ] changing cell needs to scroll into view in upper direction

BUGS
----
- [ ] Dragging column outside container does weird things to reorder-handle shadow
- [ ] Dragging column over frozen column does not scroll panel
- [ ] Selecting frozen cells renderes selection box underneath frozen cells.
    Needs to be under for when selection box is for non-frozen cells
- [ ] Handles render over frozen cells
- [ ] Context menu is behind frozen cells
- [ ] Right click copy/paste no worky in firefox
- [ ] Copy action not deselecting previous copies
- [ ] Resizing Header row errors
- [ ] Moving sized column needs to update grid template or else size doesn't come with it
- [ ] New Lines for Default Input

*/

import { createElement, listenerElement, remove, addEventListenerFor, getBoundingClientRect, insertAfter, insertBefore, content, css } from 'dolla';
import { indexOfNode, closest, result, groupBy, placeCaretAtEnd, uniq } from '../support.js';

import DataTable from './data-table.js';
import KompElement from './element.js';
import Floater from './floater.js';
import { handleIcon } from '../icons.js'

export default class Spreadsheet extends DataTable {
    static tagName = 'komp-spreadsheet'
    
    static assignableAttributes = {
        reorder: ['col', 'row'],
        resize: ['col', 'row']
    }
    
    constructor (...args) {
        super(...args)
        
        if (this.reorder === true) {
            this.reorder = ['col', 'row']
        } else if (this.reorder === false) {
            this.reorder = new Array()
        } else if (typeof this.reorder === "string") {
            this.reorder = [this.reorder]
        }
        
        if (this.resize === true) {
            this.resize = ['col', 'row']
        } else if (this.resize === false) {
            this.resize = []
        } else if (typeof this.resize === "string") {
            this.resize = [this.resize]
        }
        
        this.cellTag = `${this.constructor.tagName}-cell`
        this.rowTag = `${this.constructor.tagName}-row`
        this.menuTag = `${this.constructor.tagName}-menu`
        this.moveHandleTag = `${this.constructor.tagName}-move-handle`
        this.resizeHandleTag = `${this.constructor.tagName}-resize-handle`
        this.dragBoxTag = `${this.constructor.tagName}-drag-box`
        
        this.addEventListenerFor(this.cellTag, 'mousedown', e => {
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
            this.initializeCellSelection(e.delegateTarget, e)
        })
        this.addEventListenerFor(this.cellTag, 'mouseover', e => {
            this.showMoveHandleFor(e.delegateTarget)
            this.showResizeHandleFor(e.delegateTarget)
        })
        this.addEventListenerFor(this.cellTag, 'keydown', e => {
            if (e.delegateTarget.classList.contains('input')) {
                if (e.key == "Escape") {
                    e.delegateTarget.remove()
                    e.delegateTarget.originalCell.focus()
                }
                this.deselectCells(true)
                return
            }
            
            if (["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) {
                e.preventDefault()
                this.changeFocusByDirection(e.key)
            } else if (!["Enter", "Shift", "Meta", "Control", "Alt", "Escape"].includes(e.key)) {
                this.activateCellInput(e.delegateTarget, e);
            } else if (e.key == "Enter" && e.delegateTarget == this.getRootNode().activeElement) {
                e.preventDefault()
                this.activateCellInput(e.delegateTarget, e);
            }
        })
        this.addEventListenerFor(this.cellTag, 'dblclick', e => {
            this.activateCellInput(e.delegateTarget, e);
        })
        
        this.addEventListener('mouseleave', e => {
            this.querySelectorAll(`${this.tagName}-handle`).forEach(x => x.remove());
        })
        this.addEventListener('contextmenu', e => {
            e.preventDefault();
            const cell = closest(e.target, this.cellTag)
            if (cell) {
                this.renderContextMenu(cell)
            }
        })
        
        // Set Scoll Padding based on size change of frozen cells to make
        // scroll snapping happen on edge of frozen column instead of 0
        this.observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.target.classList.contains('frozen-col')) {
                    this.style.scrollPaddingLeft = entry.target.offsetWidth + "px"
                }
            }
        })
        this.querySelectorAll(this.cellTag).forEach(cell => {
            this.observer.observe(cell);
        })
    }
    
    connected () {
        if (!this.getRootNode()) { return }
        this.manageEventListenerFor(this.getRootNode(), 'paste', e => {
            if (this.contains(document.activeElement)) {
                e.preventDefault()
                this.pasteCells(e.clipboardData.getData("text/plain"))
            }
        })
        
        this.manageEventListenerFor(this.getRootNode(), 'copy', e => {
            if (this.contains(document.activeElement)) {
                e.preventDefault()
                this.copyCells(document.activeElement)
            }
        })
    }
    
    remove (...args) {
        this.observer.disconnect()
        delete this.observer
        super.remove(...args)
    }
    
    initColumn (key, options, ...args) {
        const model = super.initColumn(key, options, ...args)
        model.input = options.input || this.defaultInput(key, options)
        model.copy = record => record[key]
        model.paste = (record, value) => record[key] = value
        return model
    }
    
    defaultRender (key) {
        return r => {
            let value = r[key]
            if (typeof value == "string") { value = value.replaceAll("\n", "<br>")}
            return value
        }
    }
    
    defaultHeader (key, options) {
        let headerOptions = options.header
        if (typeof headerOptions != "object") {
            headerOptions = {
                content: headerOptions || key
            }
        }
        return Object.assign({
            content: key,
            input: options => listenerElement('input', {
                size: 1,
                style: {
                    width: '100%'
                },
                type: 'text',
                value: options.header.content
            }, 'change', e => {
                options.header.content = e.target.value
                this.trigger('headerChange', key, e.target.value)
            })
        }, headerOptions)
    }
    
    renderHeader (column, ...args) {
        const cell = createElement(`${this.tagName}-cell`, column.header)
        cell.classList.add('header', 'frozen-row', column.frozen === true ? 'frozen-col' : null)
        cell.tabIndex = 0;
        cell.columnModel = column
        cell.render = () => {
            content(cell, result(column.header, 'content', column))
        }
        return cell
    }
    
    defaultInput (key) {
        return (r, cell, event) => {
            let content = r[key]
            if (event.type == "keydown" && event.key != "Enter") {
                content = ""
            }
            if (typeof content == "string") {
                content = content.replaceAll("\n", "<br>")
            }
            const input = listenerElement('div', {
                contenteditable: true,
                class: `${this.tagName.toLowerCase()}-input`,
                content: content,
                style: {
                    padding: css(cell, 'padding')
                }
            }, 'focusout', e => {
                r[key] = e.target.innerText.trimEnd().replaceAll("<br>", "\n")
            })
            return input
        }
    }
    
    renderCell (record, column, ...args) {
        const el = super.renderCell(record, column, ...args)
        el.record = record
        el.tabIndex = 0
        el.columnModel = column
        el.classList.toggle('frozen-col', column.frozen === true)
        if (this.observer) {
            this.observer.observe(el);
        }
        return el
    }
    
    removeCell (...args) {
        this.observe.unobserve(el);
        return super.removeCell(...args)
    }
    
    changeFocusByDirection(direction, currentCell) {
        currentCell = currentCell || this.querySelector(`${this.cellTag}:focus, ${this.cellTag}:focus-within`)
        if (currentCell) {
            let targetCell;
            let rowIndex = currentCell.rowIndex;
            if (rowIndex == "header") { rowIndex = 0 }
            switch (direction) {
                case 'ArrowDown': targetCell = this.querySelector(`.row-${rowIndex + 1}.col-${currentCell.colIndex}`); break;
                case 'ArrowUp': targetCell = this.querySelector(`.row-${rowIndex - 1}.col-${currentCell.colIndex}`); break;
                case 'ArrowLeft': targetCell = this.querySelector(`.row-${rowIndex}.col-${currentCell.colIndex - 1}`); break;
                case 'ArrowRight': targetCell = this.querySelector(`.row-${rowIndex}.col-${currentCell.colIndex + 1}`); break;
            }
            if (targetCell) { targetCell.focus() }
        }
    }
    
    activateCellInput (cell, e) {
        this.deselectCells(true);
        let input
        if (cell.classList.contains('header')) {
            input = result(cell.columnModel.header, 'input', cell.columnModel, cell, e)
        } else {
            input = result(cell.columnModel, 'input', cell.record, cell, e)
        }
        if (input) {
            const rowArea = cell.classList.contains('header') ? '' : ' body'
            const colArea = ' body'
            const inputCell = createElement(this.cellTag, {
                class: 'input',
                content: {
                    tag: `${this.tagName}-inputfield`,
                    content: input
                },
                style: {
                    gridArea: [
                        cell.rowIndex + rowArea,
                        cell.colIndex + colArea,
                        cell.rowIndex + rowArea,
                        cell.colIndex + colArea].join(" / ")
                }
            })
            inputCell.classList.toggle('frozen-row', cell.classList.contains('frozen-row'))
            inputCell.classList.toggle('frozen-col', cell.classList.contains('frozen-col'))
            insertAfter(cell, inputCell)
            inputCell.originalCell = cell;
            
            const firstInput = inputCell.querySelector('input, textarea, button, [contenteditable]')
            if (firstInput) {
                placeCaretAtEnd(firstInput)
            }
            
            cell.tabIndex = -1

            inputCell.beforeRemove = () => {
                cell.tabIndex = 0
                cell.render()
            }
            inputCell.addEventListener('focusout', e => {
                inputCell.beforeRemove()
                inputCell.remove()
            })
            inputCell.addEventListener('keydown', e => {
                if (e.key == "Enter" && [e.metaKey,e.ctrlKey,e.altKey,e.shiftKey].every(x => x == false)) {
                    this.changeFocusByDirection('ArrowDown', cell);
                }
            })
        }
    }

    
    renderContextMenu(cell) {
        if (this.contextMenu && this.contextMenu.anchor == cell) {
            return
        } else if (this.contextMenu) {
            this.contextMenu.hide()
        }
        
        const canPaste = window.navigator.clipboard.readText != undefined || this.copyData
        
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
                    this.copyCells(cell)
                    this.contextMenu.hide()
                }),
                listenerElement('button', {
                    content: 'Paste',
                    disabled: !canPaste
                }, async e => {
                    if (window.navigator.clipboard.readText) {
                        console.log(this.copyData);
                        if (window.navigator.clipboard.readText == undefined) {
                            this.pasteCells(this.copyData)
                        } else {
                            this.pasteCells(await window.navigator.clipboard.readText())
                        }
                    }
                    this.contextMenu.hide()
                })
            ]
        })
        this.append(this.contextMenu)
        return this.contextMenu
    }
    
    // -----------------
    // Column / Row Resizing
    // -----------------
    initializeAxisResize (e) {
        const axis = e.target.parentElement.classList.contains('row') ? 'row' : 'col'
        const handle = axis == "row" ? this.rowResizeHandle : this.colResizeHandle
        const index = axis == "row" ? "rowIndex" : "colIndex"
        const selectedIndex = handle[index] - (e.target.classList.contains('start') ? 1 : 0)
        const start = e[axis == "row" ? "y" : "x"] - this.querySelector(`${this.cellTag}.${axis}-${selectedIndex}`)[axis == "row" ? "offsetHeight" : "offsetWidth"]
        const indexes = uniq(Array.from(this.querySelectorAll(`${this.cellTag}.header.selected`)).map(cell => cell[index])).concat(selectedIndex)
        const handleOffset = handle.offsetWidth / 2
        
        this.classList.add('resizing')

        this.dragIndicator = createElement(`${this.constructor.tagName}-drag-indicator`, {
            class: axis,
            style: {
                insetInlineStart: (handle.offsetLeft) + "px"
            }
        })
        this.append(this.dragIndicator)

        let mouseMove = e => {
            this.dragIndicator.style.insetInlineStart = (e[axis == "col" ? "x" : "y"] - this.offsetLeft) + "px"
        }
        mouseMove = mouseMove.bind(this)

        let mouseUp = (e) => {
            let delta = e[axis == "row" ? "y" : "x"] - start;
            if (delta < 0) { delta = 0 }
            let sizes = this.style[`gridTemplate${axis == "row" ? 'Rows' : 'Columns'}`].split(" [body] ")
            indexes.forEach(index => {
                sizes[index] = delta + "px"
            })
            this.style[`gridTemplate${axis == "row" ? 'Rows' : 'Columns'}`] = sizes.join(" [body] ")
            
            const data = axis == "row" ? this.data : this._columns
            this.trigger(indexes.map(index => data[index].id), `${axis}Resize`,  delta)
            
            this.dragIndicator.remove()
            delete this.dragIndicator
            this.classList.remove('resizing')
            
            this.removeEventListener('mousemove', mouseMove)
            this.removeEventListener('mouseup', mouseUp)
        }
        mouseUp = mouseUp.bind(this)

        this.addEventListener('mousemove', mouseMove)
        this.addEventListener('mouseup', mouseUp)
    }
    
    showResizeHandleFor (cell) {
        if (!this.colResizeHandle && this.resize.includes('col')) {
            this.colResizeHandle = createElement(this.resizeHandleTag, {
                class: 'col',
                content: [{class: 'start'}, {class: 'end'}]
            })
            this.manageEventListenerFor(this.colResizeHandle, 'mousedown', this.initializeAxisResize.bind(this))
            this.append(this.colResizeHandle);
        }
        if (!this.rowResizeHandle && this.resize.includes('row')) {
            this.rowResizeHandle = createElement(this.resizeHandleTag, {
                class: 'row',
                content: [{class: 'start'}, {class: 'end'}]
            })
            this.manageEventListenerFor(this.rowResizeHandle, 'mousedown', this.initializeAxisResize.bind(this))
            this.append(this.rowResizeHandle);
        }
        if (!this.classList.contains('resizing')) {
            if (this.colResizeHandle) {
                this.colResizeHandle.rowIndex = 1
                this.colResizeHandle.colIndex = cell.colIndex
                this.colResizeHandle.style.gridArea = ['header', `body ${cell.colIndex}`, 'header', `body ${cell.colIndex}`].join(" / ")
                this.colResizeHandle.classList.toggle('hide-start', cell.classList.contains('col-1'))
                this.colResizeHandle.classList.toggle('hide-end', cell.classList.contains(`col-${cell.parentElement.children.length}`))
                if (cell.classList.contains('row-header')) {
                    this.append(this.colResizeHandle);
                } else {
                    this.colResizeHandle.remove();
                }
            }
        
            if (this.rowResizeHandle) {
                this.rowResizeHandle.rowIndex = cell.rowIndex
                this.rowResizeHandle.colIndex = 1
                this.rowResizeHandle.style.gridArea = [`body ${cell.rowIndex}`, 'body', `body ${cell.rowIndex}`, 'body'].join(" / ")
                if (cell.classList.contains('col-1')) {
                    this.append(this.rowResizeHandle);
                } else {
                    this.rowResizeHandle.remove();
                }
            }
        }
        
    }
    
    // -----------------
    // Column / Row Move
    // -----------------
    initializeAxisMove (e) {
        const axis = e.currentTarget.classList.contains('row') ? 'row' : 'col'
        const handle = axis == "row" ? this.rowMoveHandle : this.colMoveHandle
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
        this.classList.add('moving')
        this.dragIndicator = createElement(`${this.constructor.tagName}-drag-indicator`, {
            class: axis,
            style: {
                [axis == "col" ? "gridRow" : "gridColumn"]: 'handles / -1'
            }
        })
        this.append(this.dragIndicator)
        
        let dragOver = e => {
            e.preventDefault()
            const cell = closest(e.target, `${this.cellTag}, ${this.moveHandleTag}`)
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
            const cell = closest(e.target, `${this.cellTag}, ${this.moveHandleTag}`) || lastCell
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
                    if (cell.classList.contains('header') && axis == "row") {
                        cell.classList.add(`${axis}-${cell[index]}`)
                    } else {
                        cell.style[`${gridAxis}Start`] = `body ${cell[index]}`
                        cell.style[`${gridAxis}End`] = `body ${cell[index]}`
                        cell.classList.add(`${axis}-${cell[index]}`)
                    }
                })
                this.trigger(`${axis}Reorder`, newIndex, oldIndex)
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

            this.classList.remove('moving')
            handle.style.left = ''
            handle.style.width = ''
            handle.style.top = ''
            handle.style.height = ''
            this.showMoveHandleFor(cell)
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
    
    showReorderHandleFor (cell) {
        if (!this.colReorderHandle && this.reorder.includes('col')) {
            this.colReorderHandle = createElement(this.reorderHandleTag, {
                class: 'col',
                draggable: true,
                content: {
                    content: handleIcon()
                }
            })
            this.manageEventListenerFor(this.colMoveHandle, 'dragstart', this.initializeAxisMove.bind(this))
        }
        if (!this.rowReorderHandle && this.reorder.includes('row')) {
            this.rowReorderHandle = createElement(this.reorderHandleTag, {
                class: 'row',
                draggable: true,
                content: {
                    content: handleIcon({horizontal: true})
                }
            })
            this.manageEventListenerFor(this.rowMoveHandle, 'dragstart', this.initializeAxisMove.bind(this))
        }
        if (!this.classList.contains('reordering')) {
            if (this.colReorderHandle) {
                this.colReorderHandle.rowIndex = 1
                this.colReorderHandle.colIndex = cell.colIndex
                this.colReorderHandle.style.gridArea = ['handles', `body ${cell.colIndex}`, 'handles', `body ${cell.colIndex}`].join(" / ")
                if (cell.classList.contains('frozen-col')) {
                    this.colReorderHandle.remove();
                } else {
                    this.append(this.colReorderHandle);
                }
            }
            
            if (this.rowReorderHandle) {
                this.rowReorderHandle.rowIndex = cell.rowIndex
                this.rowReorderHandle.colIndex = 1
                this.rowReorderHandle.style.gridArea = [`body ${cell.rowIndex}`, 'handles', `body ${cell.rowIndex}`, 'handles'].join(" / ")
                if (cell.classList.contains('frozen-row')) {
                    this.rowReorderHandle.remove();
                } else {
                    this.append(this.rowReorderHandle);
                }
            }
        }
    }
    
    // -----------------
    // Cell Selection
    // -----------------
    initializeCellSelection (startCell, e) {
        if (!this.getRootNode()) { return }
        
        if (e.shiftKey) {
            this.deselectCells()
            startCell = this.querySelector(`${this.cellTag}:focus`)
            e.preventDefault()
        }
        
        const mouseOver = e => {
            const overCell = closest(e.target, this.cellTag)
            if (overCell) {
                this.querySelectorAll(`${this.cellTag}.selecting`).forEach(el => el.classList.remove('selecting'))
                const colsMinMax = [startCell.colIndex, overCell.colIndex]
                if (startCell.classList.contains('header')) {
                    for (let colIndex = Math.min(...colsMinMax); colIndex <= Math.max(...colsMinMax); colIndex++) {
                        this.querySelectorAll(`.col-${colIndex}`).forEach(el => el.classList.add('selecting'))
                    }
                } else {
                    const rowsMinMax = [startCell.rowIndex, overCell.rowIndex]
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
        }
        
        
        if (e.shiftKey) {
            mouseOver(e)
        }
        if (startCell.classList.contains('header')) {
            mouseOver(e)
        }
        
        const mouseUp = e => {
            const endCell = closest(e.target, this.cellTag)
            if (startCell.classList.contains('header') || (endCell && endCell != startCell)) {
                const selectingCells = this.querySelectorAll(`${this.cellTag}.selecting`)
                this.highlightSelectedCells(...Array.from(selectingCells))
                selectingCells.forEach(el => {
                    el.classList.remove('selecting')
                    el.classList.add('selected')
                })
            } else if (e?.metaKey) {
                endCell.classList.add('selected')
            } else {
                this.deselectCells()
            }
            this.removeEventListener('mouseover', mouseOver)
            startCell.focus()
        }
        
        this.getRootNode().addEventListener('mouseup', mouseUp, {once: true})
        this.addEventListener('mouseover', mouseOver)
    }
    
    highlightSelectedCells (...cells) { // (...cells, [tagName])
        const tagName = typeof cells[cells.length - 1] == "string" ? cells.pop() : `${this.tagName}-selection`
        let rowIndexes = cells.map(cell => cell.rowIndex)
        let colIndexes = cells.map(cell => cell.colIndex)
        let rowStart;
        let colStart
        if (rowIndexes.includes('header')) {
            rowStart = 'header'
            rowIndexes = rowIndexes.filter(x => x != 'header')
        }
        if (colIndexes.includes('header')) {
            colStart = 'header'
            colIndexes = colIndexes.filter(x => x != 'header')
        }
        this.append(createElement(tagName, {
            style: {
                gridArea: [
                    rowStart ? rowStart : Math.min(...rowIndexes),
                    colStart ? colStart : Math.min(...colIndexes),
                    Math.max(...rowIndexes) + 1,
                    Math.max(...colIndexes) + 1
                ].map(i => i == "header" ? i : `body ${i}`).join(" / ")
            }
        }))
    }
    
    deselectCells (includeCopy=false) {
        this.querySelectorAll(`${this.cellTag}.selected`).forEach(el => el.classList.remove('selected'));
        this.querySelectorAll(`${this.tagName}-selection`).forEach(el => el.remove());
        this.querySelectorAll(`${this.cellTag}-inputfield`).forEach(el => {
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
    copyCells(cell) {
        const selectedCells = this.selectedCells()
        const data = this.selectedCells().map(row => row.map(cell => {
            return cell.columnModel.copy(cell.record)
        }).join("\t")).join("\n")
        window.navigator.clipboard.writeText(data)
        this.copyData = data
        this.highlightSelectedCells(...selectedCells.flat(), `${this.tagName}-copy-selection`)
    }
    
    pasteCells(data) {
        if (data == undefined) { return }
        const selectedCells = this.selectedCells()
        const pasteMatrix = data.split("\n").map(r => r.split("\t"))
        
        if (selectedCells.length == 1 && selectedCells[0].length == 1) {
            const selectedCell = selectedCells[0][0]
            let rowIndex = selectedCell.rowIndex
            const targets = []
            pasteMatrix.forEach(row => {
                let colIndex = selectedCell.colIndex
                row.forEach(cellValue => {
                    const cell = this.querySelector(this.cellTag + `.col-${colIndex}.row-${rowIndex}`)
                    if (cell) {
                        this.pasteCell(cell, cellValue)
                        cell.classList.add('selected')
                        targets.push(cell)
                    }
                    colIndex++
                })
                rowIndex++
            })
            this.highlightSelectedCells(...targets)
            selectedCell.focus();
        } else {
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
        }

        this.querySelectorAll(`${this.tagName}-copy-selection`).forEach(el => el.remove());
    }
    
    pasteCell(cell, value) {
        cell.columnModel.paste(cell.record, value)
        cell.render()
    }
    
    static style = function() { return `
        ${this.tagName} {
            --select-color: #1a73e8;
            --handle-size: 10px;
            position: relative;
            overflow: scroll;
            scroll-snap-type: both mandatory;
        }
        ${this.tagName}-cell {
            cursor: cell;
            user-select: none;
            position: relative;
            z-index: 1;
            scroll-snap-stop: always;
            scroll-snap-align: start;
            overflow: hidden;
            white-space: nowrap;
        }
        ${this.tagName}-cell.frozen-col,
        ${this.tagName}-cell.frozen-row {
            position: sticky;
            left: 0;
            top: auto;
            z-index: 41;
        }
        ${this.tagName}-cell.frozen-row {
            top: 0;
            z-index: 42;
        }
        ${this.tagName}-cell.frozen-row.frozen-col{
            z-index: 43;
        }
        ${this.tagName}-cell:focus {
            box-shadow: inset 0 0 0 1px var(--select-color), 0 0 0 1px var(--select-color);
            z-index: 2;
            outline: none;
        }
        ${this.tagName}-cell.selecting,
        ${this.tagName}-cell.selected {
            box-shadow: inset 0 0 0 999px rgba(26, 115, 232, 0.1);
            &:focus {
                box-shadow: inset 0 0 0 999px rgba(26, 115, 232, 0.1), inset 0 0 0 1px var(--select-color), 0 0 0 1px var(--select-color);
            }
        }
        
        ${this.tagName}-selection {
            pointer-events: none;
            border: 1px solid var(--select-color);
            z-index: 50;
        }
        ${this.tagName}-copy-selection {
            pointer-events: none;
            border: 2px dashed var(--select-color);
            z-index: 50;
        }
        
        ${this.tagName}-cell.input {
            overflow: visible;
            z-index: 70 !important;
            position: relative;
        }
        ${this.tagName}-inputfield {
            position: absolute;
            top: 0;
            left: 0;
            min-width: 100%;
            min-height: 100%;
            box-shadow: inset 0 0 0 1px var(--select-color), 0 0 0 1px var(--select-color), 0 0 0 3px rgba(26, 115, 232, 0.5);
            background: white;
            display: flex;
            flex-direction: column;
        }
        ${this.tagName}-cell.input .${this.tagName}-input {
            min-width: 100%;
            outline: none;
            border: none;
            background: none;
            flex: 1 0 auto;
            white-space: nowrap;
        }
        
        .${this.tagName}-menu {
            border-radius: 0.35em;
            background: white;
            padding: 0.5em;
            font-size: 0.8em;
            z-index: 60;
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
        
        ${this.tagName}-resize-handle {
            position: sticky;
            top: 0;
            z-index: 51;
            pointer-events: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: col-resize;
        }
        ${this.tagName}-resize-handle.row {
            writing-mode: vertical-lr;
            cursor: row-resize;
            block-size: 20px;
        }
        ${this.tagName}-resize-handle .start,
        ${this.tagName}-resize-handle .end {
            pointer-events: auto;
            block-size: 50%;
            inline-size: 11px;
            border: 3px none currentColor;
            border-inline-style: solid;
            opacity: 0.2;
            margin-inline: -6px;
        }
        ${this.tagName}-resize-handle .start:hover,
        ${this.tagName}-resize-handle .end:hover {
            opacity: 1;
            border-color: var(--select-color);
        }
        ${this.tagName}-resize-handle.hide-start .start {
            pointer-events: none;
            opacity: 0;
        }
        ${this.tagName}-resize-handle.hide-end .end {
            pointer-events: none;
            opacity: 0;
        }

        ${this.tagName}-move-handle {
            position: sticky;
            top: 0;
            z-index: 51;
        }
        ${this.tagName}-move-handle.row {
            writing-mode: vertical-lr;
        }
        ${this.tagName}.moving ${this.tagName}-cell {
            cursor: grabbing;
        }
        ${this.tagName}.moving ${this.tagName}-move-handle {
            position: absolute;
            background: rgba(0,0,0, 0.2);
            top: 0;
            left: 0;
            block-size: 100%;
            pointer-events: none;
        }
        ${this.tagName}-move-handle > * {
            top: 1px;
            inline-size: 100%;
            block-size: var(--handle-size);
            display: flex;
            cursor: grab;
            justify-content: center;
            padding-block-start: 2px;
        }
        ${this.tagName}-move-handle > *:hover {
            background: rgba(26, 115, 232, 0.1);
        }
        
        ${this.tagName}-drag-indicator {
            pointer-events: none;
            position: absolute;
            block-size: 100%;
            inline-size: 3px;
            inset-block-start: 0;
            background: var(--select-color);
            z-index: 52;
        }
        ${this.tagName}-drag-indicator.row {
            writing-mode: vertical-lr;
        }
    `}
    
    addEventListenerFor(...args) {
        return addEventListenerFor(this, ...args)
    }

}

window.customElements.define(Spreadsheet.tagName, Spreadsheet);