import { content } from 'dolla';
import { result } from '../../support';
import Cell from './cell.js';

export default class HeaderCell extends Cell {
    static tagName = 'komp-table-header-cell'
    render () {
        content(this, result(this.column, 'header', this))
        return this
    }
    
    connected () {
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
window.customElements.define(HeaderCell.tagName, HeaderCell);