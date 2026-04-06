/**
 * Assign a floater panel to a {@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent MouseEvent}
 *
 * @class Dropdown
 * @extends Floater
 *
 * @param {Object} [options={}]
 * @param {string} [options.mouseevent="click"] - MouseEvent that toggles floater
 * @param {boolean} [options.removeOnBlur=true] - Hide dropdown when user clicks outside or focuses elsewhere
 * @param {number} [options.timeout=0] - Milliseconds to wait before hiding dropdown after mouseleave
 *
 * @example <caption>JS</caption>
 * new Dropdown({
 *     content: createElement({
 *         class: 'bg-white pad',
 *         content: 'Hello World'
 *     }),
 *     anchor: '#hi-button'
 * })
 *
 * @example <caption>HTML</caption>
 * <komp-dropdown anchor="#hi-button">
 *     Hello World
 * </komp-dropdown>
 */

import { createElement, remove } from 'dolla';
import Floater from './floater.js';

export default class Dropdown extends Floater {
    static tagName = 'komp-dropdown'
    static { this.define() }

    static watch = ['anchor']
    
    static assignableAttributes = {
        mouseevent: { type: 'string', default: 'click', null: false },
        placement: { type: 'string', default: 'bottom', null: false },
        autoPlacement: { type: 'boolean', default: false, null: false },
        flip: { type: 'boolean', default: true, null: false },
        shift: { type: 'boolean', default: true, null: false },
        strategy: { type: 'string', default: 'absolute', null: false },
        arrow: { type: 'boolean', default: false, null: false },
        removeOnBlur: { type: 'boolean', default: true, null: false },
        timeout: { type: 'number', default: 0, null: false },
    }
    
    static bindMethods = ['anchorKeydown']
    
    constructor (options, ...args) {
        super(options, ...args)
        this.anchorChanged(this.anchor, this.anchor)
        if (options === undefined) {
            this.needsFirstRemoval = true
        }
    }
    
    connected (...args) {
        super.connected(...args)
        this.setAttribute('role', 'listbox');
        this.addEventListener('mouseenter', this.#clearHide.bind(this))
        if (this.mouseevent == "mouseenter") {
            this.addEventListener('mouseleave', this.hide.bind(this))
        }

        // Keyboard navigation within dropdown
        this.addEventListener('keydown', e => {
            if (e.key === 'Tab') {
                this.hide()
                if (this.anchor instanceof HTMLElement) {
                    this.anchor.focus()
                }
                return
            }
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault()
                const items = Array.from(this.querySelectorAll(Dropdown.FOCUSABLE_SELECTOR))
                if (!items.length) return
                const index = items.indexOf(document.activeElement)
                if (e.key === 'ArrowDown') {
                    const next = index < items.length - 1 ? index + 1 : 0
                    items[next].focus()
                } else {
                    const prev = index > 0 ? index - 1 : items.length - 1
                    items[prev].focus()
                }
            }
        })
        
        // Set initial focus to autofocus element or first focusable
        const initialFocus = this.querySelector('[autofocus]') || this.querySelector(Dropdown.FOCUSABLE_SELECTOR)
        if (initialFocus) {
            initialFocus.focus()
        }
    }
    
    /**
     * Show the dropdown and add `-active` class to the anchor
     * @returns {Dropdown} this
     */
    show () {
        super.show()
        this.anchor.classList.add('-active')
        if (this.anchor instanceof HTMLElement) {
            this.anchor.setAttribute('aria-expanded', 'true');
        }
        return this
    }

    /**
     * Hide the dropdown and remove `-active` class from the anchor
     * @returns {Dropdown} this
     */
    hide () {
        super.hide()
        this.anchor.classList.remove('-active')
        if (this.anchor instanceof HTMLElement) {
            this.anchor.setAttribute('aria-expanded', 'false');
        }
        return this
    }
    
    anchorChanged (was, now) {
        if (was && was instanceof HTMLElement) {
            was.removeAttribute('aria-haspopup')
            was.removeAttribute('aria-expanded')
        }
        if (now && now instanceof HTMLElement) {
            now.setAttribute('aria-haspopup', 'listbox')
            now.setAttribute('aria-expanded', String(this.showing))
        }
        if (this.mouseevent == "mouseenter") {
            super.anchorChanged(was, now)
        } else {
            if (was && was instanceof HTMLElement) {
                was.removeEventListener(this.mouseevent, this.toggle)
                now.removeEventListener('keydown', this.anchorKeydown)
            }
            if (now && now instanceof HTMLElement) {
                now.addEventListener(this.mouseevent, this.toggle)
                now.addEventListener('keydown', this.anchorKeydown)
            }
        }
    }
    
    anchorKeydown (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            this.toggle()
        }
    }
    
    #clearHide () {
        if (this._hideTimeout) {
            clearTimeout(this._hideTimeout)
            delete this._hideTimeout
        }
    }

}
