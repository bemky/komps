import { createElement, listenerElement, insertBefore } from 'dolla';
import DataGrid from '../data-grid.js';
import { closest, uniq, translate } from '../../support.js';
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
    
    renderCell (record, column, colIndex, rowIndex) {
        const cell = super.renderCell(record, column, colIndex, rowIndex)
        if (this.resize.includes('rows') && colIndex == 1) {
            cell.classList.add('resizable', 'resizable-row')
        }
        if (this.reorder.includes('rows') && colIndex == 1) {
            cell.classList.add('reorderable', 'reorderable-row')
        }
        return cell
    }
    
    async renderRow (record, index) {
        const row = super.renderRow(record, index)
        row.row = index
        return row
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

        const axises = ['column', 'row']
        axises.forEach(axis => {
            if (cell.classList.contains(`resizable-${axis}`)) {
                const row = cell.parentElement;
                const handle = listenerElement(`${this.tagName}-resize-handle`, {
                    class: `resizable-${axis}`,
                    content: [{ tag: 'handle-start' }, { tag: 'handle-end' }],
                    style: {
                        'grid-column': cell.column,
                        'grid-row': row.row
                    }
                }, 'mousedown', this.activateAxisResize.bind(this))
                const axisTarget = axis == 'column' ? cell : row;
                if (!axisTarget.previousElementSibling || !axisTarget.previousElementSibling.classList.contains(`resizable-${axis}`)) {
                    handle.querySelector('handle-start').remove()
                }
                handle.cell = cell
                this.append(handle)
            }
        })
    }
    
    cellsDimension (dimension) {
        const cells = this.querySelectorAll(`${this.tagName}-cell`)
        const lastCell = cells.item(cells.length - 1)
        return {
            width: lastCell.offsetLeft + lastCell.offsetWidth,
            height: lastCell.offsetTop + lastCell.offsetHeight
        }[dimension]
    }
    
    activateAxisResize (e) {
        this.resizing = true
        const handle = e.target.parentElement
        const bb = this.getBoundingClientRect()
        
        let target = handle.cell
        
        if (e.target.localName == "handle-start") {
            if (handle.classList.contains('resizable-row')) {
                target = this.querySelector(`${this.localName}-cell.column-${target.column}.row-${target.row - 1}`)
            } else {
                target = target.previousElementSibling
            }
        }
        let { direction, axis, offset, index, start, blockDimension } = handle.classList.contains('resizable-row') ? {
            direction: 'Row',
            axis: 'y',
            offset: this.scrollTop - bb.top,
            index: target.row,
            start: e.y - target.offsetHeight,
            blockDimension: 'width'
        } : {
            direction: 'Column',
            axis: 'x',
            offset: this.scrollLeft - bb.left,
            index: target.column,
            start: e.x - target.offsetWidth,
            blockDimension: 'height'
        }
        
        
        const indexes = uniq(Array.from(this.querySelectorAll(`${this.localName}-header ${this.localName}-cell.selected`)).map(cell => cell[direction.toLowerCase()]))
        if (indexes.length == 0) {
            indexes.push(index)
        }
        
        const dragIndicator = createElement(`${this.constructor.tagName}-drag-indicator`, {
            class: direction.toLowerCase(),
            style: {
                'inset-inline-start': e[axis] + offset + "px",
                'block-size': this.cellsDimension(blockDimension) + "px"
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
            let sizes = this.style[`gridTemplate${direction}s`].split(/(?<=[\w\)])\s(?=\w)/)
            const changes = indexes.map(index => {
                sizes[index - 1] = delta + "px"
                return {
                    index: index - 1,
                    size: delta + "px",
                    
                }
            })
            this.style[`gridTemplate${direction}s`] = sizes.join(" ")
            
            const data = axis == "row" ? this.data : this._columns
            this.trigger(`${direction.toLowerCase()}Resize`, {
                detail: { changes }
            })
            
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
        const axises = ['column', 'row']
        axises.forEach(axis => {
            if (cell.classList.contains(`reorderable-${axis}`)) {
                const handle = listenerElement(`${this.tagName}-reorder-handle`, {
                    class: `reorderable-${axis}`,
                    draggable: true,
                    content: handleIcon({horizontal: axis == 'row'}),
                    style: {
                        'grid-column': cell.column,
                        'grid-row': cell.row
                    }
                }, 'dragstart', this.activateAxisReorder.bind(this))
                handle.cell = cell
                this.append(handle)
            }
        })
    }
    
    activateAxisReorder (e) {
        this.reordering = true
        const handle = e.currentTarget
        const bb = this.getBoundingClientRect()
        let { direction, inverseDirection, axis, inlinePosition, inlineDimension, blockDimension } = handle.classList.contains('reorderable-row') ? {
            direction: 'Row',
            inverseDirection: 'Column',
            axis: 'y',
            inlinePosition: 'Top',
            inlineDimension: 'Height',
            blockDimension: 'Width'
        } : {
            direction: 'Column',
            inverseDirection: 'Row',
            axis: 'x',
            inlinePosition: 'Left',
            inlineDimension: 'Width',
            blockDimension: 'Height'
        }
        
        this.querySelectorAll(`${this.tagName}-cell.${direction.toLowerCase()}-${handle.cell[direction.toLowerCase()]}`).forEach(el => el.classList.add('selecting'));
        
        handle.style.inlineSize = handle[`offset${inlineDimension}`] + "px"
        handle.style.insetInlineStart = handle[`offset${inlinePosition}`] + "px"
        handle.style.blockSize = this.cellsDimension(blockDimension.toLowerCase()) + "px"
        handle.style.removeProperty('grid-area')
        handle.classList.add('reordering')
        
        e.dataTransfer.setDragImage(createElement(), 0, 0);
        
        const dragIndicator = createElement(`${this.constructor.tagName}-drag-indicator`, {
            class: direction.toLowerCase(),
            style: {
                'inset-inline-start': handle[`offset${inlinePosition}`] + "px",
                'block-size': this.cellsDimension(blockDimension.toLowerCase()) + "px"
            }
        })
        this.append(dragIndicator)

        let previousCell;
        const dragOver = e => {
            e.preventDefault()
            const cell = closest(e.target, `${this.tagName}-cell, ${this.tagName}-reorder-handle`) || previousCell
            previousCell = cell;
            
            let newPosition = e[axis] - bb[inlinePosition.toLowerCase()] - (handle[`offset${inlineDimension}`] / 2) + this[`scroll${inlinePosition}`]
            newPosition = newPosition < 0 ? 0 : newPosition
            newPosition = newPosition > this[`scroll${inlineDimension}`] - handle[`offset${inlineDimension}`] ? this[`scroll${inlineDimension}`] - handle[`offset${inlineDimension}`] : newPosition
            handle.style.insetInlineStart = newPosition + "px"
            if (cell) {
                const newIndex = cell[direction.toLowerCase()]
                dragIndicator.style.insetInlineStart = cell[`offset${inlinePosition}`] + "px"
            }
            this.reordering = false
        }
        
        const drop = async e => {
            const directionKey = direction.toLowerCase()
            const indexStart = handle.cell[directionKey]
            const cell = closest(e.target, `${this.tagName}-cell, ${this.tagName}-reorder-handle`) || previousCell
            previousCell = cell;
            
            if (cell && cell[directionKey] != indexStart) {
                const indexNew = cell[directionKey] > indexStart ? cell[directionKey] - 1 : cell[directionKey]
                const indexAnchor = cell[directionKey]
                const indexVector = indexStart < indexNew ? -1 : 1
                
                if (direction == "Column") {
                    this.querySelectorAll(`${this.tagName}-cell`).forEach(cell => {
                        if (Math.min(indexStart, indexNew) <= cell.column && cell.column <= Math.max(indexStart, indexNew)) {
                            const indexWas = cell.column
                            cell.classList.remove(`column-${indexWas}`)
                            if (indexWas == indexStart) {
                                cell.column = indexNew
                                insertBefore(cell.parentElement.children.item(indexAnchor - 1), cell)
                            } else {
                                cell.column += indexVector
                            }
                            cell.style.gridColumn = cell.column
                            cell.classList.add(`column-${cell.column}`)
                        }
                    })
                } else {
                    this.querySelectorAll(`${this.tagName}-row`).forEach(row => {
                        if (Math.min(indexStart, indexNew) <= row.row && row.row <= Math.max(indexStart, indexNew)) {
                            const indexWas = row.row
                            row.classList.remove(`row-${indexWas}`)
                            if (indexWas == indexStart) {
                                row.row = indexNew
                                insertBefore(row.parentElement.children.item(indexAnchor - 1), row)
                            } else {
                                row.row += indexVector
                            }
                            row.style.gridRow = row.row
                            row.classList.add(`row-${row.row}`)
                        }
                    })
                    this.querySelectorAll(`${this.tagName}-cell`).forEach(cell => {
                        cell.classList.remove(`row-${cell.row}`)
                        cell.row = cell.parentElement.row
                        cell.classList.add(`row-${cell.parentElement.row}`)
                    })
                }
                const template = this.style.getPropertyValue(`grid-template-${direction.toLowerCase()}s`) 
                if (template) {
                    const sizes = template.split(" ")
                    const indexSize = sizes[indexStart - 1]
                    sizes.splice(indexStart - 1, 1);
                    sizes.splice(indexNew - 1, 0, indexSize);
                    this.style.setProperty(`grid-template-${direction.toLowerCase()}s`, sizes.join(" "))
                }
                this.columns = translate(this.columns, indexStart - 1, indexNew - 1)
                
                this.trigger(`${direction.toLowerCase()}Reorder`, {
                    detail: {
                        to: indexNew - 1,
                        from: indexStart - 1
                    }
                }) 
            }
            
            this.querySelectorAll(`${this.cellTag}.selecting`).forEach(el => {
                el.classList.remove('selecting')
                el.classList.add('selected')
            })
        }
        
        const dragEnd = e => {
            const cell = previousCell || this.querySelector(`${this.tagName}-cell.selecting, ${this.tagName}-cell.selected`)
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
            max-block-size: 2em;
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
            pointer-events: none;
        }
        komp-spreadsheet-reorder-handle.reordering > svg {
            pointer-events: none;
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