/**
 * A custom select element that renders a button trigger and a toggleable list
 * of button options. Clicking the button toggles the list open and closed. By
 * default the list is positioned in a {@link Floater} popup; with `inline` it
 * is appended below the button instead.
 *
 * @class Select
 * @extends FormField
 *
 * @param {Object} [options={}]
 * @param {Object} [options.target] - Object to bind to
 * @param {string} [options.attribute] - Attribute of the Object to bind to
 * @param {Array} [options.options] - Array of options. Each can be a string or [value, label] array
 * @param {boolean} [options.inline] - render the option list inline below the button instead of in a popup Floater
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

import FormField from './form-field.js';
import Floater from './floater.js';
import { createElement, content, listenerElement, trigger } from 'dolla';
import { dig, bury } from '../support.js';

export default class Select extends FormField {
    static tagName = 'komp-select'

    static assignableAttributes = {
        name: { type: 'string', default: null, null: true },
        target: { type: 'object', default: null, null: true },
        attribute: { type: 'string', default: null, null: true },
        placeholder: { type: 'string', default: 'Select an option...', null: false },
        options: { type: 'object', default: null, null: true },
        inline: { type: 'boolean', default: false, null: false },
        dump: { type: 'function', default: v => v, null: false },
        load: { type: 'function', default: v => v, null: false }
    }
    
    static bindMethods = ['onKeyDown', 'toggle']

    static typeaheadTimeout = 600

    showing = false
    _typeBuffer = ''
    _typeTimer = null

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
        this.setFormValue(dumped != null ? String(dumped) : null)
        this.renderButton()
        const list = this.optionsList
        if (list) {
            list.querySelector('.-active')?.classList?.remove('-active')
            list.querySelectorAll('button[role="option"]').forEach(b => b.setAttribute('aria-selected', 'false'))
            const current = Array.from(list.querySelectorAll('button')).find(b => b.value == v)
            current?.classList?.add('-active')
            current?.setAttribute('aria-selected', 'true')
        }

        this.trigger('change')
    }

    connected () {
        this._initialValue = this.value
        this.renderButton()
        this.append(this.button)

        const currentValue = this.value
        if (currentValue != null) {
            this.setFormValue(String(this.dump(currentValue)))
        }

        this.optionsList = createElement('komp-select-options', {
            role: 'listbox',
            content: this.renderOptions()
        })

        this.button.addEventListener('click', this.toggle)
        this.addEventListener('keydown', this.onKeyDown)
        if (this._initialTypeAhead) {
            this.typeahead(this._initialTypeAhead)
            delete this._initialTypeAhead
        }
    }

    /**
     * Show the option list. When `inline`, the list is appended below the
     * button; otherwise it is rendered in a {@link Floater} anchored to the
     * button. Floater state is mirrored back via its `shown`/`hidden` events.
     * @returns {Select} this
     */
    show () {
        if (this.showing) return this
        if (this.inline) {
            this.append(this.optionsList)
            this.afterShow()
        } else {
            if (!this.floater) {
                this.floater = new Floater({
                    anchor: this.button,
                    placement: 'bottom-start',
                    autoPlacement: false,
                    flip: true,
                    removeOnBlur: true,
                    content: this.optionsList,
                    onShown: () => this.afterShow(),
                    onHidden: () => this.afterHide()
                })
            }
            this.floater.show()
        }
        return this
    }

    /**
     * Hide the option list.
     * @returns {Select} this
     */
    hide () {
        if (!this.showing) return this
        if (this.inline) {
            this.optionsList.remove()
            this.afterHide()
        } else {
            this.floater.hide()
        }
        return this
    }

    /**
     * Toggle the option list open or closed.
     * @returns {Select} this
     */
    toggle () {
        return this.showing ? this.hide() : this.show()
    }

    afterShow () {
        this.showing = true
        this.toggleAttribute('open', true)
        this.button.setAttribute('aria-expanded', 'true')
        if (this.floater) this.floater.style.minWidth = this.offsetWidth + "px"
    }

    afterHide () {
        this.showing = false
        this.toggleAttribute('open', false)
        this.button.setAttribute('aria-expanded', 'false')
    }

    onKeyDown (e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault()
            if (!this.showing) this.show()
            this.moveFocus(e.key === 'ArrowDown' ? 1 : -1)
        } else if (e.key === 'Escape') {
            if (this.showing) {
                this.hide()
                this.button.focus()
            }
        } else if (e.key === 'Tab' && this.showing) {
            const current = this.optionsList.querySelector('button:focus');
            if (current) {
                trigger(current, 'click')
            }
        } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            this.typeahead(e.key)
        }
    }

    /**
     * Move focus between option buttons, wrapping around.
     * @param {number} direction - 1 for next, -1 for previous
     */
    moveFocus (direction) {
        const items = Array.from(this.optionsList.querySelectorAll(Select.FOCUSABLE_SELECTOR))
        if (!items.length) return
        const index = items.indexOf(document.activeElement)
        const next = index === -1
            ? (direction > 0 ? 0 : items.length - 1)
            : (index + direction + items.length) % items.length
        items[next].focus()
    }

    typeahead (char) {
        if (!this.optionsList) {
            this._initialTypeAhead = char
            return
        }
        clearTimeout(this._typeTimer)
        this._typeTimer = setTimeout(() => { this._typeBuffer = '' }, this.constructor.typeaheadTimeout)

        const buffer = (this._typeBuffer + char).toLowerCase()
        const buttons = Array.from(this.optionsList.querySelectorAll('button[role="option"]'))
        let match = buttons.find(b => b.textContent.trim().toLowerCase().startsWith(buffer))

        // If a single repeated character doesn't extend an existing match,
        // cycle to the next option starting with that character.
        if (!match && this._typeBuffer && buffer === char.toLowerCase().repeat(buffer.length)) {
            const focused = this.optionsList.querySelector('button:focus')
            const startIndex = focused ? buttons.indexOf(focused) + 1 : 0
            const c = char.toLowerCase()
            match = buttons.slice(startIndex).find(b => b.textContent.trim().toLowerCase().startsWith(c))
                ?? buttons.find(b => b.textContent.trim().toLowerCase().startsWith(c))
            this._typeBuffer = char
        } else {
            this._typeBuffer = buffer
        }

        if (match) {
            if (!this.showing) this.show()
            match.focus()
        }
    }

    disconnected () {
        this.floater?.remove()
        this.removeEventListener('keydown', this.onKeyDown )
    }

    formResetCallback () {
        this.value = this._initialValue
    }

    renderButton () {
        if (!this.button) {
            this.button = createElement('button', {
                type: 'button',
                class: 'komp-select-value',
                role: 'combobox',
                'aria-haspopup': 'listbox',
                'aria-expanded': 'false'
            })
        }
        content(this.button, this.labelFor(this.value) ?? createElement('span', {
            class: '-placeholder',
            content: this.placeholder
        }))
        return this.button
    }

    renderOptions () {
        const currentValue = this.value
        return this.options.map(option => {
            const value = Array.isArray(option) ? option[0] : option
            const label = Array.isArray(option) ? option[1] : option
            const isSelected = value == currentValue
            const attrs = {
                type: 'button',
                tabindex: -1,
                content: label,
                class: isSelected ? '-active' : '',
                role: 'option',
                'aria-selected': isSelected ? 'true' : 'false'
            }
            if (!!value) {
                attrs.value = value
            }
            return listenerElement('button', attrs, 'click', e => {
                this.button.focus()
                this.hide()
                // value triggers 'change' which needs to come after
                // focus/hide so spreadsheet can focus cell
                this.value = e.currentTarget.getAttribute('value')
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
        
        komp-select[open]:has(komp-floater.-top) {
            & > button {
                border-top-left-radius: 0;
                border-top-right-radius: 0;
            }
        }
        komp-select[open]:has(komp-floater.-bottom) {
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
            & .-placeholder {
                opacity: 0.7   
            }
        }
        komp-select komp-floater {
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
        }

        komp-select komp-select-options {
            display: block;
        }

        /* Inline mode: while open, the list sits in flow joined to the button */
        komp-select[inline][open] > button {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
        }
        komp-select[inline] komp-select-options {
            background: white;
            border: 1px solid gray;
            border-top: none;
            border-bottom-left-radius: 0.25em;
            border-bottom-right-radius: 0.25em;
            overflow: hidden;
        }

        komp-select komp-select-options button {
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
    `

    static { this.define() }
}
