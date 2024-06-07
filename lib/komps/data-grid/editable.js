import { createElement, listenerElement, insertBefore } from 'dolla';
import DataGrid from '../data-grid.js';
import { closest } from '../../support.js';
import { handleIcon } from '../../icons.js'

export default class EditableDataGrid extends DataGrid {
    
    constructor (...args) {
        super(...args);
        if (this.reorder === true) {
            this.reorder = ['columns', 'rows']
        } else if (this.reorder === false) {
            this.reorder = new Array()
        } else if (typeof this.reorder === "string") {
            this.reorder = [this.reorder]
        }
        if (this.resize === true) {
            this.resize = ['columns', 'rows']
        } else if (this.resize === false) {
            this.resize = []
        } else if (typeof this.resize === "string") {
            this.resize = [this.resize]
        }
        this.addEventListenerFor(`${this.tagName}-cell`, 'mouseover', () => {
            this.clearResizeHandles()
            this.clearReorderHandles()
        })
        this.addEventListener('mouseleave', () => {
            this.clearResizeHandles()
            this.clearReorderHandles()
        })
        this.addEventListenerFor('.resizable', 'mouseover', e => {
            this.showResizeHandleFor(e.delegateTarget)
        });
        this.addEventListenerFor('.reorderable', 'mouseover', e => {
            this.showReorderHandleFor(e.delegateTarget)
        });
    }
    
    renderHeaderCell (column, index) {
        const cell = super.renderHeaderCell(column, index)
        if (this.resize.includes('columns')) {
            cell.classList.add('resizable', 'resizable-column')
        }
        if (this.reorder.includes('columns')) {
            cell.classList.add('reorderable', 'reorderable-column')
        }
        return cell
    }
    
    renderCell (item, column, colIndex, rowIndex) {
        const cell = super.renderCell(item, column, colIndex, rowIndex)
        if (column.frozen) {
            if (this.resize.includes('rows')) {
                cell.classList.add('resizable', 'resizable-row')
            }
            if (this.reorder.includes('rows')) {
                cell.classList.add('reorderable', 'reorderable-row')
            }
        }
        return cell
    }
    
    
    /* ---------------------------------
        Resize
     --------------------------------- */
    
    clearResizeHandles () {
        if (this.resizing) { return }
        this.querySelectorAll(`${this.tagName}-resize-handle`).forEach(x => x.remove())
    }
    
    showResizeHandleFor (cell) {
        if (this.resizing) { return }
        this.clearResizeHandles()
        const row = cell.parentElement;
        const handle = listenerElement(`${this.tagName}-resize-handle`, {
            class: cell.classList.contains('resizable-column') ? 'resizable-column' : 'resizable-row',
            content: [{ tag: 'handle-start' }, { tag: 'handle-end' }],
            style: {
                'grid-column': cell.column,
                'grid-row': row.row
            }
        }, 'mousedown', this.activateAxisResize.bind(this))
        const axisTarget = cell.classList.contains('resizable-column') ? cell : row;
        if (axisTarget.previousElementSibling?.tagName != cell.tagName) {
            handle.querySelector('handle-start').remove()
        }
        handle.cell = cell
        this.append(handle)
    }
    
    activateAxisResize (e) {
        this.resizing = true
        const handle = e.target.parentElement
        let target = handle.cell
        if (e.target.localName == "handle-start") {
            target = target.previousElementSibling
        }
        let { direction, axis, offset, index, start } = handle.classList.contains('resizable-row') ? {
            direction: 'Row',
            axis: 'y',
            offset: this.scrollTop - this.offsetTop,
            index: target.row,
            start: e.y - target.offsetHeight
        } : {
            direction: 'Column',
            axis: 'x',
            offset: this.scrollLeft - this.offsetLeft,
            index: target.column,
            start: e.x - target.offsetWidth
        }
        
        const dragIndicator = createElement(`${this.constructor.tagName}-drag-indicator`, {
            class: direction.toLowerCase(),
            style: {
                'inset-inline-start': e[axis] + offset + "px"
            }
        })
        this.append(dragIndicator)
        
        function mouseMove (e) {
            dragIndicator.style.insetInlineStart = (e[axis] + offset) + "px"
        }
        this.addEventListener('mousemove', mouseMove)
        window.addEventListener('mouseup', e => {
            let delta = e[axis] - start;
            if (delta < 0) { delta = 0 }
            let sizes = this.style[`gridTemplate${direction}s`].split(" ")
            sizes[index - 1] = delta + "px"
            this.style[`gridTemplate${direction}s`] = sizes.join(" ")
            
            const data = axis == "row" ? this.data : this._columns
            this.trigger(`${direction}Resize`,  delta, sizes)
            
            dragIndicator.remove()
            this.removeEventListener('mousemove', mouseMove)
            this.resizing = false
        }, {once: true})
    }
    
