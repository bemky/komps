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
    static assignableAttributes = ['record', 'column', 'table', 'cellIndex', 'groupIndex']
    
    get row () {
        let row = this.parentElement
        while (row instanceof this.constructor) {
            row = row.parentElement
        }
        return row
    }
    get rowIndex () { return this.row.rowIndex }
    get cellIndex () { return this.column.index }
    
    get cells () { return Array.from(this.querySelectorAll(this.table.cellSelector))}
    
    cellIndexChanged (was, now) {
        this.style.gridColumn = now
    }
    groupIndexChanged (was, now) {
        this.style.gridRow = now
    }
    
    render () {
        content(this, result(this.column, 'render', this.record, this))
        return this
    }
    
    connected () {
        this.column.cells.add(this)
    }
    
    disconected () {
        this.column.cells.delete(this)
    }
}
window.customElements.define(TableCell.tagName, TableCell);