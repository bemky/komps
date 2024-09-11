/*

Description
----
Render a collection as rows with defined columns using [CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)

Syntax
----
JS
```javascript
new DataGrid({
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
<div class="pad-2x"></div>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelector('div').append(new DataGrid({
            class: 'rounded overflow-hidden',
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
                header: 'OPS',
                width: '10%'
            }]
        }))
    });
</script>

Options
----
data: 
    types: Array
    description: Each record of the array generates a row by passing the record to each render method of the defined columns. Uses calls `forEach` on object, so can use with any Enumerable-ish object.
    
columns:
    types: Array
    description: Array of objects that define the configuration of each column. See Column Options

defaultColSize:
    types: String
    description: Set the default size for columns
    default: max-content

Column Options
----
```javascript
{
    render: player => player.height,
    header: 'Player Height'
}
```

render: 
    types: Function
    arguments: record:Object, cell:Element, columnConfiguration:Object, grid:dataGrid
    description: Render method for the cell
    
header:
    types: Function, String
    arguments: columnConfiguration:Object, grid:DataGrid
    description: Render method for the header

width:
    types: String
    description: Valid value for [css grid template](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns) (i.e. px, percent, min-content...)

Events
----

*/

import { createElement, listenerElement, remove, append, content } from 'dolla';

import { isFunction, result, except } from '../support.js'
import KompElement from './element.js';

export default class DataGrid extends KompElement {
    
    static assignableAttributes = {
        data: [],
        columns: [],
        defaultColSize: 'max-content',
        defaultRowSize: 'max-content'
    }
    
    static tagName = 'komp-data-grid'
    
    initialize (...args) {
        const result = super.initialize(...args)
        this.render()
        return result
    }
    
    render () {
        append(this, this.renderHeader())
        append(this, this.renderRows())
    }
    
    async renderHeader () {
        const columns = await this.columns
        const row = createElement(`${this.tagName}-header`, {
            style: { 'grid-row': 1 },
            content: columns.map((column, index) => {
                return this.renderHeaderCell(column, index + 1)
            })
        })
        this.style.gridTemplateColumns = columns.map(column => {
            return column.width || `${this.defaultColSize}`
        }).join(" ")
        return row
    }
    
    createHeaderCell (column, index) {
        return createElement(`${this.tagName}-cell`)
    } 
    
    renderHeaderCell (column, index) {
        const cell = this.createHeaderCell(column, index)
        cell.style.gridColumn = index
        content(cell, result(column, 'header'))
        return cell
    }
    
    resetRows () {
        this.querySelectorAll(`${this.tagName}-row`).forEach(row => row.remove())
        this.append(...this.renderRows())
    }
    
    async renderRows () {
        const rows = await (await this.data).map((record, rowIndex) => this.renderRow(record, rowIndex + 2))
        this.style.gridTemplateRows = rows.map(row => row.height || `${this.defaultRowSize}`).join(" ")
        return rows
    }
    
    async renderRow (record, index) {
        return createElement(`${this.tagName}-row`, {
            style: { 'grid-row': index },
            content: (await this.columns).map((column, colIndex) => {
                return this.renderCell(record, column, colIndex + 1, index)
            })
        })
    }
    
    createCell (record, column, index) {
        return createElement(`${this.tagName}-cell`, Object.assign({
            content: result(column, 'render', record, column, index)
        }, column))
    }
    
    renderCell (record, column, index, ...args) {
        const cell = this.createCell(record, column, index, ...args)
        cell.style.setProperty('grid-column', index)
        if (column.class) {
            cell.classList.add(...column.class.split(" "))
        }
        return cell
    }
    
    static style = function() { return `
        ${this.tagName} {
            display: inline-grid;
            align-content: start;
        }
        ${this.tagName}-header,
        ${this.tagName}-row,
        ${this.tagName}-handles {
            display: contents;
        }
        ${this.tagName}-cell {
            grid-row: inherit;
        }
    `}
}

window.customElements.define(DataGrid.tagName, DataGrid);