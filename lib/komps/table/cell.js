/*

Description
----
The cell for [Table](/table)

Syntax
----
```javascript
new Cell({
    record: {
        name: 'Corey Seager',
        position: 'SS',
        bats: 'L'
    },
    column: new Column({
        render: record => record.name
    })
})
```


Options
----
record: 
    types: Object, Function
    arguments: record:Object
    description: Instance of a record or function that returns a record
    
column:
    types: Object
    description: Instance of a KompColumn
*/

import { content } from 'dolla';
import { result } from '../../support';
import KompElement from '../element.js';

export default class TableCell extends KompElement {
    static tagName = 'komp-table-cell'
    static assignableAttributes = ['record', 'column', 'table', 'cellIndex', 'cellSplitIndex']
    
    get row () { return this.parentElement }
    get rowIndex () { return this.row.rowIndex }
    
    render () {
        content(this, result(this.column, 'render', this.record, this))
        return this
    }
    
    cellIndexChanged (was, now) {
        this.style.gridColumn = now
    }
    
    cellSplitIndexChanged (was, now) {
        this.style.gridRow = now
    }
    
    connected () {
        this.column.cells.push(this)
    }
    
    disconected () {
        this.column.cells = this.column.cells.filter(cell => cell != this)
    }
}
window.customElements.define(TableCell.tagName, TableCell);