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

    static watch = ['anchor']
    
    static assignableAttributes = {
        mouseevent: 'click',
        placement: 'bottom',
        autoPlacement: false,
        flip: true,
        shift: true,
        strategy: 'absolute',
        arrow: false,
        removeOnBlur: true,
        timeout: 0,
    }
    
    static bindMethods = ['toggle']
    
    constructor (options, ...args) {
        super(options, ...args)
        this.anchorChanged(this.anchor, this.anchor)
        if (options === undefined) {
            this.needsFirstRemoval = true
        }
    }
    
    connected (...args) {
        super.connected(...args)
        this.addEventListener('mouseenter', this.#clearHide.bind(this))
        if (this.mouseevent == "mouseenter") {
            this.addEventListener('mouseleave', this.hide.bind(this))
        }
    }
    
    /**
     * Show the dropdown and add `-active` class to the anchor
     * @returns {Dropdown} this
     */
    show () {
        super.show()
        this.anchor.classList.add('-active')
        return this
    }

    /**
     * Hide the dropdown and remove `-active` class from the anchor
     * @returns {Dropdown} this
     */
    hide () {
        super.hide()
        this.anchor.classList.remove('-active')
        return this
    }
    
    anchorChanged (was, now) {
        if (this.mouseevent == "mouseenter") {
            super.anchorChanged(was, now)
        } else {
            if (was && was instanceof HTMLElement) {
                was.removeEventListener(this.mouseevent, this.toggle.bind(this))
            }
            if (now && now instanceof HTMLElement) {
                now.addEventListener(this.mouseevent, this.toggle.bind(this))
            }
        }
    }
    
    #clearHide () {
        if (this._hideTimeout) {
            clearTimeout(this._hideTimeout)
            delete this._hideTimeout
        }
    }

}
window.customElements.define('komp-dropdown', Dropdown);