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

splitInto:
    types: Function, String
    arguments: record:Object
    description: split cell into multiple rows by the resulting of this method. Expected return is iterable (specifically responds to .map).
    If String, key is called on record and used to connect other columns with same splitInto key. If Function,
    function is called with record as argument. If the function has an name (`function bats (hitter) { return hitter.bats }` vs `hitter => hitter.bats`)
    then the name is used to connect to other columns with same named splitInto function, else strict equality on the function is used to connect
    to other columns with same splitInto function.
*/

import { createElement, HTML_ATTRIBUTES, append } from 'dolla';
import Input from '../input.js';
import { result, scanPrototypesFor } from '../../support';

import TableCell from './cell';
import HeaderCell from './header-cell';

export default class TableColumn {

    static Cell = TableCell;
    static HeaderCell = HeaderCell;
    static assignableAttributes = {
        index: null,
        table: null,
        width: null,
        frozen: false,
        header: null,
        class: null,
        splitInto: null
    }
    static assignableMethods = [
        'record', 'headerChanged', 'indexChanged', 'widthChanged', 'render', 'initialize'
    ]
    _attributes = {}
    _is_initialized = false
    
    cells = new Set()
    toggles = new Set()
    
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
                if (options.hasOwnProperty(method) && typeof options[method] == 'function') {
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
        if (was != v) {
            if (this.headerCell) {
                this.headerCell.cellIndex = v
            }
            this.cells.forEach(cell => cell.cellIndex = v)
            if (this.frozen) {
                this.table.renderFrozenDivider()
            }
        }
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
            class: this.class,
            cellIndex: this.index
        }).render()
        if (this.frozen) {
            // TODO set style.left so that frozen columns stay in original position
            header.classList.add('frozen', 'frozen-' + this.index)
        }
        return header
    }
    
    async renderCell (record, options) {
        return this.createCell(record, options)
    }
    
    async createCell (record, options={}) {
        const cell = new this.constructor.Cell(Object.assign({
            column: this,
            table: this.table,
            record: record ? await result(this, 'record', record) : undefined,
            cellIndex: this.index,
            class: this.class
        }, options))
        if (record) cell.render()
        if (this.frozen) {
            cell.classList.add('frozen', 'frozen-' + this.index)
        }
        return cell
    }
    
    remove (options={}) {
        this.headerCell.remove()
        this.cells.forEach(cell => cell.remove())
        this.cells.clear()
        if (options.silent != true) {
            this.table.trigger('columnRemoved', {
                detail: this
            })
        }
    }
    
    get offsetWidth () {
        return this.headerCell.offsetWidth
    }
    get offsetLeft () {
        return this.headerCell.offsetLeft
    }
}