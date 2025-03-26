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
import { closest, translate, isFunction, uniq } from '../../../support.js';
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
    
    const _renderCell = this.columnTypeRegistry.default.prototype.renderCell
    this.columnTypeRegistry.default.prototype.renderCell = async function (...args) {
        const cell = await _renderCell.call(this, ...args)
        if (this.table.reorder.includes('rows')) {
            cell.classList.toggle('reorderable', cell.cellIndex == 1)
            cell.classList.add('reorderable-row')
        }
        if (this.table.reorder.includes('columns') && this.reorder != false) {
            cell.classList.add('reorderable-column')
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
                    content: handleIcon({horizontal: axis == 'row'}),
                    style: {
                        'grid-column': cell.cellIndex,
                        'grid-row': cell.rowIndex
                    }
                }, 'pointerdown', this.activateAxisReorder.bind(this))
                if (cell.classList.contains('frozen')) {
                    handle.classList.add(`frozen`, `frozen-${cell.cellIndex}`)
                }
                handle.cell = cell
                this.append(handle)
            }
        })
    }
    
    proto.activateAxisReorder = function (e) {
        this.setPointerCapture(e.pointerId)
        const root = this.getRootNode()
        this.reordering = true
        this.classList.add('reordering')
        const handle = e.currentTarget
        let target = handle.cell
        const bb = this.getBoundingClientRect()
        let { 
            slice, direction, index, sliceIndex, inverseDirection, axis,
            inlinePosition, inlineDimension, blockDimension
        } = handle.classList.contains('reorderable-row') ? {
            slice: target.row,
            direction: 'Row',
            index: 'rowIndex',
            sliceIndex: 'rowIndex',
            inverseDirection: 'Column',
            axis: 'y',
            inlinePosition: 'Top',
            inlineDimension: 'Height',
            blockDimension: 'Width'
        } : {
            slice: target.column,
            direction: 'Column',
            index: 'cellIndex',
            sliceIndex: 'index',
            inverseDirection: 'Row',
            axis: 'x',
            inlinePosition: 'Left',
            inlineDimension: 'Width',
            blockDimension: 'Height'
        }
        
        let slices;
        let selectedCells;
        if (this.selectedCells) {
            selectedCells = Array.from(this.querySelectorAll(`${this.constructor.Header.tagName} > .selected`))
        }
        
        if (selectedCells && selectedCells.includes(target)) {
            slices = uniq(selectedCells.map(cell => direction == 'Column' ? cell.column : cell.row))
            let last = slices[0]
            slices = slices.filter((slice, i) => {
                if (slice[sliceIndex] - last[sliceIndex] <= 1) {
                    last = slice
                    return true
                }
                return false
            })
        } else {
            slices = [slice]
        }
        if (this.clearSelectedCells) this.clearSelectedCells()
        slices.forEach(s => s.cells.forEach(c => {
            c.classList.add('selected')
            c.cells.forEach(c => c.classList.add('selected'))
        }))
        if (this.selectedCells) {
            this.outlineCells(this.selectedCells())
        }
        
        const indexStart = Math.min(...slices.map(s => s[sliceIndex]))

        handle.style.inlineSize = slices.map(s => s[`offset${inlineDimension}`]).reduce((t, x) => t + x) + "px"
        handle.style.blockSize = this.cellsDimensions(blockDimension.toLowerCase()) + "px"
        handle.style.insetInlineStart = handle[`offset${inlinePosition}`] + "px"
        handle.style.removeProperty('grid-area')
        handle.classList.add('reordering')
        
        const placementIndicator = createElement(`${this.constructor.tagName}-placement-indicator`, {
            class: direction.toLowerCase(),
            style: {
                [`grid-${direction.toLowerCase()}`]: indexStart
            }
        })
        placementIndicator[index] = indexStart
        this.append(placementIndicator)
        
        
        const selectors = this.cellSelector.split(", ").map(selector => selector + `.reorderable-${direction.toLowerCase()}`)
        let previousCell;
        let scrolling = false
        const pointerMove = e => {
            const cell = root.elementsFromPoint(e.x, e.y).find(el => el.matches(selectors.join(','))) || previousCell
            previousCell = cell;
           
            let newPosition = e[axis] - bb[inlinePosition.toLowerCase()] - (handle[`offset${inlineDimension}`] / 2) + this[`scroll${inlinePosition}`]
            newPosition = newPosition < 0 ? 0 : newPosition
            newPosition = newPosition > this[`scroll${inlineDimension}`] - handle[`offset${inlineDimension}`] ? this[`scroll${inlineDimension}`] - handle[`offset${inlineDimension}`] : newPosition
            handle.style.insetInlineStart = newPosition + "px"
            if (cell) {
                const indexNew = cell[index] + (indexStart < cell[index] ? 1 : 0)
                if (placementIndicator[index] != indexNew) {
                    if (scrolling) return
                    let start = this[`scroll${inlinePosition}`]
                    if (!handle.cell.frozen && this.frozenLeft && direction == "Column") {
                        start = start + this.frozenLeft
                    }
                    start = start + this[`client${inlineDimension}`] * 0.05
                    const end = this[`scroll${inlinePosition}`] + this[`client${inlineDimension}`] * 0.95
                    
                    if (cell[`offset${inlinePosition}`] + cell[`offset${inlineDimension}`] > end) {
                        scrolling = true
                        this.scrollBy({[inlinePosition.toLowerCase()]: cell[`offset${inlineDimension}`]})
                    } else if (cell[`offset${inlinePosition}`] < start) {
                        scrolling = true
                        this.scrollBy({[inlinePosition.toLowerCase()]: cell[`offset${inlineDimension}`] * -1})
                    }
                    if (scrolling) {
                        setTimeout(() => scrolling = false, 100)
                    }
                }
                placementIndicator[index] = indexNew
                placementIndicator.style[`grid-${direction.toLowerCase()}`] = indexNew
            }
        }
        
        this.addEventListener('pointermove', pointerMove)
        this.addEventListener('pointerup', async e => {
            if (placementIndicator[index] != indexStart) {
                // If going up, then remove slices.length for the shuffle down of the ones clamped by start/end
                let indexNew = placementIndicator[index] - (indexStart < placementIndicator[index] ? slices.length : 0)
                
                if (direction == "Column") {
                    this.columns.splice(indexStart - 1, slices.length)
                    await this.insertColumns(indexNew, ...slices)
                } else {
                    slices.forEach(s => s.remove())
                    await this.appendRow(indexNew, ...slices)
                }

                this.trigger(`${direction.toLowerCase()}Reorder`, {
                    detail: {
                        fromIndex: indexStart - 1,
                        toIndex: indexNew - 1
                    }
                })
            }
            
            if (this.selectedCells) {
                this.clearOutlines()
                this.outlineCells(this.selectedCells())
            }


            placementIndicator.remove()
            this.removeEventListener('pointermove', pointerMove)
            
            // kick the finalization of this to end of event stack,
            // other events like, 'click' on a button inside the header were firing on mouseup from resize
            setTimeout(() => {
                this.classList.remove('reordering')
                this.reordering = false
                this.showReorderHandleFor(handle.cell)
                this.releasePointerCapture(e.pointerId)
            })
            
        }, {once: true})
    }
    
    if (!Array.isArray(this.style)) {
        this.style = [this.style]
    }
    this.style.push(() => `
        ${this.tagName} {
            --select-color: #1a73e8;
            --handle-size: 10px;
            user-select: none;
        }
        ${this.tagName}.reordering {
            cursor: grabbing !important;
            user-select: none;
            -webkit-user-select: none;
        }
        ${this.tagName}.reordering komp-spreadsheet-header-cell,
        ${this.tagName}.reordering komp-spreadsheet-cell {
            cursor: grabbing !important;
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

        ${this.tagName}-placement-indicator {
            position: relative;
            inset-inline-start: -2px;
            pointer-events: none;
            inline-size: 3px;
            background: var(--select-color);
            z-index: 200;
            grid-row: 1 / -1;
        }
        ${this.tagName}-placement-indicator.row {
            writing-mode: vertical-lr;
            grid-column: 1 / -1;
        }
        ${this.tagName}-reorder-handle     { z-index: 200; }
    `)
}