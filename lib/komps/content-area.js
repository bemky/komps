/**
 * A responsive input that resizes to its content, and adheres to explicit sizing. This Element is crucial for the UX of {@link Spreadsheet}
 *
 * @class ContentArea
 * @extends FormField
 *
 * @param {Object} [options={}]
 * @param {string} [options.value] - similar to input.value
 * @param {function} [options.dump] - transform textContent to value on change
 * @param {function} [options.load] - transform value for input's content
 * @param {function} [options.onChange] - event listener for change, receives `(value, valueWas)`
 *
 * ## Events
 *
 * | Event | Arguments | Description |
 * |---|---|---|
 * | `change` | `newValue, oldValue` | fired on focusout when value has changed |
 *
 * @example <caption>JS</caption>
 * new ContentArea({
 *     value: "Initial Value"
 * })
 */

import { content } from 'dolla';
import { placeCaretAtEnd } from '../support.js';
import FormField from './form-field.js';

export default class ContentArea extends FormField {
    static tagName = "komp-content-area"
    static { this.define() }

    static assignableAttributes = {
        name: { type: 'string', default: null, null: true }
    }
    static events = ['change']
    static assignableMethods = ['load']
    
    get value () {
        return this.dump(this.innerHTML.replaceAll("<br>", "\n").replaceAll(/<[^\>]+>/g, ''))
    }
    
    set value (v) {
        content(this, this.load(v))
        this.setFormValue(v)
    }
    
    constructor (attrs={}) {
        attrs = Object.assign({
            tabIndex: 0,
            contenteditable: true,
            role: 'textbox',
            'aria-multiline': 'true',
        }, attrs)

        const value = attrs.content
        delete attrs.content

        super(attrs)
        this.value = value || attrs.value
        this._initialValue = this.value
        this.valueWas = this.value
        this.addEventListener('focusout', this.onFocusOut)
        this.addEventListener('focusin', this.onFocusIn)
    }
    
    onFocusIn () {
        this.valueWas = this.value
        placeCaretAtEnd(this)
    }
    
    onFocusOut () {
        const v = this.value
        if (this.valueWas != v) {
            this.setFormValue(v)
            this.trigger('change', v, this.valueWas)
            this.valueWas = v
        }
    }

    formResetCallback () {
        this.value = this._initialValue
    }
    
    dump (v) {
        return v.trimEnd()
    }
    
    load (v) {
        if (typeof v == "string") {
            v = v.replaceAll("\n", "<br>")
        }
        return v
    }
    
    select () {
        const range = document.createRange();
        range.selectNodeContents(this);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
    
    static style = `
        komp-content-area {
            appearance: textfield;
            background-color: white;
            border-width: 1px;
            padding: 0.22em;
            display: inline-block;
            min-width: 4ch;
        }
    `
}