    /* ---------------------------------
        Reorder
     --------------------------------- */
    
    clearReorderHandles () {
        if (this.reordering) { return }
        this.querySelectorAll(`${this.tagName}-reorder-handle`).forEach(x => x.remove())
    }
    
    showReorderHandleFor(cell) {
        if (this.reordering) { return }
        this.clearReorderHandles()
        const handle = listenerElement(`${this.tagName}-reorder-handle`, {
            class: cell.classList.contains('reorderable-column') ? 'reorderable-column' : 'reorderable-row',
            draggable: true,
            content: handleIcon({horizontal: cell.classList.contains('reorderable-row')}),
            style: {
                'grid-column': cell.column,
                'grid-row': cell.row
            }
        }, 'dragstart', this.activateAxisReorder.bind(this))
        handle.cell = cell
        this.append(handle)
    }
    
    activateAxisReorder (e) {
        this.reordering = true
        const handle = e.currentTarget
        let { direction, inverseDirection, axis, position, dimension } = handle.classList.contains('reorderable-row') ? {
            direction: 'Row',
            inverseDirection: 'Column',
            axis: 'y',
            position: 'Top',
            dimension: 'Height'
        } : {
            direction: 'Column',
            inverseDirection: 'Row',
            axis: 'x',
            position: 'Left',
            dimension: 'Width'
        }
        
        this.querySelectorAll(`${this.tagName}-cell.row-${handle.cell.row}`).forEach(el => el.classList.add('selecting'));
        
        handle.style.inlineSize = handle[`offset${dimension}`] + "px"
        handle.style.insetInlineStart = handle[`offset${position}`] + "px"
        handle.style.removeProperty('grid-area')
        handle.classList.add('reordering')
        
        e.dataTransfer.setDragImage(createElement(), 0, 0);
        
        const dragIndicator = createElement(`${this.constructor.tagName}-drag-indicator`, {
            class: direction.toLowerCase(),
            style: {
                'inset-inline-start': handle[`offset${position}`] + "px"
            }
        })
        this.append(dragIndicator)

        let lastCell;
        const dragOver = e => {
            e.preventDefault()
            const cell = closest(e.target, `${this.tagName}-cell, ${this.tagName}-reorder-handle`) || lastCell
            lastCell = cell;
            
            let newPosition = e[axis] - (handle[`offset${dimension}`] / 2) + this[`scroll${position}`] - this[`offset${position}`]
            newPosition = newPosition < 0 ? 0 : newPosition
            newPosition = newPosition > this[`scroll${dimension}`] - handle[`offset${dimension}`] ? this[`scroll${dimension}`] - handle[`offset${dimension}`] : newPosition
            handle.style.insetInlineStart = newPosition + "px"
            if (cell) {
                const newIndex = cell[direction.toLowerCase()]
                dragIndicator.style.insetInlineStart = cell[`offset${position}`] + "px"
            }
            this.reordering = false
        }
        
        const drop = e => {
            const directionKey = direction.toLowerCase()
            const indexStart = handle.cell[directionKey]
            const cell = closest(e.target, `${this.tagName}-cell, ${this.tagName}-reorder-handle`) || lastCell
            lastCell = cell;
            
            if (cell && cell[directionKey] != indexStart) {
                const indexNew = cell[directionKey] > indexStart ? cell[directionKey] - 1 : cell[directionKey]
                const indexAnchor = cell[directionKey]
                const indexVector = indexStart < indexNew ? -1 : 1
                
                this.querySelectorAll(`${this.tagName}-cell`).forEach(cell => {
                    if (Math.min(indexStart, indexNew) <= cell[directionKey] && cell[directionKey] <= Math.max(indexStart, indexNew)) {
                        const indexWas = cell[directionKey]
                        cell.classList.remove(`${directionKey}-${indexWas}`)
                        if (indexWas == indexStart) {
                            cell[directionKey] = indexNew
                            if (direction == "Column") {
                                insertBefore(cell.parentElement.children.item(indexAnchor - 1), cell)
                            } else if (cell.parentElement.classList.contains(`row-${indexWas}`)) {
                                insertBefore(this.children.item(indexAnchor - 1), cell.parentElement)
                                cell.parentElement.removeClass(`row-${indexWas}`)
                                cell.parentElement.addClass(`row-${indexNew}`)
                            }
                        } else {
                            cell[directionKey] += indexVector
                        }
                        cell.style[`grid${direction}`] = cell[directionKey]
                        cell.classList.add(`${directionKey}-${cell[directionKey]}`)
                    }
                })
                const template = this.style.getPropertyValue(`grid-template-${direction.toLowerCase()}s`) 
                if (template) {
                    const sizes = template.split(" ")
                    const indexSize = sizes[indexStart - 1]
                    sizes.splice(indexStart - 1, 1);
                    sizes.splice(indexNew - 1, 0, indexSize);
                    this.style.setProperty(`grid-template-${direction.toLowerCase()}s`, sizes.join(" "))
                    this.trigger(`${direction}Reorder`, indexNew, indexStart)
                }
            }
            
            this.querySelectorAll(`${this.cellTag}.selecting`).forEach(el => {
                el.classList.remove('selecting')
                el.classList.add('selected')
            })
        }
        
        const dragEnd = e => {
            const cell = lastCell || this.querySelector(`${this.tagName}-cell.selecting, ${this.tagName}-cell.selected`)
            dragIndicator.remove()

            handle.style.removeProperty('inline-size')
            handle.style.removeProperty('inset-inline-start')
            this.showReorderHandleFor(cell)
            this.querySelectorAll(`${this.tagName}-cell.selecting`).forEach(el => {
                el.classList.remove('selecting')
            })

            this.removeEventListener('dragover', dragOver)
            this.removeEventListener('drop', drop)
            this.removeEventListener('dragend', dragEnd)
        }
        
        this.addEventListener('dragover', dragOver)
        this.addEventListener('drop', drop)
        this.addEventListener('dragend', dragEnd)
    }
    
