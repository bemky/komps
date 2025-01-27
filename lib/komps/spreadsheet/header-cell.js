import { content } from 'dolla';
import { result } from '../../support';
import Cell from './cell.js';
import Input from '../input.js';

export default class HeaderCell extends Cell {
    static tagName = 'komp-spreadsheet-header-cell'
    render () {
        content(this, result(this.column, 'header', this))
        return this
    }
    
    createInput () {
        return Input.create('contentarea', Object.assign({
            record: this.column,
            attribute: 'header'
        }))
    }
    
    canCopy () {
        return true
    }
    copy () {
        return result(this.column, 'header', this)
    }
    
    canPaste () {
        return true
    }
    paste (v) {
        return this.column.header = v
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