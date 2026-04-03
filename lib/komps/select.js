/**
 * A custom select element that renders a button trigger and a {@link Dropdown}
 * of button options.
 *
 * @class Select
 * @extends KompElement
 *
 * @param {Object} [options={}]
 * @param {Object} [options.target] - Object to bind to
 * @param {string} [options.attribute] - Attribute of the Object to bind to
 * @param {Array} [options.options] - Array of options. Each can be a string or [value, label] array
 * @param {function} [options.dump] - transform value before writing to target
 * @param {function} [options.load] - transform value when reading from target
 *
 * @example <caption>JS</caption>
 * new Select({
 *     target: record,
 *     attribute: 'status',
 *     options: [['active', 'Active'], ['inactive', 'Inactive']]
 * })
 */

import KompElement from './element.js';
import Dropdown from './dropdown.js';
import { createElement, content, listenerElement } from 'dolla';
import { dig, bury } from '../support.js';

export default class Select extends KompElement {
    static tagName = 'komp-select'

    static assignableAttributes = {
        target: { type: 'object', default: null, null: true },
        attribute: { type: 'string', default: null, null: true },
        options: { type: 'object', default: null, null: true },
        dump: { type: 'function', default: v => v, null: false },
        load: { type: 'function', default: v => v, null: false }
    }

    get value () {
        if (this.target && this.attribute) {
            return this.load(dig(this.target, this.attribute))
        }
    }

    set value (v) {
        const dumped = this.dump(v)
        if (this.target && this.attribute) {
            bury(this.target, this.attribute, dumped)
        }
        this.renderButton()
        this.trigger('change')
    }

    connected () {
        this.button = createElement('button', {
            type: 'button',
            class: 'komp-select-value',
            content: this.labelFor(this.value)
        })
        this.append(this.button)

        this.dropdown = new Dropdown({
            anchor: this.button,
            placement: 'bottom-start',
            content: this.renderOptions()
        })
    }

    renderButton () {
        if (this.button) {
            content(this.button, this.labelFor(this.value))
        }
    }

    renderOptions () {
        const currentValue = this.value
        return createElement('div', {
            class: 'komp-select-options',
            content: this.options.map(option => {
                const value = Array.isArray(option) ? option[0] : option
                const label = Array.isArray(option) ? option[1] : option
                return listenerElement('button', {
                    type: 'button',
                    content: label,
                    class: value == currentValue ? '-active' : undefined,
                    value: value
                }, 'click', e => {
                    this.value = e.currentTarget.value
                    this.dropdown.hide()
                })
            })
        })
    }

    labelFor (value) {
        const option = this.options?.find(o =>
            (Array.isArray(o) ? o[0] : o) == value
        )
        if (option) {
            return Array.isArray(option) ? option[1] : option
        }
        return value
    }

    static style = `
        komp-select {
            display: inline-block;
        }
        .komp-select-value {
            cursor: pointer;
            appearance: none;
            background: none;
            border: none;
            outline: none;
            padding: 0;
            color: inherit;
            font: inherit;
            text-align: left;
            width: 100%;
        }
        .komp-select-options {
            button {
                cursor: pointer;
                appearance: none;
                outline: none;
                border: 1px solid transparent;
                background: none;
                width: 100%;
                padding: 0.5em;
                display: block;
                text-align: left;
                text-decoration: none;
                color: inherit;
                &:hover {
                    background: rgba(0,0,0, 0.1);
                }
                &[aria-pressed] {
                    background: oklch(var(--select-oklch) / 0.25);
                    color: var(--select-color);
                }
                &:focus,
                &.focus {
                    border: 1px dotted var(--select-color);
                    color: var(--select-color);
                }
                &.-active {
                    background: oklch(var(--select-oklch) / 0.1);
                    color: var(--select-color);
                }
            }
        }
    `
}
window.customElements.define(Select.tagName, Select);
