import { content } from 'dolla';
import { result } from '../../support.js';
import KompElement from '../element.js';

export default class TableGroup extends KompElement {
    static tagName = 'komp-table-group'
    
    get table () { return this.row?.table }
    get row () { return this.parentElement }
    get rowIndex () { return this.row.rowIndex }
    
    get cells () { return Array.from(this.querySelectorAll(this.table.cellSelector))}
    get rowCount () { return Math.max(...this.cells.map(x => x.groupIndex)) }
    
    append (...els) {
        const result = super.append(...els)
        return result
    }
}
