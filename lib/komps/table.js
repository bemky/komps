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

import { createElement, listenerElement, remove, append, content, insertBefore } from 'dolla';

import { isFunction, result, except, uniq, findClosest } from '../support.js'
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
        'columnRemoved',
        'columnsChanged'
    ]
    
    frozenLeft = 0;
    
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
        this.setTemplateColumns()
        this.rendering = this.render()
        return result
    }
    
    remove (...args) {
        if (this.resizeObserver) this.resizeObserver.disconnect()
        if (this.frozenColumnResizeObserver) this.frozenColumnResizeObserver.disconnect()
        if (this.interersectionObserver) this.interersectionObserver.disconnect()
        super.remove(...args)
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

    async #spliceColumns(index, countToDelete, newColumns=[], mutate=true) {
        newColumns = await Promise.all(newColumns.map(async (column, i) => {
            if (column instanceof TableColumn) { return column }
            return this.initializeColumn(column, index + i - 1)
        }))
        if (countToDelete != newColumns.length) {
            this.columns.slice(index - 1).forEach(column => {
                column.index += newColumns.length - countToDelete
            });
        }
        
        let removedColumns
        if (mutate) {
            removedColumns = this.columns.splice(index - 1, countToDelete, ...newColumns);
        } else {
            removedColumns = this.columns.slice(index - 1, index - 1 + countToDelete);
            this.columns = this.columns.toSpliced(index - 1, countToDelete, ...newColumns);
        }
        
        this.setTemplateColumns();

        await this.rendering
        
        removedColumns.forEach(c => c.remove());
        if (newColumns.length > 0) {
            insertBefore(this.header.children.item(index - 1), newColumns.map(this.renderColumnHeader, this))
            await Promise.all(await (await this.data).map(async (record, rowIndex) => {
                const row = this.rows[rowIndex + 1]
                if (!row) debugger
                return Promise.all(newColumns.map(async column => {
                    const cell = await this.renderColumnCell(column, record)
                    insertBefore(row.children.item(index - 1), cell)
                }))
            }))
        }

        return newColumns
    }
    
    spliceColumns (index, toDelete, ...newColumns) {
        return this.#spliceColumns(index, toDelete, ...newColumns)
    }
    // Mutating Change to Columns
    insertColumns (index, ...newColumns) {
        return this.#spliceColumns(index, 0, newColumns)
    }
    addColumns (index, ...newColumns) {
        return this.#spliceColumns(index, 0, newColumns, false)
    }
    // Mutating Change to Columns
    deleteColumn (column) {
        return this.#spliceColumns(column.index, 1)
    }
    removeColumn (column) {
        return this.#spliceColumns(column.index, 1, [], false)
    }
    replaceColumn (oldColumn, ...newColumns) {
        return this.#spliceColumns(oldColumn.index, 1, newColumns, false)
    }
    
    observeResize (cell) {
        if (!this.frozenColumnResizeObserver) {
            this.frozenColumnResizeObserver = new ResizeObserver(entries => {
                const scrollPositionWas = [this.scrollLeft, this.scrollTop]
                this.scrollTo(0,0)
                this.frozenLeft = 0
                this.header.querySelectorAll(':scope > .frozen').forEach((cell, index) => {
                    this.style.setProperty(`--frozen-position-${cell.cellIndex}`, cell.offsetLeft + "px")
                    this.frozenLeft = cell.offsetLeft + cell.offsetWidth
                })
                this.scrollTo(...scrollPositionWas)
            })
        }
        this.frozenColumnResizeObserver.observe(cell)
    }
    
    unobserveResize(cell) {
        if (this.frozenColumnResizeObserver) {
            this.frozenColumnResizeObserver.unobserve(cell)
        }
    }
    
    observeIntersection(el) {
        if (!this.interersectionObserver) {
            this.setInterersectionObserver()
        }
        if (!this.interersectionObserverTargets) {
            this.interersectionObserverTargets = new Set()
        }
        this.interersectionObserver.observe(el)
        this.interersectionObserverTargets.add(el)
        return el
    }
    
    setInterersectionObserver () {
        let root = findClosest(this, el => el.scrollHeight > el.clientHeight)
        if (root == this.getRootNode().documentElement) {
            root = null
        }
        this.interersectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                this.querySelector(entry.target.dataset.target)?.classList.toggle('show', entry.intersectionRatio <= 0)
            })
        }, { root })
        if (!this.resizeObserver) {
            this.resizeObserver = new ResizeObserver(entries => {
                entries.forEach(entry => entry.target.resetInterersectionObserver())
            })
            this.resizeObserver.observe(this);
        }
    }
    
    resetInterersectionObserver () {
        if (this.interersectionObserver) {
            this.interersectionObserver.disconnect()
            this.setInterersectionObserver()
            this.interersectionObserverTargets.forEach(target => {
                this.interersectionObserver.observe(target)
            })
        }
    }
    
    async render () {
        this.innerHTML = '';
        append(this, this.renderHeader())
        await append(this, await this.renderRows())
        
        const frozenColumns = this.columns.filter(c => c.frozen)
        if (frozenColumns.length > 0) {
            append(this, this.observeIntersection(createElement(`${this.localName}-frozen-indicator`, {
                class: 'column',
                data: {
                    target: `${this.localName}-frozen-divider.column`
                }
            })))
            append(this, createElement(`${this.localName}-frozen-divider`, {
                class: 'column',
                style: {
                    'grid-column': `1 / ${frozenColumns.length + 1}`
                }
            }))
        }
        
        this.setTemplateRows()
    }
    
    setTemplateColumns () {
        this.style.gridTemplateColumns = this.columns.map(column => {
            return column.width || "var(--column-size)"
        }).join(" ")
    }
    
    setTemplateRows () {
        this.style.gridTemplateRows = [this.header.height || "var(--row-size)"].concat(this.rows.map(row => {
            return row.height || "var(--row-size)"
        }), '1fr').join(" ")
    }
    
    renderHeader () {
        this.header = new this.constructor.Header({
            rowIndex: 1,
            table: this,
            content: this.columns.map(this.renderColumnHeader, this)
        })
        this.append(this.observeIntersection(createElement(`${this.localName}-frozen-indicator`, {
            class: 'row',
            data: {
                target: `${this.localName}-frozen-divider.row`
            }
        })))
        this.append(createElement(`${this.localName}-frozen-divider`, {
            class: 'row',
            style: {
                'grid-row': '1'
            }
        }))
        return this.header
    }
    renderColumnHeader (column) {
        return column.renderHeader()
    }
    
    async renderRows () {
        return Promise.all(await (await this.data).map((record, rowIndex) => this.renderRow(record, rowIndex + 2)))
    }
    
    async renderRow (record, index) {
        return new this.constructor.Row({
            record: record,
            rowIndex: index,
            table: this,
            content: await Promise.all(this.columns.map(column => this.renderColumnCell(column, record)))
        })
    }
    renderColumnCell (column, record) {
        return column.renderCell(record)
    }
    
    appendRow (index, ...newRecords) {
        return this.#spliceRow(index, 0, newRecords)
    }
    
    removeRow (index, toDeleteCount=1) {
        return this.#spliceRow(index, toDeleteCount)
    }
    
    async #spliceRow (index, countToDelete, newRecords=[], mutate=true) {
        const initiateSplice = () => {
            return new Promise (async done => {
                const newRows = await Promise.all(newRecords.map(async (record, i) => {
                    if (record instanceof this.constructor.Row) {
                        return record
                    } else {
                        return this.renderRow(record, index + i)
                    }
                }))
        
                if (countToDelete != newRows.length) {
                    this.rows.slice(index - 1).forEach(row => {
                        row.rowIndex += newRows.length - countToDelete
                    });
                }
        
                let removedRows = this.rows.slice(index - 1, (index - 1) + countToDelete)
                removedRows.forEach(row => row.remove())
                if (newRows.length > 0) {
                    let anchor = this.rows[index - 1]
                    if (!anchor) anchor = this.rows[this.rows.length - 1]
                    insertBefore(anchor, newRows)
                }
                this.setTemplateRows()

                done(newRows)
            })
        }
        
        if (this.rendering) {
            this.rendering = this.rendering.then(initiateSplice)
        } else {
            this.rendering = initiateSplice()
        }
            
        return this.rendering
    }
    
    sortRows (compareFn) {
        return Array.from(this.querySelectorAll(this.constructor.Row.tagName)).sort(compareFn).map((row, i) => {
            this.append(row)
            row.rowIndex = i + 2
        })
    }
    
    get rows () {
        return Array.from(this.querySelectorAll(this.rowSelector))
    }

    at (...args) {
        return this.slice(args, args)[0]
    }
    
    // args: Array:[columnIndex, rowIndex cellSplitIndex], Array:[columnIndex, rowIndex cellSplitIndex]
    slice (from, to) {
        const rowFromIndex = from[1] < 0 ? this.rows[this.rows.length - 1].rowIndex + from[1] : from[1]
        const rowToIndex = to[1] < 0 ? this.rows[this.rows.length - 1].rowIndex + 1 + to[1] : to[1]
        return this.rows.map((row, index, rows) => {
            if (rowFromIndex <= row.rowIndex && row.rowIndex <= rowToIndex) {
                return row.cells.map((cell, index, cells) => {
                    const cellFromIndex = from[0] < 0 ? cells.length + from[0] : from[0]
                    const cellToIndex = to[0] < 0 ? cells.length + to[0] : to[0]

                    if (cellFromIndex <= cell.cellIndex && cell.cellIndex <= cellToIndex) {
                        if (cell.isSplit) {
                            const fromSplitCellIndex = from[2] == undefined ? 1 : from[2]
                            const toSplitCellIndex = to[2] == undefined ? cell.children.length : to[2]
                            return Array.from(cell.children).filter(splitCell => {
                                if (cell.rowIndex == from[1] && cell.rowIndex == to[1]) {
                                    return fromSplitCellIndex <= splitCell.cellSplitIndex && splitCell.cellSplitIndex <= toSplitCellIndex
                                }
                                if (cell.rowIndex == from[1]) {
                                    return fromSplitCellIndex <= splitCell.cellSplitIndex
                                }
                                if (cell.rowIndex == to[1]){
                                    return splitCell.cellSplitIndex <= toSplitCellIndex
                                }
                                return true
                            })
                        } else {
                            return cell
                        }
                    } else {
                        return null
                    }
                }).filter(x => x != null).flat()
            }
        }).filter(x => x != undefined).flat()
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
            --row-size: auto;
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
        ${this.tagName}-frozen-indicator {
            position: absolute;
            inset-inline-start: 0;
            inset-block-start: 0;
            block-size: 100%;
            inline-size: 1px;
            background: none;
            pointer-events: none;
        }
        ${this.tagName}-frozen-indicator.row {
            writing-mode: vertical-lr;
            grid-area: 1 / 1 / 1 / -1;
        }
        
        ${this.tagName}-frozen-divider {
            pointer-events: none;
            grid-row: 1 / -2;
            grid-column: 1;
            position: sticky;
            inset-inline-start: 0;
        }
        ${this.tagName}-frozen-divider.show:after {
            opacity: 0.1;
            inline-size: 10px;
        }
        ${this.tagName}-frozen-divider:after {
            content: '';
            position: absolute;
            inset-inline-start: 100%;
            inset-block-start: 0;
            block-size: 100%;
            inline-size: 0;
            background: linear-gradient(90deg, rgba(0,0,0,1), rgba(0,0,0,0));
            opacity: 0;
            transition: opacity 150ms, width 150ms;
        }
        ${this.tagName}-frozen-divider.row {
            writing-mode: vertical-lr;
            grid-column: 1 / -1;
            grid-row: 1;
        }
        ${this.tagName}-frozen-divider.row:after {
            background: linear-gradient(rgba(0,0,0,1), rgba(0,0,0,0))
        }

        ${this.tagName}-cell,
        ${this.tagName}-header-cell {
            grid-row: 1 / -1
        }
        
        ${this.tagName}-cell.splitCell {
            padding: 0;
            display: grid;
            grid-template-rows: subgrid;
            grid-template-columns: subgrid;
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
        ${this.tagName}-header-cell.frozen { z-index: 115; }
        ${this.tagName}-frozen-divider     { z-index: 120; }
    `}
}
window.customElements.define(Table.tagName, Table);