/**
 * A plain Form helper (not a custom element) that builds a native `<form>`
 * and binds inputs to a target object, providing submit hooks.
 *
 * @class Form
 *
 * @param {Object} target - the record object to bind inputs to
 * @param {Object} [options={}]
 * @param {function} [options.content] - function receiving the Form instance, returns content for the form. The Form instance provides type helpers (e.g. `f.text()`, `f.select()`, `f.checkbox()`) for each input type.
 * @param {function} [options.onSubmit] - event listener for submit. Call `event.preventDefault()` to cancel.
 * @param {function} [options.onSubmitted] - event listener fired after successful submit
 *
 * @fires Form#submit
 * @fires Form#submitted
 *
 * @example <caption>JS</caption>
 * const el = Form.create(player, {
 *     content: f => [
 *         f.label('name'),
 *         f.text('name'),
 *         f.submit('Save')
 *     ],
 *     onSubmitted: () => doSomething()
 * })
 * document.body.append(el)
 */

import Input from './input.js';
import { createElement, content as setContent, trigger } from 'dolla';
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

    /**
     * Create a Form and return the native `<form>` element
     * @param {Object} target - the record object to bind inputs to
     * @param {Object} [options={}] - see {@link Form} constructor options
     * @returns {HTMLFormElement} the built `<form>` element
     * @static
     */
    static create (target, options = {}) {
        return this.new(target, options).el
    }

    /**
     * Create and return a Form instance
     * @param {Object} target - the record object to bind inputs to
     * @param {Object} [options={}] - see {@link Form} constructor options
     * @returns {Form} the Form instance (access the element via `.el`)
     * @static
     */
    static new (target, options = {}) {
        return new this(target, options)
    }

    constructor (target, options = {}) {
        this.target = target
        const { content, onSubmit: onSubmitHook, onSubmitted, onBeforeSubmit, onAfterSubmit, ...attrs } = options || {}

        // build native form element
        this.el = createElement('form', attrs)

        // Bind lifecycle event listeners
        if (onSubmitHook || onBeforeSubmit) {
            if (onBeforeSubmit) console.warn('[Komps] Form option "onBeforeSubmit" is deprecated. Use "onSubmit" instead.')
            this.el.addEventListener('submit', (onSubmitHook || onBeforeSubmit))
        }
        if (onSubmitted || onAfterSubmit) {
            if (onAfterSubmit) console.warn('[Komps] Form option "onAfterSubmit" is deprecated. Use "onSubmitted" instead.')
            this.el.addEventListener('submitted', (onSubmitted || onAfterSubmit))
        }
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

    /**
     * Generate a bound {@link Input} element for the given attribute
     * @param {string} attribute - the target attribute name to bind to
     * @param {Object} [options={}]
     * @param {string} [options.type="text"] - input type (text, select, checkbox, date, etc.)
     * @returns {HTMLElement} the created input element
     */
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

    /**
     * Build a `<label>` linked to the input for the given attribute
     * @param {string} attribute - the attribute name (auto-titleized if no content given)
     * @param {string|Object} [contentOrOptions] - label text, or options object if no text
     * @param {Object} [maybeOptions] - options when first arg is content string
     * @returns {HTMLLabelElement}
     */
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

    /**
     * Create a submit `<button>`
     * @param {string|Object} [labelOrOptions="Save"] - button label text, or options object
     * @param {Object} [maybeOptions] - options when first arg is label string
     * @returns {HTMLButtonElement}
     */
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

        if (!trigger(this.el, 'submit', { detail: { target: this.target } })) {
            this.enableButtons()
            return
        }

        try {
            if (this.target && typeof this.target.save === 'function') {
                const saved = await this.target.save()
                if (saved === false) { return }
            }

            trigger(this.el, 'submitted', { detail: { target: this.target } })
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
