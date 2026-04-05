/**
 * The cell for {@link Table}
 *
 * @class TableCell
 * @extends KompElement
 *
 * @param {Object} [options={}]
 * @param {Object|function} [options.record] - Instance of a record or function that returns a record
 * @param {Object} [options.column] - Instance of a {@link TableColumn}
 *
 * @example <caption>JS</caption>
 * new Cell({
 *     record: {
 *         name: 'Corey Seager',
 *         position: 'SS',
 *         bats: 'L'
 *     },
 *     column: new Column({
 *         render: record => record.name
 *     })
 * })
 */

import { content } from 'dolla';
import { result } from '../../support.js';
import KompElement from '../element.js';

export default class TableCell extends KompElement {
    static tagName = 'komp-table-cell'
    static assignableAttributes = {
        record: { type: ['object', 'function'], default: null, null: true },
        column: { type: 'object', default: null, null: true },
        table: { type: 'object', default: null, null: true },
        cellIndex: { type: 'number', default: null, null: true },
        groupIndex: { type: 'number', default: null, null: true }
    }
    
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
    
    get disabled () { this.readAttribute('disabled') }
    set disabled (v) { this.toggleAttribute('disabled', v) }
    get readonly () { this.readAttribute('readonly') }
    set readonly (v) { this.toggleAttribute('readonly', v) }
    
    cellIndexChanged (was, now) {
        this.style.gridColumn = now
        if (this.column.frozen) {
            this.classList.remove(`frozen-${was}`)
            this.classList.add(`frozen-${now}`)
        }
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
