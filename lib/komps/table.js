/*

Description
----
Render a table of records by configured columns using [CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)

Syntax
----
```javascript
new Table({
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
data: 
    types: Array
    description: Each record of the array generates a row by passing the record to each render method of the defined columns. Uses calls `forEach` on object, so can use with any Enumerable-ish object.
    
columns:
    types: Array
    description: Array of objects that initialize [Columns](/table/column) that manage the rendering of [Cells](/table/cell)

Events
----

*/

import { createElement, listenerElement, remove, append, content } from 'dolla';

import { isFunction, result, except, uniq } from '../support.js'
import TableColumn from './table/column.js';
import TableRow from './table/row.js';
import TableHeader from './table/header.js';
import KompElement from './element.js';

export default class Table extends KompElement {
    
    static assignableAttributes = {
        data: [],
        columns: []
    }
    
    static tagName = 'komp-table'
    static columnTypeRegistry = {
        default: TableColumn
    }
    static Row = TableRow;
    static Header = TableHeader;
    static events = [
        'headerChanged',
        'columnRemoved'
    ]
    
    constructor (...args) {
        super(...args)
        this.rowSelector = `${this.constructor.Row.tagName}, ${this.constructor.Header.tagName}`
        this.cellSelector = uniq(Object.values(this.constructor.columnTypeRegistry).map(Column => {
        return [
            Column.Cell.tagName,
            Column.HeaderCell.tagName
        ]
    }).flat()).join(', ')
    }
    
    async initialize (...args) {
        const result = super.initialize(...args)
        await this.initializeColumns()
        this.setTemplate()
        this.render()
        return result
    }
    
    async initializeColumns () {
        this.columns = await Promise.all(await (await this.columns).map(this.initializeColumn, this))
        return this.columns
    }
    
    async initializeColumn (options, index) {
        options = await options
        const type = options.type || "default"
        const columnClass = this.constructor.columnTypeRegistry[type] || this.constructor.columnTypeRegistry.default
        return new columnClass(Object.assign({
            table: this,
            index: index + 1
        }, options))
    }
    
    async addColumns (newColumnOptions, index) {
        index = index || this.columns.length
        const startingIndex = index
        const newColumns = await Promise.all(newColumnOptions.map(async options => {
            const column = await this.initializeColumn(options, index += 1)
            this.header.appendCell(await column.renderHeader());
            return column
        }))
        this.columns.slice(startingIndex + 1).forEach(column => {
            column.index = column.index + newColumns.length
        });
        this.columns.splice(startingIndex + 1, 0, ...newColumns);
        this.setTemplate();
        (await this.data).forEach(async (record, rowIndex) => {
            const row = this.rows[rowIndex]
            newColumns.forEach(async column => {
                const cells = await column.renderCell(record)
                row.appendCell(...(Array.isArray(cells) ? cells : [cells]))
            })
        })
        return newColumns
    }
    
    removeColumn (column) {
        this.columns.slice(column.index - 1).forEach(c => {
            c.index = c.index - 1
        })
        this.columns.splice(column.index - 1, 1)
        this.setTemplate()
        this.trigger('columnRemoved', {
            detail: column
        })
        column.remove()
    }
    
    observeResize (cell) {
        if (!this.resizeObserver) {
            this.resizeObserver = new ResizeObserver(entries => {
                const scrollPositionWas = [this.scrollLeft, this.scrollTop]
                this.scrollTo(0,0)
                this.header.querySelectorAll(':scope > .frozen').forEach((cell, index) => {
                    this.style.setProperty(`--frozen-position-${cell.cellIndex}`, cell.offsetLeft + "px")
                })
                this.scrollTo(...scrollPositionWas)
            })
        }
        this.resizeObserver.observe(cell)
    }
    
    unobserveResize(cell) {
        if (this.resizeObserver) {
            this.resizeObserver.unobserve(cell)
        }
    }
    
    render () {
        append(this, this.renderHeader())
        append(this, this.renderRows())
    }
    
    setTemplate () {
        this.style.gridTemplateColumns = this.columns.map(column => {
            return column.width || "var(--column-size)"
        }).join(" ")
    }
    
