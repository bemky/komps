/*

Description
----
A plugin to make [Table's](/table) columns and rows reorderable

Syntax
----
```javascript
import { reorderable } from 'komps/plugins'
Table.include(reorderable)
new Table({
    reorder: ['columns'],
    data: [...],
    columns: [...]
})
```

Example
----
<div class="pad-2x"></div>
<script>
    Table.include(window.plugins.reorderable)
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelector('div').append(new Table({
            class: 'rounded overflow-hidden',
            reorder: true,
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
                render: r => r.ops.toLocaleString().replace(/^0/, ''),
                header: 'OPS'
            }]
        }))
    });
</script>

Options
----
reorder:
    types: Boolean, String
    description: Enable ability to resize rows and columns. Pass "rows" or "columns" to reorder just one axis.
    default: true

Events
----
ColumnReorder:
    description: After a reorder finishes
    arguments: changes:Array

RowReorder:
    description: After a reorder finishes
    arguments: changes:Array

*/

import { createElement, listenerElement, insertBefore } from 'dolla';
import cellsDimensions from './cellsDimensions.js';
import { closest, translate, isFunction } from '../../../support.js';
import { handleIcon } from '../../../icons.js'

export default function (proto) {
    this.include(cellsDimensions)
    
    this.events.push('columnReorder', 'rowReorder')
    this.assignableAttributes.reorder = true
    
    const initializeWas = proto.initialize
    proto.initialize = function (...args) {
        if (this.reorder === true) {
            this.reorder = ['columns', 'rows']
        } else if (this.reorder === false) {
            this.reorder = []
        } else if (typeof this.reorder === "string") {
            this.reorder = [this.reorder]
        }
        this.addEventListenerFor(this.cellSelector, 'mouseover', () => {
            this.clearReorderHandles()
        })
        this.addEventListener('mouseleave', () => {
            this.clearReorderHandles()
        })
        this.addEventListenerFor('.reorderable', 'mouseover', e => {
            this.showReorderHandleFor(e.delegateTarget)
        });
        return initializeWas.call(this, ...args)
    }
    
    
    this.columnTypeRegistry.default.assignableAttributes.reorder = true

    const renderColumnHeaderWas = proto.renderColumnHeader
    proto.renderColumnHeader = function (column, ...args) {
        const cell = renderColumnHeaderWas.call(this, column, ...args)
        if (this.reorder.includes('columns') && column.reorder != false) {
            cell.classList.add('reorderable', 'reorderable-column')
        }
        return cell
    }
    
    const renderColumnCellWas = proto.renderColumnCell
    proto.renderColumnCell = async function (column, ...args) {
        const cell = await renderColumnCellWas.call(this, column, ...args)
        if (cell.cellIndex == 1 && this.reorder.includes('rows')) {
            cell.classList.add('reorderable', 'reorderable-row')
        }
        return cell
    }
    
    proto.clearReorderHandles = function () {
        if (this.reordering) { return }
        this.querySelectorAll(`${this.tagName}-reorder-handle`).forEach(x => x.remove())
    }
    
    proto.showReorderHandleFor = function (cell) {
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
                        'grid-column': cell.cellIndex,
                        'grid-row': cell.rowIndex
                    }
                }, 'dragstart', this.activateAxisReorder.bind(this))
                if (cell.classList.contains('frozen')) {
                    handle.classList.add(`frozen`, `frozen-${cell.cellIndex}`)
                }
                handle.cell = cell
                this.append(handle)
            }
        })
    }
    
    proto.activateAxisReorder = function (e) {
        this.reordering = true
        const handle = e.currentTarget
        const bb = this.getBoundingClientRect()
        let { direction, index, inverseDirection, axis, inlinePosition, inlineDimension, blockDimension } = handle.classList.contains('reorderable-row') ? {
            direction: 'Row',
            index: 'rowIndex',
            inverseDirection: 'Column',
            axis: 'y',
            inlinePosition: 'Top',
            inlineDimension: 'Height',
            blockDimension: 'Width'
        } : {
            direction: 'Column',
            index: 'cellIndex',
            inverseDirection: 'Row',
            axis: 'x',
            inlinePosition: 'Left',
            inlineDimension: 'Width',
            blockDimension: 'Height'
        }
        
        if (this.clearSelectedCells) this.clearSelectedCells()
        handle.cell[direction.toLowerCase()].cells.forEach(cell => {
            cell.classList.add('selecting')
            cell.cells.forEach(c => c.classList.add('selecting'))
        })
        
        handle.style.inlineSize = handle[`offset${inlineDimension}`] + "px"
        handle.style.insetInlineStart = handle[`offset${inlinePosition}`] + "px"
        handle.style.blockSize = this.cellsDimensions(blockDimension.toLowerCase()) + "px"
        handle.style.removeProperty('grid-area')
        handle.classList.add('reordering')
        
        e.dataTransfer.setDragImage(createElement(), 0, 0);
        
        const dragIndicator = createElement(`${this.constructor.tagName}-drag-indicator`, {
            class: direction.toLowerCase(),
            style: {
                'inset-inline-start': handle[`offset${inlinePosition}`] + "px",
                'block-size': this.cellsDimensions(blockDimension.toLowerCase()) + "px"
            }
        })
        this.append(dragIndicator)

        const selectors = this.cellSelector.split(", ").map(selector => selector + `.reorderable-${direction.toLowerCase()}`)

        let previousCell;
        const dragOver = e => {
            e.preventDefault()
            const cell = closest(e.target, `${selectors.join(",")}, ${this.tagName}-reorder-handle`) || previousCell
            previousCell = cell;
            
            let newPosition = e[axis] - bb[inlinePosition.toLowerCase()] - (handle[`offset${inlineDimension}`] / 2) + this[`scroll${inlinePosition}`]
            newPosition = newPosition < 0 ? 0 : newPosition
            newPosition = newPosition > this[`scroll${inlineDimension}`] - handle[`offset${inlineDimension}`] ? this[`scroll${inlineDimension}`] - handle[`offset${inlineDimension}`] : newPosition
            handle.style.insetInlineStart = newPosition + "px"
            if (cell) {
                const newIndex = cell[index]
                dragIndicator.style.insetInlineStart = cell[`offset${inlinePosition}`] + "px"
            }
            this.reordering = false
        }
        
        const drop = async e => {
            const indexStart = handle.cell[index]
            const cell = closest(e.target, `${selectors.join(",")}, ${this.tagName}-reorder-handle`) || previousCell
            previousCell = cell;
            
            if (cell && cell[index] != indexStart) {
                const indexNew = cell[index] > indexStart ? cell[index] - 1 : cell[index]
                const indexAnchor = cell[index]
                const indexVector = indexStart < indexNew ? -1 : 1
                
                if (direction == "Column") {
                    this.header.cells.forEach(cell => {
                        if (Math.min(indexStart, indexNew) <= cell.cellIndex && cell.cellIndex <= Math.max(indexStart, indexNew)) {
                            if (cell.cellIndex == indexStart) {
                                cell.column.index = indexNew
                                insertBefore(cell.row.children.item(indexAnchor - 1), cell)
                                cell.column.cells.forEach(cell => {
                                    insertBefore(cell.row.children.item(indexAnchor - 1), cell)
                                })
                            } else {
                                cell.column.index += indexVector
                            }
                        }
                    })
                    this.columns = translate(this.columns, indexStart - 1, indexNew - 1)
                    this.setTemplateColumns()
                } else {
                    this.rows.forEach(row => {
                        if (Math.min(indexStart, indexNew) <= row.rowIndex && row.rowIndex <= Math.max(indexStart, indexNew)) {
                            if (row.rowIndex == indexStart) {
                                row.rowIndex = indexNew
                                insertBefore(row.parentElement.children.item(indexAnchor - 1), row)
                            } else {
                                row.rowIndex += indexVector
                            }
                        }
                    })
                }
                
                this.trigger(`${direction.toLowerCase()}Reorder`, {
                    detail: {
                        fromIndex: indexStart - 1,
                        toIndex: indexNew - 1
                    }
                }) 
            }
            
            this.queryCells('.selecting').forEach(el => {
                el.classList.remove('selecting')
                el.classList.add('selected')
            })
        }
        
        const dragEnd = e => {
            const cell = previousCell || this.queryCell('.selecting, .selected')
            dragIndicator.remove()

            handle.style.removeProperty('inline-size')
            handle.style.removeProperty('inset-inline-start')
            this.showReorderHandleFor(cell)
            this.queryCells('.selecting').forEach(el => {
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
    
    let styleWas = this.style
    if (isFunction(styleWas)) { styleWas = styleWas.call(this) }
    this.style = function () {
        return styleWas + `
            ${this.tagName} {
                --select-color: #1a73e8;
                --handle-size: 10px;
            }
            ${this.tagName}-reorder-handle {
                position: sticky;
                inset-block-start: 0;
                pointer-events: none;
            }
            ${this.tagName}-reorder-handle.reorderable-row {
                writing-mode: vertical-lr;
            }
            ${this.tagName}-reorder-handle > svg {
                pointer-events: auto;
                inline-size: 100%;
                block-size: var(--handle-size);
                display: flex;
                cursor: grab;
                justify-content: center;
                padding-block: 4px;
            }
            ${this.tagName}-reorder-handle > svg:hover {
                background: rgba(26, 115, 232, 0.1);
            }
            ${this.tagName}-reorder-handle.reordering {
                position: absolute;
                background: rgba(0,0,0, 0.2);
                block-size: 100%;
                pointer-events: none;
                cursor: grabbing;
                pointer-events: none;
            }
            ${this.tagName}-reorder-handle.reordering > svg {
                pointer-events: none;
            }

            ${this.tagName}-drag-indicator {
                pointer-events: none;
                position: absolute;
                block-size: 100%;
                inline-size: 3px;
                inset-block-start: 0;
                background: var(--select-color);
                z-index: 200;
            }
            ${this.tagName}-drag-indicator.row {
                writing-mode: vertical-lr;
            }
        `
    }
}