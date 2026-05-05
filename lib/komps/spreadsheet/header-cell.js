import { content } from 'dolla';
import { result } from '../../support.js';
import Cell from './cell.js';
import Input from '../input.js';

/**
 * The header cell for a {@link Spreadsheet}. Supports editable headers.
 *
 * @class SpreadsheetHeaderCell
 * @extends SpreadsheetCell
 */
export default class HeaderCell extends Cell {
    static tagName = 'komp-spreadsheet-header-cell'
    render () {
        content(this, result(this.column, 'header', this))
        return this
    }
    
    createInput () {
        if (this.column.headerEditable) {
            return Input.create('contentarea', Object.assign({
                target: this.column,
                attribute: 'header'
            }))
        }
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
        super.connected()
        if (this.column.frozen) {
            this.table.observeResize(this)
        }
    }
    
    disconnected () {
        super.disconnected()
        if (this.column.frozen) {
            this.table.unobserveResize(this)
        }
    }
}
window.customElements.define(HeaderCell.tagName, HeaderCell);