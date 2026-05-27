/**
 * The configuration class for {@link Spreadsheet} columns
 *
 * @class SpreadsheetColumn
 * @extends TableColumn
 *
 * @param {Object} [options={}]
 * @param {boolean} [options.headerEditable=true] - allow header to be changed, fires events when changed
 *
 * @example <caption>Custom Column Type</caption>
 * Spreadsheet.columnTypeRegistry.foo = class FooColumn extends SpreadsheetColumn {
 *     ...
 * }
 * new Spreadsheet({
 *     data: [...]
 *     columns: [{ type: 'foo' }]
 * })
 */

import SpreadsheetCell from './cell.js';
import HeaderCell from './header-cell.js';
import TableColumn from '../table/column.js';
import Input from '../input.js';
import { result } from '../../support.js';

let onEnterDeprecationWarned = false;

export default class SpreadsheetColumn extends TableColumn {
    static Cell = SpreadsheetCell;
    static HeaderCell = HeaderCell;
    
    static assignableAttributes = {
        type: { type: 'string', default: null, null: true },
        attribute: { type: 'string', default: null, null: true },
        headerEditable: { type: 'boolean', default: true, null: false }
    }
    
    static assignableMethods = [
        'input', 'copy', 'paste'
    ]
    
    static inputOptions = {}
    
    initialize (configs) {
        this.configuredContextMenu = configs.contextMenu
        this.inputOptions = Object.assign({}, configs.input, this.constructor.inputOptions)
        if (configs.hasOwnProperty('copy') && !configs.copy) {
            this.copy = undefined
        }
        if (configs.hasOwnProperty('paste') &&!configs.paste) {
            this.paste = undefined
        }
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
    
    static pasteAccepts = ["text/plain"]
    paste (cell, value) {
        cell.record[this.attribute] = value
    }
    
    clear (cell) {
        cell.record[this.attribute] = null
    }
    // TODO move to cell based signature (cell, options)
    input (record, cell, options) {
        return Input.create(this.type || 'contentarea', Object.assign({
            target: record,
            attribute: this.attribute,
            autofocus: true
        }, this.inputOptions, options))
    }
    /**
     * Called after a cell spawns its input floater and focus has been set up.
     * Receives the cell and its floater directly, so column types can wire
     * input-specific keyboard and lifecycle behavior without reaching through
     * the DOM. Override to customize; not calling `super` opts out of the
     * default navigation below.
     *
     * Default behavior provides spreadsheet keyboard navigation: Escape cancels
     * the edit and refocuses the cell, Enter commits and moves to the cell below.
     *
     * @param {SpreadsheetCell} cell
     * @param {Floater} floater
     */
    cellActivated (cell, floater) {
        const table = cell.table
        floater.addEventListener('keyup', e => {
            if (e.key == "Escape") {
                floater.setAttribute('preventChange', true)
                cell.focus()
                e.preventDefault()
            } else if (
                e.key == "Enter" &&
                this._enterAllowed(e) &&
                !table._enterDown &&
                [e.metaKey,e.ctrlKey,e.altKey,e.shiftKey].every(x => x == false)
            ) {
                e.preventDefault()
                const newCell = cell.focusAdjacentCell('down')
                if (!newCell) {
                    cell.focus()
                    floater.hide()
                }
            }
        })
        floater.addEventListener('keydown', e => {
            if (
                e.key == "Enter" &&
                this._enterAllowed(e) &&
                [e.metaKey,e.ctrlKey,e.altKey,e.shiftKey].every(x => x == false)
            ) {
                e.preventDefault()
            }
        })
    }

    /**
     * @deprecated Override {@link SpreadsheetColumn#cellActivated} instead.
     * Returning `false` to suppress the default Enter navigation is still
     * honored for backward compatibility but will be removed in a future release.
     */
    onEnter () {}

    _enterAllowed (e) {
        if (this.onEnter !== SpreadsheetColumn.prototype.onEnter) {
            if (!onEnterDeprecationWarned) {
                onEnterDeprecationWarned = true
                console.warn(`[Komps] ${this.constructor.name}#onEnter is deprecated; override cellActivated(cell, floater) instead.`)
            }
            return this.onEnter(e) !== false
        }
        return true
    }
    
    contextMenu (menu, ...args) {
        if (this.configuredContextMenu) {
            return this.configuredContextMenu(menu, ...args)
        } else {
            return menu
        }
    }
}