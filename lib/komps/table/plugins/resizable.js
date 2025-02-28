/*

Description
----
A plugin to make [Table's](/table) columns and rows resizable

Syntax
----
```javascript
import { resizable } from 'komps/plugins'
Table.include(resizable)
new Table({
    resize: ['columns'],
    data: [...],
    columns: [...]
})
```

Example
----
<div class="pad-2x"></div>
<script>
    Table.include(window.plugins.resizable)
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelector('div').append(new Table({
            class: 'rounded overflow-hidden',
            resize: true,
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
resize:
    types: Boolean, String
    description: Enable ability to resize rows and columns. Pass "rows" or "columns" to reorder just one axis.
    default: true
resizeMin:
    types: Number
    description: minimum number of pixels for a column
    default: 5

Events
----
ColumnResize:
    description: After a resize finishes
    arguments: changes:Array

RowResize:
    description: After a resize finishes
    arguments: changes:Array

*/

import { createElement, listenerElement } from 'dolla';
import { uniq, isFunction } from '../../../support.js';
import cellsDimensions from './cellsDimensions.js';

export default function (proto) {
    this.include(cellsDimensions)
    
    this.events.push('columnResize', 'rowResize')
    this.assignableAttributes.resize = true
    this.assignableAttributes.resizeMin = 5
    
    
    const initializeWas = proto.initialize
    proto.initialize = function (...args) {
        if (this.resize === true) {
            this.resize = ['columns', 'rows']
        } else if (this.resize === false) {
            this.resize = []
        } else if (typeof this.resize === "string") {
            this.resize = [this.resize]
        }
        this.addEventListenerFor(this.cellSelector, 'mouseover', () => {
            this.clearResizeHandles()
        })
        this.addEventListener('mouseleave', () => {
            this.clearResizeHandles()
        })
        this.addEventListenerFor('.resizable', 'mouseover', e => {
            this.showResizeHandleFor(e.delegateTarget)
        });
        return initializeWas.call(this, ...args)
    }
    
    this.columnTypeRegistry.default.assignableAttributes.resize = true
    
    const renderColumnHeaderWas = proto.renderColumnHeader
    proto.renderColumnHeader = function (column, ...args) {
        const cell = renderColumnHeaderWas.call(this, column, ...args)
        if (this.resize.includes('columns') && column.resize != false) {
            cell.classList.add('resizable', 'resizable-column')
        }
        return cell
    }
    
    proto.clearResizeHandles = function () {
        if (this.resizing) { return }
        this.querySelectorAll(`${this.tagName}-resize-handle`).forEach(x => x.remove())
    }
    
    proto.showResizeHandleFor = function (cell) {
        if (this.resizing) { return }
        this.clearResizeHandles()

        const axises = ['column', 'row']
        axises.forEach(axis => {
            if (cell.classList.contains(`resizable-${axis}`)) {
                const handle = listenerElement(`${this.tagName}-resize-handle`, {
                    class: `resizable-${axis}`,
                    content: [{ tag: 'handle-start' }, { tag: 'handle-end' }],
                    style: {
                        'grid-column': cell.cellIndex,
                        'grid-row': cell.rowIndex
                    }
                }, 'pointerdown', this.activateAxisResize.bind(this))
                if (cell.classList.contains('frozen')) {
                    handle.classList.add(`frozen`, `frozen-${cell.cellIndex}`)
                }
                const axisTarget = axis == 'column' ? cell : cell.row;
                if (!axisTarget.previousElementSibling || !axisTarget.previousElementSibling.classList.contains(`resizable-${axis}`)) {
                    handle.querySelector('handle-start').remove()
                }
                handle.cell = cell
                this.append(handle)
            }
        })
    }
    
    proto.activateAxisResize = function (e) {
        this.setPointerCapture(e.pointerId)
        this.resizing = true
        const handle = e.target.parentElement
        const bb = this.getBoundingClientRect()
        
        let target = handle.cell
        
        if (e.target.localName == "handle-start") {
            if (handle.classList.contains('resizable-row')) {
                target = this.at(target.cellIndex, target.rowIndex - 1)
            } else {
                target = target.previousElementSibling
            }
        }
        let { direction, axis, axisMin, axisMax, offset, slice, start, blockDimension, inlineDimension, inlinePosition, index } = handle.classList.contains('resizable-row') ? {
            direction: 'Row',
            axis: 'y',
            axisMin: target.offsetTop + this.resizeMin,
            axisMax: this.scrollHeight,
            offset: this.scrollTop - bb.top,
            slice: target.row,
            start: e.y - target.offsetHeight,
            blockDimension: 'width',
            inlineDimension: 'height',
            inlinePosition: 'Top',
            index: 'rowIndex'
        } : {
            direction: 'Column',
            axis: 'x',
            axisMin: target.offsetLeft + this.resizeMin,
            axisMax: this.scrollWidth,
            offset: this.scrollLeft - bb.left,
            slice: target.column,
            start: e.x - target.offsetWidth,
            blockDimension: 'height',
            inlineDimension: 'Width',
            inlinePosition: 'Left',
            index: 'cellIndex'
        }
        this.classList.add('resizing-' + direction.toLowerCase())
        
        
        const selectedCells = Array.from(this.querySelectorAll(`${this.constructor.Header.tagName} > .selected`))
        let slices;
        if (selectedCells.includes(target)) {
            slices = uniq(selectedCells.map(cell => direction == 'Column' ? cell.column : cell.row))
        } else {
            if (this.clearSelectedCells) this.clearSelectedCells()
            if (this.selectCells) this.selectCells(target)
            slices = [slice]
        }
        
        const dragIndicator = createElement(`${this.constructor.tagName}-drag-indicator`, {
            class: direction.toLowerCase(),
            style: {
                'inset-inline-start': e[axis] + offset + "px",
                'block-size': this.cellsDimensions(blockDimension) + "px"
            }
        })
        this.append(dragIndicator)
        
        function mouseMove (e) {
            let target = e[axis] + offset
            target = Math.max(target, axisMin)
            target = Math.min(target, axisMax)
            dragIndicator.style.insetInlineStart = target + "px"
        }
        this.addEventListener('pointermove', mouseMove)
        this.addEventListener('pointerup', e => {
            let delta = e[axis] - start;
            delta = Math.max(delta, this.resizeMin)
            slices.forEach(slice => {
                slice[inlineDimension.toLowerCase()] = delta + "px"
            })
            
            this.trigger(`${direction.toLowerCase()}Resize`, {
                detail: {[direction.toLowerCase() + "s"]: slices}
            })
            
            dragIndicator.remove()
            this.removeEventListener('pointermove', mouseMove)
            this.resizing = false
            this.classList.remove('resizing-' + direction.toLowerCase())
            this.releasePointerCapture(e.pointerId)
        }, {once: true})
    }
    
    if (!Array.isArray(this.style)) {
        this.style = [this.style]
    }
    this.style.push(() => `
        ${this.tagName} {
            --select-color: #1a73e8;
            --handle-size: 10px;
        }
        ${this.tagName}.resizing-column,
        ${this.tagName}.resizing-row {
            user-select: none;
            -webkit-user-select: none;
        }
        ${this.tagName}.resizing-column {
            cursor: col-resize !important;
        }
        ${this.tagName}.resizing-row {
            cursor: row-resize !important;
        }
        ${this.tagName}.resizing-row komp-spreadsheet-header-cell,
        ${this.tagName}.resizing-row komp-spreadsheet-cell {
            cursor: row-resize !important;
        }
        
        ${this.tagName}-header,
        ${this.tagName}-cell {
            user-select: none;
            -webkit-user-select: none;
        }
        ${this.tagName}-resize-handle {
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
        ${this.tagName}-resize-handle.resizable-row {
            writing-mode: vertical-lr;
            cursor: row-resize;
        }
        ${this.tagName}-resize-handle handle-start,
        ${this.tagName}-resize-handle handle-end {
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
        ${this.tagName}-resize-handle handle-start {
            grid-column: 1;
            inset-inline-start: -6px;
        }
        ${this.tagName}-resize-handle handle-end {
            grid-column: 2;
            inset-inline-end: -6px;
        }
        ${this.tagName}-resize-handle handle-start:hover,
        ${this.tagName}-resize-handle handle-end:hover {
            opacity: 1;
            border-color: var(--select-color);
        }

        ${this.tagName}-drag-indicator {
            pointer-events: none;
            position: absolute;
            block-size: 100%;
            inline-size: 3px;
            inset-block-start: 0;
            background: var(--select-color);
        }
        ${this.tagName}-drag-indicator.row {
            writing-mode: vertical-lr;
        }
        ${this.tagName}-resize-handle      { z-index: 200; }
        ${this.tagName}-drag-indicator     { z-index: 200; }
    `)
}