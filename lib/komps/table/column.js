/*

Description
----
The configuration class for [Table](/table) columns

Syntax
----
```javascript
Table.columnTypeRegistry.foo = class FooColumn extends TableColumn {
    ...
}
new Table({
    data: [...]
    columns: [{ type: 'foo' }]
})
```


Options
----
type:
    types: String
    description: Declares which column class from Table.columnTypeRegistry to use. Optional, default is TableColumn
frozen:
    types: Boolean
    description: Make column stay in place when table body scrolls
class:
    types: String
    description: classes to append to header and cells (space separated)
render: 
    types: Function
    arguments: record:Object, cell:Element, columnConfiguration:Object, table:Table
    description: Render method for the cell
    
header:
    types: Function, String
    arguments: columnConfiguration:Object, table:Table
    description: Render method for the header

width:
    types: String
    description: Valid value for [css grid template](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns) (i.e. px, percent, min-content...)

splitBy:
    types: Function
    arguments: record:Object
    description: split cell into multiple verical cells by the resulting of this method. Expected return is iterable.

*/

import { createElement, HTML_ATTRIBUTES, append } from 'dolla';
import Input from '../input.js';
import { result, scanPrototypesFor } from '../../support';

import TableCell from './cell';
import HeaderCell from './header-cell';

export default class TableColumn {

    static Cell = TableCell;
    static HeaderCell = HeaderCell;
    static assignableAttributes = [
        'index', 'table', 'width', 'frozen', 'header', 'class', 'splitBy'
    ]
    static assignableMethods = [
        'record', 'headerChanged', 'indexChanged', 'widthChanged', 'render', 'initialize'
    ]
    _attributes = {}
    _is_initialized = false
    
    cells = new Set()
    
    constructor(options) {
        const assignableAttributes = {}
        scanPrototypesFor(this.constructor, 'assignableAttributes').filter(x => x).reverse().forEach(attributes => {
            if (Array.isArray(attributes)) {
                attributes.forEach(attr => {
                    assignableAttributes[attr] = assignableAttributes[attr] || null
                })
            } else {
                Object.assign(assignableAttributes, attributes)
            }
        })
        
        Object.keys(assignableAttributes).forEach(attribute => {
            Object.defineProperty(this, attribute, {
                configurable: true,
                get: () => {
                    // TODO make nicer
                    if (attribute == "header") {
                        return this._attributes.header != undefined ? this._attributes.header : this.headerFallback()
                    } else {
                        return this._attributes[attribute]
                    }
                },
                set: (value) => {
                    const was = this._attributes[attribute]
                    if (value !== was) {
                        this._attributes[attribute] = value
                        this.attributeChangedCallback(attribute, was, value);
                    }
                }
            });
            if (options.hasOwnProperty(attribute)) {
                this[attribute] = options[attribute]
            } else {
                this[attribute] = assignableAttributes[attribute]
            }
        })
        
        scanPrototypesFor(this.constructor, 'assignableMethods').filter(x => x).reverse().forEach(methods => {
            methods.forEach(method => {
                if (options.hasOwnProperty(method)) {
                    const superMethod = this[method]
                    this[method] = function (...args) {
                        args.push(superMethod)
                        return options[method].call(this, ...args)
                    }
                }
            })
        })
        
        this.initialize(options)
        this._is_initialized = true
    }
    
    initialize (options) {}
    
    widthChanged(was, v) {
        if (this._is_initialized) {
            this.table.setTemplateColumns()
        }
    }
    
    indexChanged (was, v) {
        if (this.headerCell) {
            this.headerCell.style.gridColumn = v
        }
        this.cells.forEach(cell => {
            cell.style.gridColumn = v
            if (cell.isSplit) {
                cell.cells.forEach(cell => {
                    cell.style.gridColumn = v
                })
            }
        })
    }
    
    headerChanged (was, now) {
        if (this._is_initialized) {
            this.table.trigger('headerChanged', {
                detail: this
            })
        }
    }
    
    classChanged (was, now) {
        this.cells.forEach(cell => cell.classList.remove(...was.split(" ")))
        this.cells.forEach(cell => cell.classList.add(...now.split(" ")))
    }
    
    changed(attribute, was, now){}
    attributeChangedCallback(attribute, ...args) {
        if (this[attribute+"Changed"]) { this[attribute+"Changed"].call(this, ...args) }
        return this.changed(attribute, ...args)
    }
    
    record (record) { return record }

    headerFallback () {}
    renderHeader() {
        this.headerCell = this.createHeader()
        return this.headerCell
    }

    createHeader () {
        const header = new this.constructor.HeaderCell({
            column: this,
            table: this.table,
            class: this.class
        }).render()
        if (this.frozen) {
            // TODO set style.left so that frozen columns stay in original position
            header.classList.add('frozen', 'frozen-' + this.index)
        }
        return header
    }
    
    async renderCell (record) {
        if (this.splitBy) {
            const cell = new this.constructor.Cell(Object.assign({
                column: this,
                table: this.table,
                isSplit: true,
            }))
            await append(cell, await Promise.all(await (await this.splitBy(record)).map((subrecord, i) => {
                return this.createCell(subrecord, {
                    cellSplitIndex: i + 1
                })
            })))
            return cell
        } else {
            return this.createCell(record)
        }
    }
    
    async createCell (record, options={}) {
        const cell = new this.constructor.Cell(Object.assign({
            column: this,
            table: this.table,
            record: await result(this, 'record', record),
            class: this.class
        }, options)).render()
        if (this.frozen) {
            cell.classList.add('frozen', 'frozen-' + this.index)
        }
        return cell
    }
    
    remove () {
        this.headerCell.remove()
        this.cells.forEach(cell => cell.remove())
        this.table.trigger('columnRemoved', {
            detail: this
        })
    }
}