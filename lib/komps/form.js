/*

Description
----
A plain Form helper (not a custom element) that builds a native `<form>`
and binds inputs to a target object, providing before/after submit hooks.

Usage
----
```javascript
const el = Form.create(player, {
    content: f => [
        f.label('name'),
        f.text('name'),
        f.submit('Save')
    ],
    afterSubmit: rec => doSomething(rec)
})
document.body.append(el)
```

Example
----
<div class="flex border-purple-20 width-full justify-content-between">
    <div class="width-1/2 pad-2x flex justify-content-center">
        <div class="form-container flex-none uniformInputs bg-white rounded-xl border">
        </div>
    </div>
    <div class="data pad-2x bg-gray-90 text-green"></div>
</div>
<script>
    class Player {
        _attributes = {}
        _listeners = []
        constructor (attrs) {
            ['name','allStar','position','bats','preferences','born','bio','favoriteMoment','captain'].forEach(k => {
                Object.defineProperty(this, k, {
                    get: () => this._attributes[k],
                    set: (v) => { this._attributes[k] = v; this.dispatchEvent('change') }
                })
            })
            Object.keys(attrs || {}).forEach(k => { this._attributes[k] = attrs[k] })
        }
        addEventListener (type, listener) { this._listeners.push([type, listener]) }
        dispatchEvent (type) { this._listeners.forEach(([t, l]) => { if (t === type) l() }) }
        async save () { return true }
    }

    const player = new Player({
        name: 'Corey Seager',
        born: new Date('1986-03-06'),
        bats: 'left', position: 'SS',
        position: 'SS'    })

    function renderAttributes () {
        document.querySelector('.data').innerHTML = JSON.stringify(player._attributes)
            .replaceAll(/(\"[a-zA-Z]+\")\:/g, '<br>$1:')
            .replace('}', '<br>}')
    }
    player.addEventListener('change', renderAttributes)

    document.addEventListener('DOMContentLoaded', () => {
        const notificationCenter = new NotificationCenter()
        document.body.append(notificationCenter)
        
        renderAttributes()
        const formEl = Form.create(player, {
            content: f => [
                {
                    class: 'flex flex-wrap gap-xl pad-2x',
                    content: [{
                        class: 'space-v',
                        content: [
                            {
                                content: [
                                    f.label('name'),
                                    f.text('name')
                                ]
                            },
                            {
                                content: [
                                    f.label('born'),
                                    f.date('born')
                                ]
                            }
                        ]
                    },
                    {
                        class: 'space-v min-width-100-px',
                        content: [
                            {
                                content: [
                                    f.label('bats'),
                                    f.select('bats', { options: ['left','right'] })
                                ]
                            },
                            {
                                content: [
                                    f.label('position'),
                                    f.select('position', { options: ['1B','2B','3B','SS'] })
                                ]
                            }
                        ]
                    }].map(fields => {
                        fields.content.forEach(field => {
                            field.content[0].classList.add("block", "text-bold", "margin-bottom-1/2x")
                            field.content[1].classList.add('width-full')
                            return field
                        })
                        return fields
                    })
                },
                {
                    class: 'border-top border-purple-10 pad-h-2x pad-v text-right',
                    content: f.submit('Save', {class: 'uniformButton -green'})
                }
            ],
            afterSubmit: rec => {
                notificationCenter.add('Saved!', {
                    class: 'text-bold bg-green bg-opacity-80 rounded border-green-70 border text-white pad-h pad-v-1/2x bottom-0 right-0'
                })
            }
        })
        document.querySelector('.form-container').append(formEl)
    })
</script>
*/

import Input from './input.js';
import { createElement, content as setContent } from 'dolla';
import { titleize } from '../support.js';

export default class Form {
    static inputTypes = [
        'text',
        'tel',
        'password',
        'radio',
        'checkbox',
        'textarea',
        'select',
        'date',
        'datetime-local',
        'button',
        'number',
        'range'
    ]

    static create (target, options = {}) {
        return this.new(target, options).el
    }

    static new (target, options = {}) {
        return new this(target, options)
    }

    constructor (target, options = {}) {
        this.target = target
        const { content, beforeSubmit, afterSubmit, ...attrs } = options || {}
        this.beforeSubmit = beforeSubmit
        this.afterSubmit = afterSubmit

        // build native form element
        this.el = createElement('form', attrs)
        this.el.addEventListener('submit', this.onSubmit.bind(this))

        // attach type helpers
        this.constructor.inputTypes.forEach(type => {
            this[type] = (attr, o) => this.input(attr, Object.assign({}, o, { type }))
        })

        if (typeof content === 'function') {
            setContent(this.el, content(this))
        }
    }

    id (attribute, options = {}) {
        if (!this._uid) { this._uid = Math.random().toString(36).slice(2) }
        const parts = [this._uid, attribute, options && options.value]
        return parts.filter(Boolean).join('-')
    }

    // Helper to generate bound inputs using komps Input
    input (attribute, options = {}) {
        const { type = 'text', ...rest } = options
        const id = this.id(attribute, options)
        const input = Input.create(type, Object.assign({
            target: this.target,
            attribute: attribute,
            id: id,
        }, rest))
        return input
    }

    // Helper to build a label linked to generated id
    label (attribute, contentOrOptions, maybeOptions) {
        let content = contentOrOptions
        let options = maybeOptions || {}
        if (typeof content === 'object' && !(content instanceof Node)) {
            options = content || {}
            content = undefined
        }
        if (content == null) { content = titleize(attribute) }
        return createElement('label', Object.assign({
            for: this.id(attribute, options),
            content: content
        }, options))
    }

    // Create a submit button helper
    submit(labelOrOptions, maybeOptions) {
        let content = 'Save'
        let options = maybeOptions || {}
        if (typeof labelOrOptions === 'object') {
            options = labelOrOptions || {}
            content = options.content || content
        } else if (labelOrOptions != null) {
            content = labelOrOptions
        }
        const attrs = Object.assign({}, options.attrs || {}, { type: 'submit' })
        const rest = Object.assign({}, options)
        delete rest.attrs
        delete rest.content
        return createElement('button', Object.assign({ content }, rest, { attrs }))
    }

    async onSubmit(e) {
        e.preventDefault()
        this.disbableButtons()
        this.el.querySelector('button')?.focus()
        this.el.dispatchEvent(new CustomEvent('beforeSubmit'))

        try {
            if (typeof this.beforeSubmit === 'function') {
                const cont = await this.beforeSubmit(this.target)
                if (cont === false) { return }
            }

            if (this.target && typeof this.target.save === 'function') {
                const saved = await this.target.save()
                if (saved === false) { return }
            }

            if (typeof this.afterSubmit === 'function') {
                await this.afterSubmit(this.target)
            }
            this.el.dispatchEvent(new CustomEvent('afterSubmit'))
        } finally {
            this.enableButtons()
        }
    }

    disbableButtons() {
        this.submitButtons = []
        this.el.querySelectorAll('button').forEach(button => {
            const type = button.getAttribute('type') || 'submit'
            if (type === 'submit') {
                button.disabled = true
                this.submitButtons.push([button, button.innerHTML])
                button.innerHTML = '&#8729;&#8729;&#8729;'
            }
        })
        return this.submitButtons
    }

    enableButtons() {
        if (!this.submitButtons) return
        this.submitButtons.forEach(([button, html]) => {
            button.disabled = false
            button.innerHTML = html
        })
    }
}
