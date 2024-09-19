/*
Description
----
A wrapper for an input element that binds the value of the input to an object

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
            input.replaceWith(new Input({
                record: player,
                attribute: input.name.includes('[') ? input.name.replace(/\]$/, '').split(/\]?\[/) : input.name,
                type: type,
                name: input.name,
                options: Array.from(input.querySelectorAll('option')).map(x => x.value ? [x.value, x.innerText] : x.innerText),
                value: input.value,
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
new Input({

})
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

Events
----
change:
    description: fired on focusout when value has changed
    arguments: newValue, oldValue

*/

import KompElement from './element.js';
import { except, dig, bury } from '../support.js';
import { createElement, HTML_ATTRIBUTES } from 'dolla';

export default class Input extends KompElement {
    static tagName = "komp-input"
    
    static assignableAttributes = {
        record: null,
        attribute: null,
        dump: (v, record) => v,
        load: (v, record) => v
    }
    
    constructor (options) {
        const optionsWas = Object.assign({}, options)
        const prototype = {
            button: ButtonInput.prototype,
            checkbox: BinaryInput.prototype,
            radio: BinaryInput.prototype,
            select: SelectInput.prototype,
            date: DateInput.prototype,
            textarea: TextareaInput.prototype,
            'datetime-local': DateTimeInput.prototype
        }[options.type]
        
        super(except(options, ...HTML_ATTRIBUTES));
        if (typeof this.dump != "function") {
            this.dump = v => v
        }
        if (typeof this.load != "function") {
            this.load = v => v
        }
        
        if (prototype) {
            this.__proto__ = prototype
        }
        
        this.input = this.createInput(options);
        this._load();
        this.append(this.input);
        this.setupInputListener(this.inputChange.bind(this));
        this.setupRecordListener(this.recordChange.bind(this));
    }
    
    createInput (options) {
        return createElement('input', Object.assign({
            type: 'text'
        }, options))
    }
    
    setupInputListener (listener) {
        this.input.addEventListener('change', listener);
    }
    
    setupRecordListener (listener) {
        if (this.record.addEventListener) {
            this.record.addEventListener('change', listener);
        }
        if (this.record.addListener) {
            this.record.addListener(listener)
        }
    }
    
    inputChange () {
        const valueWas = this.load(this._loadValue())
        const value = this._dump()
        this.trigger('change', value, valueWas)
    }
    
    recordChange () {
        this._load()
    }
    
    _load (e, v) {
        this.input.value = this.load(v ? v : this._loadValue())
    }
    
    _loadValue () {
        return dig(this.record, this.attribute)
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
    
    static style = `
        komp-input {
            display: contents;
        }
    `
}
window.customElements.define(Input.tagName, Input);

class BinaryInput extends Input {
    _load () {
        const value = this.load(this._loadValue())
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
}

class DateInput extends Input {
    setupInputListener () {
        this.input.addEventListener('blur', this._dump.bind(this));
    }
    
    _load (e) {
        let value = this._loadValue()
        if (value instanceof Date) {
            value = [
                value.getUTCFullYear(),
                (value.getMonth() + 1).toString().padStart(2, "0"),
                value.getDate().toString().padStart(2, "0")
            ].join("-")
        }
        super._load(e, value)
    }
    
    _dump (e) {
        let value = this.input.value
        if (value == "") value = null
        super._dump(e, value)
    }
}

class DateTimeInput extends Input {
    _load (e) {
        let value = this._loadValue()
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
    createInput (options) {
        const input = createElement('select', options)
        if (options.includeBlank) {
            input.append(createElement('option', Object.assign({
                content: 'Unset',
                value: null
            }, options.includeBlank)))
        }
        options.options.forEach(option => {
            input.append(createElement('option', {
                content: Array.isArray(option) ? option[1] : option,
                value: Array.isArray(option) ? option[0] : option
            }))
        })
        return input
    }
    _load (e) {
        if (this.input.multiple) {
            const values = this.load(this._loadValue());
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