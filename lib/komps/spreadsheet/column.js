import { HTML_ATTRIBUTES } from 'dolla';
import Input from '../input.js';
import { scanPrototypesFor } from '../../support';

export default class Column {

    static assignableAttributes = {
        type: 'contentarea',
        frozen: false,
        attribute: undefined,
        width: undefined,
        resize: true,
        reorder: true
    }
    
    static assignableMethods = [
        'resolveRecord', 'render', 'input', 'contextMenu'
    ]
    
    _header = null
    inputAttributes = {}
    static inputAttributes = HTML_ATTRIBUTES
    
    constructor (options) {
        const assignableAttributes = Object.assign({}, ...scanPrototypesFor(this.constructor, 'assignableAttributes').filter(x => x != undefined).reverse())
        Object.assign(this, assignableAttributes);
        
        const assignableMethods = scanPrototypesFor(this.constructor, 'assignableMethods').filter(x => x != undefined).flat()
        Object.keys(assignableAttributes).concat(assignableMethods).forEach(k => {
            if (options[k] !== undefined) {
                this[k] = options[k]
            }
        })
        
        if (options.header !== undefined) {
            this._header = options.header
        }
        
        const inputAttributes = scanPrototypesFor(this.constructor, 'inputAttributes').flat()
        Object.keys(options).forEach(k => {
            if (inputAttributes.includes(k)) {
                this.inputAttributes[k] = options[k]
            }
        })
    }
    resolveRecord (record) {
        return record
    }
    header () {
        return this._header == null ? this.attribute : this._header
    }
    render (record) {
        const value = record[this.attribute]
        if (value && typeof value == 'string') {
            return value.replaceAll("\n", "<br>")
        }
        return value
    }
    async copy (record) {
        return record[this.attribute]
    }
    async paste (record, value) {
        record[this.attribute] = value
    }
    input (record, cell, options) {
        return Input.create(this.type, Object.assign({
            record: record,
            attribute: this.attribute
        }, this.inputOptions, options))
    }
    contextMenu (menu) {
        return menu
    }
}