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

import { createElement, HTML_ATTRIBUTES } from 'dolla';
import Input from '../input.js';
import { result, scanPrototypesFor } from '../../support';

import TableCell from './cell';
import HeaderCell from './header-cell';

export default class TableColumn {

    static Cell = TableCell;
    static HeaderCell = HeaderCell;
    static assignableAttributes = [
        'index', 'table',  'record', 'render', 'width', 'frozen', 'header',
        'class', 'splitBy', 'widthChanged', 'indexChanged', 'headerChanged'
    ]
    
    is_initialized = false
    
    _width
    get width () {
        return this._width
    }
    set width (v) {
        this._width = v
        if (this.is_initialized) {
            this.table.setTemplate()
            this.widthChanged(v)
        }
    }
    
    _index
    get index () {
        return this._index
    }
    set index (v) {
        this._index = v
        if (this.headerCell) {
            this.headerCell.cellIndex = v
        }
        this.cells.forEach(cell => cell.cellIndex = v)
        if (this.is_initialized) {
            this.indexChanged(v)
        }
    }
    
    _header
    get header () {
        return this._header != undefined ? this._header : this.headerFallback()
    }
    set header (v) {
        this._header = v
        if (this.is_initialized) {
            this.table.trigger('headerChanged', {
                detail: this
            })
            this.headerChanged(v)
        }
    }
    headerFallback () {}
    
    cells = []
    
    constructor(options) {
        scanPrototypesFor(this.constructor, 'assignableAttributes').filter(x => x).reverse().forEach(attributes => {
            if (Array.isArray(attributes)) {
                attributes.forEach(attr => {
                    if (options[attr] != undefined) {
                        this[attr] = options[attr] 
                    }
                })
            } else {
                Object.keys(attributes).forEach(attr => {
                    if (options[attr] != undefined) {
                        this[attr] = options[attr]
                    } else if (attributes[attr] != undefined) {
                        this[attr] = attributes[attr]
                    }
                })
            }
        })
        this.is_initialized = true
    }
    
    record (record) { return record }

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
    
    renderCell (record) {
        if (this.splitBy) {
            return this.splitBy(record).map((subrecord, i) => {
                return this.createCell(subrecord, {
                    cellSplitIndex: i + 1
                })
            })
        } else {
            return this.createCell(record)
        }
    }
    
    createCell (record, options={}) {
        const cell = new this.constructor.Cell(Object.assign({
            column: this,
            table: this.table,
            record: result(this, 'record', record),
            class: this.class,
            cellIndex: this.index
        }, options)).render()
        if (this.frozen) {
            cell.classList.add('frozen', 'frozen-' + this.index)
        }
        return cell
    }
    
    remove () {
        this.headerCell.remove()
        this.cells.forEach(cell => cell.remove())
    }
    
    widthChanged(v) {}
    indexChanged(v) {}
    headerChanged(v) {}
}