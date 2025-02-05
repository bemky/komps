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
        attribute: null
    }
    
    static assignableMethods = [
        'input', 'copy', 'paste', 'dump', 'load'
    ]
    
    initialize (configs) {
        this.configuredContextMenu = configs.contextMenu
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
    
    paste (cell, value) {
        cell.record[this.attribute] = value
    }
    
    input (record, cell, options) {
        return Input.create(this.type || 'contentarea', Object.assign({
            record: record,
            attribute: this.attribute,
            dump: this.dump,
            load: this.load
        }, options))
    }
    contextMenu (menu, ...args) {
        if (this.configuredContextMenu) {
            return this.configuredContextMenu(menu, ...args)
        } else {
            return menu
        }
    }
}