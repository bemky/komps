/*
Description
----
A **generator** for an input element that binds the value of the input to an object.
This is **not** an element, but a generator that adds listeners to an input element.
If one day, [Safari adds support for extending built in elements](https://bugs.webkit.org/show_bug.cgi?id=182671),
this can be converted.

Example
----
<div class="flex border-purple-20 width-full justify-content-between">
    <div class="width-1/2 pad-2x space-v">
        <div>
            <label class="block">Name</label>
            <input type="text" name="name" />
        </div>
        <div>
            <label class="block">Birthdate</label>
            <input type="date" name="born" />
        </div>
        <div>
            <label class="block">
                <input type="checkbox" name="allStar" />
                All Star
            </label>
        </div>
        
        <div>
            <label class="block">
                <input type="radio" name="bats" value="left" />
                Bats Left
            </label>
            <label class="block">
                <input type="radio" name="bats" value="right" />
                Bats Right
            </label>
        </div>
        <div>
            <label class="block">Position</label>
            <select name="position" data-blank="true">
                <option>1B</option>
                <option>2B</option>
                <option>3B</option>
                <option>SS</option>
            </select>
        </div>
        <div>
            <label class="block">Snack Preferences</label>
            <select name="preferences[snacks]" multiple>
                <option value="seeds">Sunflower Seeds</option>
                <option value="snickers">Snickers</option>
                <option value="chips">Chips</option>
            </select>
        </div>
        <div>
            <label class="block">Bio</label>
            <textarea name="bio"></textarea>
        </div>
        <div>
            <label class="block">Favorite Moment in History</label>
            <input type="datetime-local" name="farvoriteMoment" />
        </div>
        <div>
            <button name="captain" value="hell yeah!" type="button" class="uniformButton">
                Promote to Captain
            </button>
        </div>
    </div>
    <div class="data pad-2x bg-gray-90 text-green"></div>
</div>
<script>
    
    class Player {
        _attributes = {}
        _listeners = []
        constructor (attrs) {
            ['name', 'allStar', 'position', 'bats', 'preferences', 'born', 'bio', 'farvoriteMoment', 'captain'].forEach(k => {
                Object.defineProperty(this, k, {
                    get: () => this._attributes[k],
                    set: (v) => {
                        this._attributes[k] = v
                        this.dispatchEvent('change');
                    }
                })
            })
            Object.keys(attrs).forEach(k => {
                this._attributes[k] = attrs[k]
            })
        }
        
        addEventListener (type, listener) {
            this._listeners.push([type, listener])
        }

        dispatchEvent (type) {
            this._listeners.forEach(listener => {
                if (listener[0] == type) {
                    listener[1]()
                }
            })
        }
    }

    const player = new Player({
        name: 'Corey Seager',
        born: new Date('1986-03-06'),
        bats: 'left', position: 'SS',
        allStar: true,
        preferences: {
            snacks: ['snickers', 'chips']
        },
        bio: 'Super badass dood.',
        farvoriteMoment: new Date('2023-11-04T04:12:00'),
        captain: 'no'
    })
    player.addEventListener('change', () => {
        renderAttributes()
    })

    function renderAttributes () {
        document.querySelector('.data').innerHTML = JSON.stringify(player._attributes).replaceAll(/(\"[a-zA-Z]+\")\:/g, "<br>$1:").replace("}", "<br>}")
    } 

    document.addEventListener('DOMContentLoaded', () => {
        renderAttributes()
        document.querySelectorAll('input, select, textarea, button').forEach(input => {
            let type = input.type
            if (input.tagName == "SELECT") { type = "select" }
            input.replaceWith(Input.create(type, {
                record: player,
                attribute: input.name.includes('[') ? input.name.replace(/\]$/, '').split(/\]?\[/) : input.name,
                name: input.name,
                options: Array.from(input.querySelectorAll('option')).map(x => x.value ? [x.value, x.innerText] : x.innerText),
                value: input.value == '' ? undefined : input.value,
                multiple: input.multiple,
                includeBlank: input.dataset.blank,
                class: input.getAttribute('class'),
                content: input.tagName == "BUTTON" ? input.textContent : null
            }))
        })
    })
</script>

Syntax
----
```javascript
Input.create('number', {})
// <input ...>
Input.new('number', {})
// Input()
```

Options
----
record:
    types: Object
    description: Object to bind to
attribute:
    types: String
    description: Attribute of the Object to bind to
dump:
    types: Function
    arguments: value
    description: transform textContent to value on change
load:
    types: Function
    arguments: value
    description: transform value for input's content

*/

import KompElement from './element.js';
import ContentArea from './content-area.js';
import { except, dig, bury } from '../support.js';
import { createElement, HTML_ATTRIBUTES } from 'dolla';

export default class Input {
    
    static assignableAttributes = {
        record: null,
        attribute: null,
        dump: (v, record) => v,
        load: (v, record) => v
    }
    
    static create(type, options={}) {
        return this.new(type, options).input
    }
    
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
        Object.keys(this.constructor.assignableAttributes).forEach(k => {
            if (options[k] != undefined) {
                this[k] = options[k]
            }
        })
        if (typeof this.dump != "function") {
            this.dump = v => v
        }
        if (typeof this.load != "function") {
            this.load = v => v
        }
        this.input = this.createInput(except(options, 'load', 'dump'));
        this.input._loading = this._load(null, options.value);
        this.setupInputListener(this.inputChange.bind(this));
        this.setupRecordListener(this.recordChange.bind(this));
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
    
    setupRecordListener (listener) {
        if (this.record && this.record.addEventListener) {
            this.record.addEventListener('change', listener);
        }
        if (this.record && this.record.addListener) {
            this.record.addListener(listener)
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
    
    recordChange () {
        this.input._loading = this._load()
    }
    
    _load (e, v) {
        const value = this.load(v ? v : this._loadValue(), this.record, {explicitValue: v})
        if (value !== undefined && value !== null) {
            this.input.value = value
        }
    }
    
    _loadValue () {
        if (this.record) {
            return dig(this.record, this.attribute)
        }
    }
    
    _dump (e, v) {
        const value = this.dump(v ? v : this.input.value, this.record)
        return this._dumpValue(value)
    }
    
    _dumpValue(v) {
        let attributes = Array.isArray(this.attribute) ? this.attribute : [this.attribute]
        attributes = attributes.concat([v])
        bury(this.record, ...attributes)
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