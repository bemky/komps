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
    description: Each item of the array generates a row by passing the item to each render method of the defined columns. Uses calls `forEach` on object, so can use with any Enumerable-ish object.
    
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
    arguments: item:Object, cell:Element, columnConfiguration:Object, grid:dataGrid
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
        defaultColSize: 'max-content'
    }
    
    static tagName = 'komp-data-grid'
    
    initialize (...args) {
        const result = super.initialize(...args)
        
        this.append(this.renderHeader())
        this.append(...this.renderRows())
        
        return result
    }
    
    renderHeader () {
        const row = createElement(`${this.tagName}-header`, {
            style: { gridRow: 1 },
            content: this.columns.map((column, index) => {
                return this.renderHeaderCell(column, index + 1)
            })
        })
        this.style.gridTemplateColumns = this.columns.map(column => column.width || `${this.defaultColSize}`).join(" ")
        return row
    }
    
    renderHeaderCell (column, index) {
        return createElement(`${this.tagName}-cell`, {
            style: { gridColumn: index },
            content: result(column, 'header')
        })
    }
    
    resetRows () {
        this.querySelectorAll(`${this.tagName}-row`).forEach(row => row.remove())
        this.append(...this.renderRows())
    }
    
    renderRows () {
        return this.data.map((item, rowIndex) => this.renderRow(item, rowIndex + 2))
    }
    
    renderRow (item, index) {
        return createElement(`${this.tagName}-row`, {
            style: { gridRow: index },
            content: this.columns.map((column, colIndex) => {
                return this.renderCell(item, column, colIndex + 1, index)
            })
        })
    }
    
    renderCell (item, column, index) {
        return createElement(`${this.tagName}-cell`, Object.assign({
            style: { gridColumn: index },
            content: result(column, 'render', item, column, index)
        }, column))
    }
    
    static style = function() { return `
        ${this.tagName} {
            display: inline-grid;
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