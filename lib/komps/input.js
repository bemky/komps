/**
 * A **generator** for an input element that binds the value of the input to an object.
 * This is **not** an element, but a generator that adds listeners to an input element.
 * If one day, [Safari adds support for extending built-in elements](https://bugs.webkit.org/show_bug.cgi?id=182671),
 * this can be converted.
 *
 * @class Input
 *
 * @param {Object} [options={}]
 * @param {Object} [options.target] - Object to bind to
 * @param {Object} [options.record] - Deprecated; use `target` instead
 * @param {string} [options.attribute] - Attribute of the Object to bind to
 * @param {function} [options.dump] - transform textContent to value on change
 * @param {function} [options.load] - transform value for input's content
 *
 * @example <caption>JS</caption>
 * Input.create('number', {})
 * // <input ...>
 * Input.new('number', {})
 * // Input()
 */

import KompElement from './element.js';
import ContentArea from './content-area.js';
import { except, dig, bury, generateRefId } from '../support.js';
import { createElement, HTML_ATTRIBUTES } from 'dolla';

export default class Input {
    
    static assignableAttributes = {
        target: { type: 'object', default: null, null: true },
        attribute: { type: 'string', default: null, null: true },
        dump: { type: 'function', default: (v, target) => v, null: false },
        load: { type: 'function', default: (v, target) => v, null: false }
    }
    
    /**
     * Create a bound input and return the DOM element
     * @param {string} type - input type (text, number, checkbox, select, date, textarea, button, etc.)
     * @param {Object} [options={}] - see {@link Input} constructor options
     * @returns {HTMLElement} the created input element
     * @static
     */
    static create(type, options={}) {
        return this.new(type, options).input
    }
    
    /**
     * Create and return an Input instance (access the element via `.input`)
     * @param {string} type - input type (text, number, checkbox, select, date, textarea, button, etc.)
     * @param {Object} [options={}] - see {@link Input} constructor options
     * @returns {Input} the Input instance
     * @static
     */
    static new (type, options={}) {
        const klass = {
            button: ButtonInput,
            checkbox: BinaryInput,
            radio: BinaryInput,
            select: SelectInput,
            date: DateInput,
            textarea: TextareaInput,
            'datetime-local': DateTimeInput,
            contentarea: ContentAreaInput,
        }[type]
        if (klass) {
            return new klass(Object.assign({
                type: type
            }, options))
        } else {
            return new this(Object.assign({
                type: type
            }, options))
        }
    }
    
    constructor (options={}) {
        // Backward-compat: map deprecated `record` to `target`
        if (options && options.record !== undefined && options.target === undefined) {
            options = Object.assign({}, options, { target: options.record })
            // eslint-disable-next-line no-console
            try { console.warn('[Komps Input] option "record" is deprecated; use "target" instead.') } catch (e) {}
        }
        
        let assignableAttributes = this.constructor.assignableAttributes
        if (Array.isArray(this.constructor.assignableAttributes)) {
            console.warn(`[Komps] assignableAttributes on ${this.constructor.name} uses deprecated array format. Convert to object schema: { attr: { type, default, null } }`)
            assignableAttributes = {}
            this.constructor.assignableAttributes.forEach(attr => {
                assignableAttributes[attr] = assignableAttributes[attr] || { type: 'object', default: null, null: true }
            })
        }
        
        const htmlAttrs = options
        Object.keys(assignableAttributes).forEach(k => {
            if (options[k] != undefined) {
                this[k] = options[k] || assignableAttributes[k].default
            } else {
                this[k] = assignableAttributes[k].default
            }
            delete htmlAttrs[k]
        })
        
        if (typeof this.dump != "function") {
            this.dump = v => v
        }
        if (typeof this.load != "function") {
            this.load = v => v
        }
        
        this.input = this.createInput(except(htmlAttrs, 'load', 'dump'));
        this.input._loading = this._load(null, options.value);
        this.setupInputListener(this.inputChange.bind(this));
        this.setupTargetListener(this.targetChange.bind(this));
    }
    
    get value () {
        this.input.value
    }
    
    set value (v) {
        this.input.value = v
    }
    
    createInput (options={}) {
        return createElement('input', Object.assign({
            type: options.type
        }, options))
    }
    
    setupInputListener (listener) {
        this.input.addEventListener('change', listener.bind(this));
        this.input.addEventListener('blur', listener.bind(this));
    }
    
    setupRecordListener (listener) { // deprecated alias
        // eslint-disable-next-line no-console
        try { console.warn('[Komps Input] setupRecordListener is deprecated; use setupTargetListener instead.') } catch (e) {}
        return this.setupTargetListener(listener)
    }
    
    setupTargetListener (listener) {
        if (this.target && this.target.addEventListener) {
            this.target.addEventListener('change', listener);
        }
        if (this.target && this.target.addListener) {
            this.target.addListener(listener)
        }
    }
    
