/*

Description
----
Render a collection as rows with defined columns

Syntax
----
HTML
```html
<komp-data-table>
    <row>
        <cell>Name</cell>
        <cell>Team</cell>
        <cell>AVG</cell>
        <cell>OPS</cell>
    </row>
    <row>
        <cell>Corey Seager</cell>
        <cell>Texas Rangers</cell>
        <cell>.311</cell>
        <cell>1.023</cell>
    </cell>
</komp-data-table>
```

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

Methods
----
### `render()`
Emptys contents and renders rows

Options
----
data: 
    types: Array
    description: Each item of the array generates a row by passing the item to each render method of the defined columns
    
columns:
    types: Object, Array
    description: See Column Options

Column Options
----
Columns can be modeled as an Array or an Object. If Object, key will be used as an id on the column model.

```
[function]
[ {render: function, ...options} ]
[ [function, {...options}] ]
{ id1: function }
{ id1: [function, {...options}] }
{ id1: {render: function, ...options} }
```

render: 
    types: Function
    arguments: item:Object, columnModel:Object, table:DataTable
    description: Render method for the cell
    
header:
    types: Function, String
    arguments: columnModel:Object, table:DataTable
    description: Render method for the header

*/

// TODO: use data html attribute

import { createElement, remove, append } from 'dolla';

import { isFunction, result } from '../support.js'
import KompElement from './element.js';

export default class DataTable extends KompElement {
    static assignableAttributes = ['data', 'columns']
    static tagName = 'komp-data-table'
    _columns = []
    
    static style = function() { return `
        ${this.tagName} {
            display: grid;
        }
        ${this.tagName}-row {
            display: contents;
        }
    `}
    
    constructor (options, ...args) {
        super(options, ...args)
        if (this.columns) {
            this.initColumns(this.columns)
        }
        if (!this.data) {this.data = []}
    }
    
    connected () {
        if (Object.keys(this._columns).length == 0) {
            setTimeout(() => {
                const header = remove(this.firstElementChild)
                const columns = {}
                Array.from(header.children).forEach(cell => {
                    columns[cell.innerText] = {}
                })
                this.initColumns(columns)
                const headers = Object.keys(columns)
                
                if (this.data.length == 0) {
                    Array.from(this.children).forEach(row => {
                        const item = {}
                        this.data.push(item)
                        Array.from(row.children).forEach((cell, index) => {
                            item[headers[index]] = cell.innerText
                        })
                    })
                }
                
                this.render()
            }, 0)
        } else {
            this.render()
        }
    }
    
    render () {
        this.innerHTML = '';
        
        const template = []
        const row = createElement(`${this.tagName}-row`)
        this.append(row)
        this._columns.forEach(column => {
            append(row, this.renderHeader(column))
            template.push('1fr')
        })
        
        this.style.gridTemplateColumns = template.join(" ")
        
        this.data.forEach(item => {
            const row = createElement(`${this.tagName}-row`)
            this.append(row)
            this._columns.forEach(column => row.append(this.renderCell(item, column)))
        })
        
        return this;
    }
    
    renderHeader (column) {
        return createElement(`${this.tagName}-cell`, {
            class: 'komp-header',
            content: result(column, 'header')
        })
    }
    
    renderCell (item, column) {
        return createElement(`${this.tagName}-cell`, {
            content: result(column, 'render', item)
        })
    }
    
    
    initColumns (columns) {
        return this._columns = Object.keys(columns).map(key => this.initColumn(key, columns[key]))
    }
    
    initColumn (key, options) {
        let model = {
            id: key,
            render: this.defaultRender(key),
            header: this.defaultHeader(key)
        }
        if (isFunction(options)) {
            model.render = options
        } else if (Array.isArray(options)) {
            model = Object.assign(model, {render: options[0]}, options)
        } else if (typeof options == "object") {
            model = Object.assign(model, options)
        } else {
            model.render = this.defaultRender(key)
        }
        return model
    }
    
    defaultHeader (key) {
        return key
    }
    
    defaultRender (key) {
        return r => r[key]
    }
}
window.customElements.define(DataTable.tagName, DataTable);