    static style = `
        komp-spreadsheet-resize-handle {
            pointer-events: none;
            position: sticky;
            inset-block-start: 0;
            pointer-events: none;
            display: grid;
            grid-template-columns: auto auto;
            justify-content: space-between;
            align-items: center;
            cursor: col-resize;
            z-index: 
        }
        komp-spreadsheet-resize-handle.resizable-row {
            writing-mode: vertical-lr;
            cursor: row-resize;
        }
        komp-spreadsheet-resize-handle handle-start,
        komp-spreadsheet-resize-handle handle-end {
            pointer-events: auto;
            display: block;
            pointer-events: auto;
            block-size: 50%;
            inline-size: 11px;
            border: 3px none currentColor;
            border-inline-style: solid;
            opacity: 0.2;
            position: relative;
        }
        komp-spreadsheet-resize-handle handle-start {
            grid-column: 1;
            inset-inline-start: -6px;
        }
        komp-spreadsheet-resize-handle handle-end {
            grid-column: 2;
            inset-inline-end: -6px;
        }
        komp-spreadsheet-resize-handle handle-start:hover,
        komp-spreadsheet-resize-handle handle-end:hover {
            opacity: 1;
            border-color: var(--select-color);
        }
        
        
        komp-spreadsheet-reorder-handle {
            position: sticky;
            inset-block-start: 0;
            pointer-events: none;
        }
        komp-spreadsheet-reorder-handle.reorderable-row {
            writing-mode: vertical-lr;
        }
        komp-spreadsheet-reorder-handle > svg {
            pointer-events: auto;
            inline-size: 100%;
            block-size: var(--handle-size);
            display: flex;
            cursor: grab;
            justify-content: center;
            padding-block: 4px;
        }
        komp-spreadsheet-reorder-handle > svg:hover {
            background: rgba(26, 115, 232, 0.1);
        }
        komp-spreadsheet-reorder-handle.reordering {
            position: absolute;
            background: rgba(0,0,0, 0.2);
            block-size: 100%;
            pointer-events: none;
            cursor: grabbing;
        }


        komp-spreadsheet-drag-indicator {
            pointer-events: none;
            position: absolute;
            block-size: 100%;
            inline-size: 3px;
            inset-block-start: 0;
            background: var(--select-color);
        }
        komp-spreadsheet-drag-indicator.row {
            writing-mode: vertical-lr;
        }
    `
}