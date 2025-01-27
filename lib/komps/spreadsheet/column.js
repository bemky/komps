import SpreadsheetCell from './cell.js';
import HeaderCell from './header-cell.js';
import TableColumn from '../table/column.js';
import Input from '../input.js';
import { result } from '../../support';

export default class SpreadsheetColumn extends TableColumn {
    static Cell = SpreadsheetCell;
    static HeaderCell = HeaderCell;
    
    static assignableAttributes = [
        'type', 'attribute', 'contextMenu', 'input', 'copy', 'paste'
    ]

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
    
    paste (cell, value) {
        cell.record[this.attribute] = value
    }
    
    input (record, cell, options) {
        return Input.create(this.type || 'contentarea', Object.assign({
            record: record,
            attribute: this.attribute
        }, options))
    }
    contextMenu (menu) {
        return menu
    }
    
    createHeader (...args) {
        const cell = super.createHeader(...args)
        cell.tabIndex = 0;
        return cell
    }
    
    createCell (...args) {
        const cell = super.createCell(...args)
        cell.tabIndex = 0;
        return cell
    }
}