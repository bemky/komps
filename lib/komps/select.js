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
import { createElement, content, listenerElement, trigger } from 'dolla';
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
    
    static bindMethods = ['onKeyUp', 'onKeyDown']

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
        this.dropdown.querySelector('.-active')?.classList?.remove('-active')
        const current = Array.from(this.dropdown.querySelectorAll('button')).find(b => b.value == v)
        current?.classList?.add('-active')
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
        this.dropdown.addEventListener('shown', () => {
            this.toggleAttribute('open', this.dropdown.showing)
            this.dropdown.style.minWidth = this.offsetWidth + "px"
        })
        this.dropdown.addEventListener('hidden', () => {
            this.toggleAttribute('open', this.dropdown.showing)
        })
        
        this.addEventListener('keyup', this.onKeyUp)
        this.addEventListener('keydown', this.onKeyDown)
    }
    
    onKeyUp (e) {
        if (e.key === 'Tab') {
            const current = this.dropdown.querySelector('button:focus');
            if (current) {
                trigger(current, 'click')
            }
        }
    }
    
    onKeyDown (e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            e.stopPropagation();
            const current = this.dropdown.querySelector('button:focus');
    
            if (current) {
                const sibling = e.key === 'ArrowUp' ? 'previousElementSibling' : 'nextElementSibling';
                const target = current[sibling];
                if (target?.tagName === 'BUTTON') {
                    target.focus();
                } else if (e.key === 'ArrowUp') {
                    this.button.focus();
                }
            } else if (e.key === 'ArrowDown') {
                this.dropdown.querySelector('button')?.focus();
            }
        }
    }
    
    disconnected () {
        this.dropdown.remove()
        this.removeEventListener('keyup', this.onKeyUp )
        this.removeEventListener('keydown', this.onKeyDown )
    }

    renderButton () {
        if (this.button) {
            content(this.button, this.labelFor(this.value))
        }
    }

    renderOptions () {
        const currentValue = this.value
        return this.options.map(option => {
            const value = Array.isArray(option) ? option[0] : option
            const label = Array.isArray(option) ? option[1] : option
            return listenerElement('button', {
                type: 'button',
                tabIndex: -1,
                content: label,
                class: value == currentValue ? '-active' : undefined,
                value: value
            }, 'click', e => {
                this.value = e.currentTarget.value
                this.dropdown.hide()
                this.button.focus()
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
            --select-oklch: 57.37% 0.1946 257.86;
            --select-color: oklch(var(--select-oklch));
            display: inline-block;
        }
        
        komp-select[open]:has(komp-dropdown.-top) {
            & > button {
                border-top-left-radius: 0;
                border-top-right-radius: 0;
            }
        }
        komp-select[open]:has(komp-dropdown.-bottom) {
            & > button {
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
            }
        }
        
        komp-select[open] > button {
            position: relative;
            z-index: 2;
        }
        
        komp-select > button {
            background: white;
            cursor: pointer;
            appearance: none;
            border: none;
            outline: none;
            padding: 0;
            color: inherit;
            font: inherit;
            text-align: left;
            width: 100%;
            border-radius: 0.25em;
            padding: 0.4em 0.6em;
            border: 1px solid gray;
            border-radius: 0.25em;
            width: 100%;
            cursor: pointer;
            &:hover,
            &:focus {
                border-color: blue;
            }
        }
        komp-select komp-dropdown {
            z-index: 1;
            background: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            overflow: hidden;
            border-radius: 0.35em;
            &.-bottom {
                border-top-left-radius: 0;
                border-top-right-radius: 0;
            }
            &.-top {
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
            }
            
            button {
                cursor: pointer;
                appearance: none;
                outline: none;
                border: 1px solid transparent;
                background: none;
                width: 100%;
                padding: 0.25em 0.5em;
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