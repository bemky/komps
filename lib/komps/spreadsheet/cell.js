import { content, createElement } from 'dolla';
import { result } from '../../support';
import Input from '../input.js';
import KompElement from '../element.js';

export default class SpreadsheetCell extends KompElement {
    static tagName = 'komp-spreadsheet-cell'
    #column
    
    static assignableMethods = ['resolveRecord', 'header', 'render']
    
    constructor (options={}) {
        super(options)
        this.#column = options.column
        if (options.record) {
            this.rowRecord = options.record
            this.record = options.column.resolveRecord(options.record)
        }
    }
    
    async render () {
        content(this, result(this.#column, 'render', this.record, this, this.rowRecord))
        return this
    }
    
    canCopy () {
        return !this.header && !!this.#column?.copy
    }
    copy () {
        return this.#column.copy(this.record)
    }
    
    canPaste () {
        return !this.header && !!this.#column?.paste
    }
    paste (v) {
        return this.#column.paste(this.record, v)
    }
    
    spawnInput (options) {
        if (this.#column.input && !!this.record) {
            const inputContent = this.#column.input(this.record, this, options)
            if (inputContent) {
                return createElement(`komp-spreadsheet-input`, {
                    class: this.#column.frozen ? "frozen" : "",
                    style: {
                        'grid-column': this.column,
                        'grid-row': this.row
                    },
                    content: {
                        tag: 'komp-spreadsheet-input-wrapper',
                        content: inputContent
                    }
                })
            } else {
                return inputContent
            }
        }
    }
    
    columnModel () {
        return this.#column
    }
    
    contextMenu (menu) {
        return this.#column?.contextMenu(menu, this, this.#column)
    }
}
window.customElements.define(SpreadsheetCell.tagName, SpreadsheetCell);