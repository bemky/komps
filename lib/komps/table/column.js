/**
 * The configuration class for {@link Table} columns.
 *
 * TableColumn is a plain class (not a custom element) that manages rendering,
 * header creation, and cell lifecycle for a single column in a {@link Table}.
 * Cells delegate their rendering and behavior to their column instance.
 *
 * ## Column Types
 *
 * Columns are resolved through a **type registry** on the Table class.
 * When a column config includes a `type` string, the Table looks it up in
 * `Table.columnTypeRegistry` and instantiates that class instead of the
 * default `TableColumn`.
 *
 * ### Built-in types
 *
 * **Table** ships with one type:
 * | Type        | Class         | Description                    |
 * |-------------|---------------|--------------------------------|
 * | `"default"` | `TableColumn` | Standard read-only table cell  |
 *
 * **Spreadsheet** extends the registry with editable types:
 * | Type         | Class            | Description                                       |
 * |--------------|------------------|---------------------------------------------------|
 * | `"default"`  | `SpreadsheetColumn` | Editable text cell (click to edit)              |
 * | `"select"`   | `SelectColumn`   | Dropdown select input                             |
 * | `"number"`   | `NumberColumn`   | Numeric input, parses pasted values as floats     |
 * | `"checkbox"` | `CheckboxColumn` | Checkbox toggle                                   |
 * | `"radio"`    | `CheckboxColumn` | Radio toggle (same class as checkbox)             |
 * | `"readonly"` | `ReadonlyColumn` | Non-editable cell, paste disabled                 |
 *
 * ### Creating a custom column type
 *
 * 1. Extend `TableColumn` (or `SpreadsheetColumn` for spreadsheet features).
 * 2. Override methods like `render`, `renderCell`, or `initialize` as needed.
 * 3. Optionally set a custom `static Cell` or `static HeaderCell` class.
 * 4. Register the type on the Table (or Spreadsheet) class.
 *
 * @example <caption>Creating and registering a custom column type</caption>
 * import Table from 'komps/table';
 * import TableColumn from 'komps/table/column';
 *
 * class CurrencyColumn extends TableColumn {
 *     render (record) {
 *         const value = record[this.attribute];
 *         return '$' + Number(value).toFixed(2);
 *     }
 * }
 *
 * Table.columnTypeRegistry.currency = CurrencyColumn;
 *
 * new Table({
 *     data: records,
 *     columns: [
 *         { header: 'Name', render: r => r.name },
 *         { header: 'Price', type: 'currency', attribute: 'price' }
 *     ]
 * })
 *
 * @class TableColumn
 *
 * @param {Object} [options={}]
 * @param {string} [options.type] - Key into `Table.columnTypeRegistry` that determines which column class to instantiate. Defaults to `"default"`.
 * @param {boolean} [options.frozen=false] - Make column stay in place when table body scrolls
 * @param {string} [options.class] - classes to append to header and cells (space separated)
 * @param {function} [options.render] - Render method for the cell. Receives `(record, cell, columnConfiguration, table)`
 * @param {function|string} [options.header] - Render method for the header. Receives `(columnConfiguration, table)`
 * @param {string} [options.width] - Valid value for {@link https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns css grid template} (i.e. px, percent, min-content...)
 * @param {function|string} [options.splitInto] - split cell into multiple rows by the result of this method. If String, key is called on record. If Function, function is called with record as argument.
 *
 * Column attribute changes fire cancellable events on the parent {@link Table}:
 * - `headerChange` / `headerChanged` — when the header value changes
 * - `indexChange` / `indexChanged` — when the column index changes
 * - `widthChange` / `widthChanged` — when the column width changes
 *
 * Call `event.preventDefault()` on the pre-action event to cancel default behavior.
 */

import { createElement, HTML_ATTRIBUTES, append, trigger } from 'dolla';
import Input from '../input.js';
import { result, scanPrototypesFor, eachPrototype, isFunction } from '../../support.js';

import Element from '../element.js';
import TableCell from './cell.js';
import HeaderCell from './header-cell.js';

export default class TableColumn {

