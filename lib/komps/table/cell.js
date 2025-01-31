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
    static assignableAttributes = ['record', 'column', 'table', 'cellSplitIndex', 'isSplit']
    
    get row () {
        let row = this.parentElement
        while (row instanceof this.constructor) {
            row = row.parentElement
        }
        return row
    }
    get rowIndex () { return this.row.rowIndex }
    get cellIndex () { return this.column.index }
    
    get cells () { return Array.from(this.children)}
    
    render () {
        content(this, result(this.column, 'render', this.record, this))
        return this
    }
    
    cellSplitIndexChanged (was, now) {
        this.style.gridRow = now
    }
    
    connected () {
        this.style.gridColumn = this.column.index
        if (this.cellSplitIndex) {
            this.row.rowCount = Math.max(...[this.row.rowCount, this.cellSplitIndex].filter(x => x))
        } else {
            this.column.cells.push(this)
        }
    }
    
    disconected () {
        this.column.cells = this.column.cells.filter(cell => cell != this)
    }
    
    isSplitChanged (was, now) {
        this.classList.toggle('splitCell', now)
    }
}
window.customElements.define(TableCell.tagName, TableCell);