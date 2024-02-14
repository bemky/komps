import { append } from 'dolla';
import KompElement from '../element.js';
import { result } from '../../support.js';

export default class SpreadsheetCell extends KompElement {
    static tagName = 'komp-spreadsheet-cell'

    static assignableAttributes = [
        'record',
        'attribute'
    ]
    
    inputOptions = {}
    
    constructor (options) {
        super(options)
        const klass = {
            
        }[options.type]
        if (klass) {
            Object.setPrototypeOf(this, klass.prototype)
        }
        this.inputOptions = options.input
        this._show = options.show
        Object.defineProperty(this, 'record', {
            get: () => result(options, 'record', this.record)
        })
        Object.defineProperty(this, 'attribute', {
            get: () => result(options, 'attribute')
        })
    }
    
    show () {
        if (typeof this._show == "function") {
            append(this, this._show(this.record, this.inputOptions))
        }
    }

    render () {
        return this.record[this.attribute]
    }
    
    input () {
        return new Input(Object.assign({
            record: this.record,
            attribute: this.attribute
        }, this.inputOptions))
    }
}
window.customElements.define(Spreadsheet.tagName, Spreadsheet);