    static Cell = TableCell;
    static HeaderCell = HeaderCell;
    static assignableAttributes = {
        index: { type: 'number', default: null, null: true },
        table: { type: 'object', default: null, null: true },
        width: { type: 'string', default: null, null: true },
        frozen: { type: 'boolean', default: false, null: false },
        header: { type: ['function', 'string'], default: null, null: true },
        class: { type: 'string', default: null, null: true },
        splitInto: { type: ['function', 'string'], default: null, null: true }
    }
    static assignableMethods = [
        'record', 'render', 'initialize'
    ]
    _attributes = {}
    _is_initialized = false
    
    cells = new Set()
    toggles = new Set()
    
    constructor(options) {
        const assignableAttributes = {}
        scanPrototypesFor(this.constructor, 'assignableAttributes').filter(x => x).reverse().forEach(attributes => {
            if (Array.isArray(attributes)) {
                console.warn(`[Komps] assignableAttributes on ${this.constructor.name} uses deprecated array format. Convert to object schema: { attr: { type, default, null } }`)
                attributes.forEach(attr => {
                    assignableAttributes[attr] = assignableAttributes[attr] || { type: 'object', default: null, null: true }
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
                this[attribute] = assignableAttributes[attribute].default
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
        
        this.appendStyle()
        this.initialize(options)
        this._is_initialized = true
    }
    
    initialize (options) {}
    
    widthChanged(was, v) {
        if (this._is_initialized) {
            if (!trigger(this.table, 'widthChange', { detail: { column: this, was, now: v } })) return
            this.table.setTemplateColumns()
            trigger(this.table, 'widthChanged', { detail: { column: this, was, now: v } })
        }
    }

    indexChanged (was, v) {
        if (was != v) {
            if (!trigger(this.table, 'indexChange', { detail: { column: this, was, now: v } })) return
            if (this.headerCell) {
                this.headerCell.cellIndex = v
            }
            this.cells.forEach(cell => cell.cellIndex = v)
            if (this.frozen) {
                this.table.renderFrozenDivider()
            }
            trigger(this.table, 'indexChanged', { detail: { column: this, was, now: v } })
        }
    }

    headerChanged (was, now) {
        if (this._is_initialized) {
            if (!trigger(this.table, 'headerChange', { detail: { column: this, was, now } })) return
            trigger(this.table, 'headerChanged', { detail: { column: this, was, now } })
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
        const headerClass = [this.class, this.type ? `${this.type}-cell` : null].filter(Boolean).join(' ') || null
        const header = new this.constructor.HeaderCell({
            column: this,
            table: this.table,
            class: headerClass,
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
        const cellClass = [this.class, this.type ? `${this.type}-cell` : null].filter(Boolean).join(' ') || null
        const cell = new this.constructor.Cell(Object.assign({
            column: this,
            table: this.table,
            record: record ? await result(this, 'record', record) : undefined,
            cellIndex: this.index,
            class: cellClass
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
    
    appendStyle () {
        if (this.constructor.style) {;
            const root = document
            if (root && root.adoptedStyleSheets && !root.adoptedStyleSheets.find(s => s.id == this.constructor.name)) {
                eachPrototype(this.constructor, proto => {
                    if (proto.hasOwnProperty('style') && proto.renderStyle) {
                        if (root && root.adoptedStyleSheets && !root.adoptedStyleSheets.find(s => s.id == proto.name)) {
                            const style = proto.renderStyle()
                            if (style) root.adoptedStyleSheets.push(style)
                        }
                    }
                })
            }
        }
    }
    
    static renderStyle () {
        if (!this.style) return null;
        
        const style = new CSSStyleSheet()
        style.id = this.name
        let body = '';
        
        const expandStyle = (style) => {
            if (Array.isArray(style)) {
                return style.map(expandStyle).join("\n")
            } else if (isFunction(style)) {
                return style.call(this)
            } else if (!!style) {
                return style
            }
        }
        
        eachPrototype(this, proto => {
            body += expandStyle(proto.style)
        })
        if (Element.styleLayer) {
            style.replaceSync(`@layer ${Element.styleLayer} { ${body} }`)
        } else {
            style.replaceSync(body)
        }
        return style
    }
}