    inputChange (e) {
        // for 50ms cancel calls to inputChange, for quick events of change and blur
        if (!this._dumping) {
            if (this.input.closest('[preventChange]')) { return false }
            this._dump();
            this._dumping = new Promise(done => {
                setTimeout(() => {
                    delete this._dumping
                    done()
                }, 50)
            })
        }
    }
    
    recordChange () { // deprecated alias
        // eslint-disable-next-line no-console
        try { console.warn('[Komps Input] recordChange is deprecated; use targetChange instead.') } catch (e) {}
        return this.targetChange()
    }
    
    targetChange () {
        this.input._loading = this._load()
    }
    
    _load (e, v) {
        const value = this.load(v ? v : this._loadValue(), this.target, {explicitValue: v})
        if (value !== undefined && value !== null) {
            this.input.value = value
        }
    }
    
    _loadValue () {
        if (this.target) {
            return dig(this.target, this.attribute)
        }
    }
    
    _dump (e, v) {
        const value = this.dump(v ? v : this.input.value, this.target)
        return this._dumpValue(value)
    }
    
    _dumpValue(v) {
        let attributes = Array.isArray(this.attribute) ? this.attribute : [this.attribute]
        attributes = attributes.concat([v])
        bury(this.target, ...attributes)
        return v
    }
}

class ContentAreaInput extends Input {
    createInput (options) {
        return new ContentArea(options)
    }
}

class BinaryInput extends Input {
    async _load () {
        const value = this.load(await this._loadValue())
        const inputValue = this.input.value == "on" ? true : this.input.value
        if (this.input.multiple) {
            this.input.checked = Array.isArray(value) ? value.includes(inputValue) : false
        } else {
            this.input.checked = value == inputValue
        }
    }
    _dump () {
        let value
        let inputValue = this.input.value == "on" ? true : this.input.value
        if (this.input.multiple) {
            const currentValues = this._loadValue() || []
            if (this.input.checked) {
                if (currentValues.includes(inputValue)) {
                    value = this.dump(currentValues)
                } else {
                    value = this.dump(currentValues.concat(inputValue))
                }
            } else {
                value = this.dump(currentValues.filter(x => x != inputValue))
            }
        } else if (typeof inputValue == 'boolean') {
            value = this.dump(this.input.checked ? inputValue : !inputValue)
        } else {
            value = this.dump(this.input.checked ? this.input.value : null)
        }
        return this._dumpValue(value)
    }
    
    setupInputListener (listener) {
        this.input.addEventListener('change', listener.bind(this));
    }
}

class DateInput extends Input {
    setupInputListener () {
        this.input.addEventListener('blur', this.inputChange.bind(this));
    }
    
    async _load (e) {
        let value = await this._loadValue()
        if (value instanceof Date) {
            value = [
                value.getUTCFullYear(),
                (value.getMonth() + 1).toString().padStart(2, "0"),
                value.getDate().toString().padStart(2, "0")
            ].join("-")
        }
        return super._load(e, value)
    }
    
    _dump (e) {
        let value = this.input.value
        if (value == "") value = null
        super._dump(e, value)
    }
}

class DateTimeInput extends Input {
    async _load (e) {
        let value = await this._loadValue()
        if (value instanceof Date) {
            value = [
                [
                    value.getUTCFullYear(),
                    (value.getMonth() + 1).toString().padStart(2, "0"),
                    value.getDate().toString().padStart(2, "0")
                ].join("-"),
                'T',
                [
                    value.getHours().toString().padStart(2, "0"),
                    value.getMinutes().toString().padStart(2, "0")
                ].join(":")
            ].join("")
        }
        super._load(e, value)
    }
}

class TextareaInput extends Input {
    createInput (options) {
        return createElement('textarea', options)
    }
}

class ButtonInput extends Input {
    createInput (options) {
        return createElement('button', options)
    }
    setupInputListener () {
        this.input.addEventListener('click', this._dump.bind(this));
    }
    _load () {}
}

class SelectInput extends Input {
    createInput (options={}) {
        const input = createElement('select', options)
        if (options.includeBlank) {
            input.append(createElement('option', Object.assign({
                content: 'Unset',
                value: null
            }, options.includeBlank)))
        }
        if (options.options) {
            options.options.forEach(option => {
                input.append(createElement('option', {
                    content: Array.isArray(option) ? option[1] : option,
                    value: Array.isArray(option) ? option[0] : option
                }))
            })
        }
        
        return input
    }
    async _load (e) {
        if (this.input.multiple) {
            const values = this.load(await this._loadValue());
            this.input.querySelectorAll('option').forEach(option => {
                if (values.includes(option.value)) {
                    option.setAttribute('selected', true)
                } else {
                    option.removeAttribute('selected')
                }
            })
        } else {
            super._load()
        }
    }
    _dump (e) {
        if (this.input.multiple) {
            const values = Array.from(this.input.options).filter(x => x.selected).map(x => x.value)
            this._dumpValue(this.dump(values))
            return values
        } else {
            let value = this.input.value
            if (value == "null") value = null
            value = this.dump(value)
            this._dumpValue(value)
            return value
        }
    }
}
