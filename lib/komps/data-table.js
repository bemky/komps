/*

Description
----
Render a collection as rows with defined columns

Syntax
----
JS
```javascript
new DataTable({
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
        document.querySelector('div').append(new DataTable({
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
        }))
    });
</script>

Options
----
data: 
    types: Array, Enumberable-ishObject
    description: Each item of the array generates a row by passing the item to each render method of the defined columns. Uses calls `forEach` on object, so can use with any Enumerable-ish object.
    
columns:
    types: Object, Array
    description: See Column Options

defaultRowSize:
    types: String
    description: Set the default size for rows
    default: min-content

Column Options
----
Columns can be modeled as an Array or an Object. If Object, key will be used as an id on the column model.

```javascript
{
    render: player => player.height,
    header: 'Player Height',
    frozen: true
}
```

render: 
    types: Function
    arguments: item:Object, columnModel:Object, table:DataTable
    description: Render method for the cell
    
header:
    types: Function, String
    arguments: columnModel:Object, table:DataTable
    description: Render method for the header

width:
    types: String
    description: Valid value for [css grid template](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns) (i.e. px, percent, min-content...)

Events
----

*/

import { createElement, remove, append, content } from 'dolla';

import { isFunction, result, except } from '../support.js'
import KompElement from './element.js';

export default class DataTable extends KompElement {
    static assignableAttributes = {
        data: [],
        columns: [],
        defaultRowSize: 'min-content'
    }
    static tagName = 'komp-data-table'
    static columns = []
    _columns = []
    
    constructor (options, ...args) {
        super(options, ...args)
        if (this.columns) {
            this.initColumns(this.columns)
        } else if (this.constructor.columns) {
            this.initColumns(this.constructor.columns)
        }
        if (!this.data) {this.data = []}
        this.render()
    }
    
    render () {
        
        Array.from(this.querySelectorAll(`${this.tagName}-row`)).forEach(row => {
            removeRow(row)
        })
        
        // TODO move handle to spreadsheet
        const gridTemplateColumns = ['[handles] 0px']
        const row = createElement(`${this.tagName}-row`)
        this.append(row)
        this._columns.forEach((column, colIndex) => {
            const cell = this.renderHeader(column)
            cell.style.gridArea = ['header', `body ${colIndex + 1}`, 'header', `body ${colIndex + 1}`].join(" / ")
            cell.colIndex = colIndex + 1
            cell.rowIndex = 'header'
            cell.classList.add(`col-${cell.colIndex}`, 'row-header')
            append(row, cell)
            gridTemplateColumns.push(column.width || '[body] max-content')
        })
        
        this.style.gridTemplateColumns = gridTemplateColumns.join(" ")
        
        this.style.gridTemplateRows = "[handles] 0px [header] min-content"
        this.data.forEach((item, rowIndex) => {
            // TODO move handle to spreadsheet
            this.style.gridTemplateRows = this.style.gridTemplateRows + ` [body] ${this.defaultRowSize}`
            const row = createElement(`${this.tagName}-row`)
            this.append(row)
            this._columns.forEach((column, colIndex) => {
                const cell = this.renderCell(item, column, {
                    style: {
                        gridArea: [`body ${rowIndex + 1}`, `body ${colIndex + 1}`, `body ${rowIndex + 1}`, `body ${colIndex + 1}`].join(" / ")
                    }
                })
                cell.style.gridArea = 
                cell.render = () => {
                    content(cell, result(column, 'render', item))
                }
                cell.colIndex = colIndex + 1
                cell.rowIndex = rowIndex + 1
                cell.classList.add(`col-${cell.colIndex}`, `row-${cell.rowIndex}`)
                row.append(cell)
                cell.render()
            })
        })
        
        return this;
    }
    
    removeRow(row) {
        Array.from(this.querySelectorAll(`${this.tagName}-cell`)).forEach(row => {
            removeCell(cell)
        })
    }
    
    removeCell (cell) {
        cell.remove()
    }
    
    renderHeader (column) {
        return createElement(`${this.tagName}-cell`, {
            class: 'header',
            content: result(column, 'header')
        })
    }
    
    renderCell (item, column, options) {
        return createElement(`${this.tagName}-cell`, Object.assign({}, column, options))
    }
    
    initColumns (columns) {
        return this._columns = Object.keys(columns).map(key => this.initColumn(key, columns[key]))
    }
    
    initColumn (key, options) {
        let model = {
            id: key,
            render: this.defaultRender(key, options),
            header: this.defaultHeader(key, options)
        }
        
        if (isFunction(options)) {
            model.render = options
        } else if (Array.isArray(options)) {
            model = Object.assign(model, {render: options[0]}, except(options, 'header', 'render'))
        } else if (typeof options == "object") {
            model = Object.assign(model, except(options, 'header', 'render'))
        } else {
            model.render = this.defaultRender(key, options)
        }
        return model
    }
    
    defaultHeader (key) {
        return key
    }
    
    defaultRender (key) {
        return r => r[key]
    }
    
    static style = function() { return `
        ${this.tagName} {
            display: grid;
        }
        ${this.tagName}-cell{
            padding: var(--cell-padding);
        }
        ${this.tagName}-row {
            display: contents;
        }
    `}
}

window.customElements.define(DataTable.tagName, DataTable);