/**
 * A plain Form helper (not a custom element) that builds a native `<form>`
 * and binds inputs to a target object, providing before/after submit hooks.
 *
 * @class Form
 *
 * @example <caption>JS</caption>
 * const el = Form.create(player, {
 *     content: f => [
 *         f.label('name'),
 *         f.text('name'),
 *         f.submit('Save')
 *     ],
 *     afterSubmit: rec => doSomething(rec)
 * })
 * document.body.append(el)
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
