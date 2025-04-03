/*

Description
----
The configuration class for [Spreadsheeet](/spreadsheet) columns

Syntax
----
```javascript
Spreadsheet.columnTypeRegistry.foo = class FooColumn extends SpreadsheetColumn {
    ...
}
new Table({
    data: [...]
    columns: [{ type: 'number' }]
})
```

Options
----
headerEditable:
    types: Boolean
    default: true
    description: allow header to be changed, fires events when changed

*/

import SpreadsheetCell from './cell.js';
import HeaderCell from './header-cell.js';
import TableColumn from '../table/column.js';
import Input from '../input.js';
import { result } from '../../support';

export default class SpreadsheetColumn extends TableColumn {
    static Cell = SpreadsheetCell;
    static HeaderCell = HeaderCell;
    
    static assignableAttributes = {
        type: null,
        attribute: null,
        headerEditable: true
    }
    
    static assignableMethods = [
        'input', 'copy', 'paste'
    ]
    
    initialize (configs) {
        this.configuredContextMenu = configs.contextMenu
        this.inputOptions = configs.input
        if (configs.hasOwnProperty('copy') && !configs.copy) {
            this.copy = undefined
        }
        if (configs.hasOwnProperty('paste') &&!configs.paste) {
            this.paste = undefined
        }
    }

    headerFallback () {
        return this.attribute
    }
    
    render (record) {
        const value = result(record, this.attribute)
        if (value && typeof value == 'string') {
            return value.replaceAll("\n", "<br>")
        }
        return value
    }
    
    copy (cell) {
        return result(cell.record, this.attribute)
    }
    
    static pasteAccepts = ["text/plain"]
    paste (cell, value) {
        cell.record[this.attribute] = value
    }
    
    clear (cell) {
        cell.record[this.attribute] = null
    }
    
    input (record, cell, options) {
        return Input.create(this.type || 'contentarea', Object.assign({
            record: record,
            attribute: this.attribute
        }, this.inputOptions, options))
    }
    contextMenu (menu, ...args) {
        if (this.configuredContextMenu) {
            return this.configuredContextMenu(menu, ...args)
        } else {
            return menu
        }
    }
}