    renderHeader () {
        this.header = new this.constructor.Header({
            rowIndex: 1,
            table: this,
            content: this.columns.map((column, index) => {
                return column.renderHeader()
            })
        })
        return this.header
    }
    
    async renderRows () {
        return (await this.data).map((record, rowIndex) => this.renderRow(record, rowIndex + 2))
    }
    
    async renderRow (record, index) {
        const row = new this.constructor.Row({
            rowIndex: index,
            table: this
        })
        this.columns.forEach(async column => {
            const cells = await column.renderCell(record)
            row.appendCell(...(Array.isArray(cells) ? cells : [cells]))
        })
        return row
    }
    
    get rows () {
        return Array.from(this.querySelectorAll(this.constructor.Row.tagName))
    }

    at (...args) {
        return this.slice(args, args)[0]
    }
    
    // args: Array:[columnIndex, rowIndex cellSplitIndex], Array:[columnIndex, rowIndex cellSplitIndex]
    slice (from, to) {
        const result = this.rows.map((row, index, rows) => {
            const rowFromIndex = from[1] < 0 ? rows.length + from[1] : from[1]
            const rowToIndex = to[1] < 0 ? rows.length + to[1] : to[1]
            if (rowFromIndex <= row.rowIndex && row.rowIndex <= rowToIndex) {
                return row.cells.filter((cell, index, cells) => {
                    const cellFromIndex = from[0] < 0 ? cells.length + from[0] : from[0]
                    const cellToIndex = to[0] < 0 ? cells.length + to[0] : to[0]
                
                    if (to[2] && cell.rowIndex == rowToIndex && cell.cellIndex == cellToIndex) {
                        if (cell.cellSplitIndex > to[2]) {
                            return false
                        }
                    }
                    if (from[2] && cell.rowIndex == rowFromIndex && cell.cellIndex == cellFromIndex) {
                        if (cell.cellSplitIndex < from[2]) {
                            return false
                        }
                    }
                
                    return cellFromIndex <= cell.cellIndex && cell.cellIndex <= cellToIndex
                })
            }
        }).filter(x => x != undefined).flat()
        return result
    }
    
    queryCell (selector='') {
        return this.querySelector(this.cellSelector.split(", ").map(x => {
            return selector.split(', ').map(selector => x + selector).join(', ')
        }).join(", "))
    }
    queryCells (selector='') {
        return this.querySelectorAll(this.cellSelector.split(", ").map(x => {
            return selector.split(', ').map(selector => x + selector).join(', ')
        }).join(", "))
    }
    
    // TODO replace hard coding cell and header tags
    // TODO replace hard coding frozen numbers
    static style = function() { return `
        ${this.tagName} {
            --column-size: max-content;
            display: inline-grid;
            align-content: start;
            position: relative;
        }
        ${this.tagName}-handles {
            display: contents;
        }
        ${this.tagName}-header,
        ${this.tagName}-row {
            display: grid;
            grid-template-columns: subgrid;
            grid-column: 1 / -1;
        }

        komp-table-header {
            position: sticky;
            top: 0;
            cursor: default;
        }

        ${this.tagName}-cell,
        ${this.tagName}-header-cell{
            grid-row: 1 / -1
        }
        
        ${this.tagName}-header-cell.frozen,
        ${this.tagName}-cell.frozen {
            position: sticky;
            
        }
        
        ${this.tagName} .frozen-1 {
            left: var(--frozen-position-1, 0);
        }
        ${this.tagName} .frozen-2 {
            left: var(--frozen-position-2, 0);
        }
        ${this.tagName} .frozen-3 {
            left: var(--frozen-position-3, 0);
        }
        ${this.tagName} .frozen-4 {
            left: var(--frozen-position-4, 0);
        }
        ${this.tagName} .frozen-5 {
            left: var(--frozen-position-5, 0);
        }

        ${this.tagName}-cell               { z-index: 1; }
        ${this.tagName}-cell.frozen        { z-index: 100; }
        ${this.tagName}-header             { z-index: 110; }
    `}
}
window.customElements.define(Table.tagName, Table);