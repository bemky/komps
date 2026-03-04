/**
 * The configuration class for {@link Table} columns
 *
 * @class TableColumn
 *
 * @param {Object} [options={}]
 * @param {string} [options.type] - Declares which column class from `Table.columnTypeRegistry` to use. Optional, default is TableColumn
 * @param {boolean} [options.frozen=false] - Make column stay in place when table body scrolls
 * @param {string} [options.class] - classes to append to header and cells (space separated)
 * @param {function} [options.render] - Render method for the cell. Receives `(record, cell, columnConfiguration, table)`
 * @param {function|string} [options.header] - Render method for the header. Receives `(columnConfiguration, table)`
 * @param {string} [options.width] - Valid value for {@link https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns css grid template} (i.e. px, percent, min-content...)
 * @param {function|string} [options.splitInto] - split cell into multiple rows by the result of this method. If String, key is called on record. If Function, function is called with record as argument.
 *
 * @example <caption>Custom Column Type</caption>
 * Table.columnTypeRegistry.foo = class FooColumn extends TableColumn {
 *     ...
 * }
 * new Table({
 *     data: [...]
 *     columns: [{ type: 'foo' }]
 * })
 */

import { createElement, HTML_ATTRIBUTES, append } from 'dolla';
import Input from '../input.js';
import { result, scanPrototypesFor } from '../../support';

import TableCell from './cell';
import HeaderCell from './header-cell';

export default class TableColumn {

    static Cell = TableCell;
    static HeaderCell = HeaderCell;
    static assignableAttributes = {
        index: null,
        table: null,
        width: null,
        frozen: false,
        header: null,
        class: null,
        splitInto: null
    }
    static assignableMethods = [
        'record', 'headerChanged', 'indexChanged', 'widthChanged', 'render', 'initialize'
    ]
    _attributes = {}
    _is_initialized = false
    
    cells = new Set()
    toggles = new Set()
    
    constructor(options) {
        const assignableAttributes = {}
        scanPrototypesFor(this.constructor, 'assignableAttributes').filter(x => x).reverse().forEach(attributes => {
            if (Array.isArray(attributes)) {
                attributes.forEach(attr => {
                    assignableAttributes[attr] = assignableAttributes[attr] || null
                })
            } else {
                Object.assign(assignableAttributes, attributes)
            }
        })
        
        Object.keys(assignableAttributes).forEach(attribute => {
            Object.defineProperty(this, attribute, {
                configurable: true,
                get: () => {
                    // TODO make nicer
                    if (attribute == "header") {
                        return this._attributes.header != undefined ? this._attributes.header : this.headerFallback()
                    } else {
                        return this._attributes[attribute]
                    }
                },
                set: (value) => {
                    const was = this._attributes[attribute]
                    if (value !== was) {
                        this._attributes[attribute] = value
                        this.attributeChangedCallback(attribute, was, value);
                    }
                }
            });
            if (options.hasOwnProperty(attribute)) {
                this[attribute] = options[attribute]
            } else {
                this[attribute] = assignableAttributes[attribute]
            }
        })
        
        scanPrototypesFor(this.constructor, 'assignableMethods').filter(x => x).reverse().forEach(methods => {
            methods.forEach(method => {
                if (options.hasOwnProperty(method) && typeof options[method] == 'function') {
                    const superMethod = this[method]
                    this[method] = function (...args) {
                        args.push(superMethod)
                        return options[method].call(this, ...args)
                    }
                }
            })
        })
        
        this.initialize(options)
        this._is_initialized = true
    }
    
    initialize (options) {}
    
    widthChanged(was, v) {
        if (this._is_initialized) {
            this.table.setTemplateColumns()
        }
    }
    
    indexChanged (was, v) {
        if (was != v) {
            if (this.headerCell) {
                this.headerCell.cellIndex = v
            }
            this.cells.forEach(cell => cell.cellIndex = v)
            if (this.frozen) {
                this.table.renderFrozenDivider()
            }
        }
    }
    
    headerChanged (was, now) {
        if (this._is_initialized) {
            this.table.trigger('headerChanged', {
                detail: this
            })
        }
    }
    
    classChanged (was, now) {
        this.cells.forEach(cell => cell.classList.remove(...was.split(" ")))
        this.cells.forEach(cell => cell.classList.add(...now.split(" ")))
    }
    
    changed(attribute, was, now){}
    attributeChangedCallback(attribute, ...args) {
        if (this[attribute+"Changed"]) { this[attribute+"Changed"].call(this, ...args) }
        return this.changed(attribute, ...args)
    }
    
    record (record) { return record }

    headerFallback () {}
    renderHeader() {
        this.headerCell = this.createHeader()
        return this.headerCell
    }

    createHeader () {
        const header = new this.constructor.HeaderCell({
            column: this,
            table: this.table,
            class: this.class,
            cellIndex: this.index
        }).render()
        if (this.frozen) {
            // TODO set style.left so that frozen columns stay in original position
            header.classList.add('frozen', 'frozen-' + this.index)
        }
        return header
    }
    
    async renderCell (record, options) {
        return this.createCell(record, options)
    }
    
    async createCell (record, options={}) {
        const cell = new this.constructor.Cell(Object.assign({
            column: this,
            table: this.table,
            record: record ? await result(this, 'record', record) : undefined,
            cellIndex: this.index,
            class: this.class
        }, options))
        if (record) cell.render()
        if (this.frozen) {
            cell.classList.add('frozen', 'frozen-' + this.index)
        }
        return cell
    }
    
    remove (options={}) {
        this.headerCell.remove()
        this.cells.forEach(cell => cell.remove())
        this.cells.clear()
        if (options.silent != true) {
            this.table.trigger('columnRemoved', {
                detail: this
            })
        }
    }
    
    get offsetWidth () {
        return this.headerCell.offsetWidth
    }
    get offsetLeft () {
        return this.headerCell.offsetLeft
    }
}