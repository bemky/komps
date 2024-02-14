/*

Description
----
Render attributes of a collection as columns

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

defaultColSize:
    types: String
    description: Set the default size for columns
    default: max-content

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
    arguments: item:Object, columnModel:Object, dataGrid:DataGrid
    description: Render method for the cell
    
header:
    types: Function, String
    arguments: columnModel:Object, dataGrid:DataGrid
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

export default class DataGrid extends KompElement {
    static assignableAttributes = {
        data: [],
        defaultRowSize: 'min-content',
        defaultColSize: 'max-content'
    }
    static tagName = 'komp-data-grid'
    static columns = []
    
    constructor (options, ...args) {
        super(options, ...args)
        if (options.columns) {
            this.initColumns(options.columns)
        } else if (this.constructor.columns) {
            this.initColumns(options.constructor.columns)
        }
        this.columns
        this.render().then(this.setGrid.bind(this))
    }
    
    async render () {
        this.childNodes.forEach(child => child.remove())
        
        this.column.forEach(column => {
            
        })
        
        const row = createElement(`${this.tagName}-header`)
        this.append(row)
        this._columns.forEach((column, colIndex) => {
            append(row, this.renderHeader(column))
        })
        
        await this.data.forEach((item, rowIndex) => {
            const row = createElement(`${this.tagName}-row`, {style: {gridRow: `body ${rowIndex + 1}`}})
            this.append(row)
            this._columns.forEach((column, colIndex) => {
                const cell = this.renderCell(item, column)
                cell.render = () => {
                    content(cell, result(column, 'render', item))
                }
                row.append(cell)
                cell.render()
            })
        })
        
        return this;
    }
    
    setGrid () {
        const gridTemplateColumns = ['[handles] 0px']
        // TODO move handle to spreadsheet
        this._columns.forEach((column, colIndex) => {
            gridTemplateColumns.push(`[body] ${column.width || this.defaultColSize}`)
        })
        this.style.gridTemplateColumns = gridTemplateColumns.join(" ")
        
        this.style.gridTemplateRows = "[handles] 0px [header] min-content"
        this.data.forEach((item, rowIndex) => {
            // TODO move handle to spreadsheet
            this.style.gridTemplateRows = this.style.gridTemplateRows + ` [body] ${this.defaultRowSize}`
        })
        
        this.querySelectorAll(`${this.tagName}-header, ${this.tagName}-row`).forEach((row, rowIndex) => {
            let gridRow = `body ${rowIndex}`
            if (rowIndex == 0) {
                rowIndex = "header"
                gridRow = "header"
            }

            row.querySelectorAll(`${this.tagName}-cell`).forEach((cell, colIndex) => {
                cell.classList.remove(`col-${cell.colIndex}`, `row-${cell.rowIndex}`)
                cell.style.gridArea = [gridRow, `body ${colIndex + 1}`, gridRow, `body ${colIndex + 1}`].join(" / ")
                cell.colIndex = colIndex + 1
                cell.rowIndex = rowIndex
                cell.classList.add(`col-${cell.colIndex}`, `row-${cell.rowIndex}`)
            })
        })
    }
    
    removeRow(row) {
        Array.from(this.querySelectorAll(`${this.tagName}-cell`)).forEach(row => {
            removeCell(cell)
        })
    }
    
    removeCell (cell) {
        cell.remove()
    }
    
    removeColumn(index) {
        this._columns.splice(index, 1);
        this.querySelectorAll(`.col-${index}`).forEach(el => el.remove())
        this.setGrid()
    }
    
    addColumn(column, index) {
        this._columns.splice(this._columns.length, 0, this.initColumn(column.id, column))
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
        options.key = key
        let model = {
            id: key,
            render: this.defaultRender(key, options),
            header: this.defaultHeader(key, options)
        }
        
        if (isFunction(options)) {
            model.render = options
        } else if (Array.isArray(options)) {
            model = Object.assign(model, {render: options[0]}, options)
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
            --cell-padding: 0.5em 1em;
            display: grid;
        }
        ${this.tagName}-cell{
            padding: var(--cell-padding);
        }
        ${this.tagName}-row,
        ${this.tagName}-header {
            display: grid;
            grid-template-columns: subgrid;
            grid-template-rows: subgrid;
        }
        ${this.tagName}-row,
        ${this.tagName}-header {
            grid-area: header / body / header / -1
        }
    `}
}

window.customElements.define(DataGrid.localName, DataGrid);