import { content } from 'dolla';
import { result } from '../../support.js';
import Cell from './cell.js';


export default class HeaderCell extends Cell {
    static tagName = 'komp-table-header-cell'
    static { this.define() }
    render () {
        content(this, result(this.column, 'header', this))
        return this
    }
    
    connected () {
        super.connected()
        this.setAttribute('role', 'columnheader');
        if (this.column.frozen) {
            this.table.observeResize(this)
        }
    }
    
    disconnected () {
        if (this.column.frozen) {
            this.table.unobserveResize(this)
        }
    }
}
