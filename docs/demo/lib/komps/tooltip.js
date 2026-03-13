/**
 * Assign a message to show on hover.
 *
 * @class Tooltip
 * @extends Floater
 *
 * @param {Object} [options={}]
 * @param {number} [options.timeout=300] - ms to wait until hiding after mouseout
 * @param {string} [options.scope="general"] - showing a tooltip will hide all other tooltips of same scope
 * @param {boolean} [options.enabled=true] - set starting state
 *
 * @example <caption>JS</caption>
 * new Tooltip({
 *     content: "Hello World",
 *     anchor: '#hi-button'
 * })
 *
 * @example <caption>HTML</caption>
 * <komp-tooltip anchor="#hi-button">
 *     Hello World
 * </komp-tooltip>
 */

import { createElement, remove } from 'dolla';
import Floater from './floater.js'; 

export default class Tooltip extends Floater {
    static tagName = 'komp-tooltip'
    static watch = ['anchor']
    
    static assignableAttributes = {
        autoPlacement: false,
        flip: true,
        shift: true,
        strategy: 'absolute',
        placement: 'top',
        arrow: true,
        timeout: 300,
        scope: 'general'
    }
    
    constructor (options={}, ...args) {
        super(options, ...args)
        this.anchorChanged(this.anchor, this.anchor)
        if (options === undefined) {
            this.needsFirstRemoval = true
        }
        if (options.enabled != false) {
            this.enable()
        }
    }
    
    enable () {
        this.anchor.addEventListener('mouseenter', this.show)
        this.anchor.addEventListener('mouseleave', this.hide)
        this.addEventListener('mouseenter', this.show)
        this.addEventListener('mouseleave', this.hide)
    }
    
    disable () {
        this.anchor.removeEventListener('mouseenter', this.show)
        this.anchor.removeEventListener('mouseleave', this.hide)
        this.removeEventListener('mouseenter', this.show)
        this.removeEventListener('mouseleave', this.hide)
    }
    
    connected () {
        super.connected();
        if (this.getRootNode() == this.anchor.getRootNode()) {
            if (this.showing == false) {
                remove(this);
                return false
            }
        }
    }
    
    anchorChanged (was, now) {
        if (was && was.removeEventListener) {
            was.removeEventListener('mouseenter', this.show)
            was.removeEventListener('mouseleave', this.hide)
        }
        if (now && now.addEventListener) {
            now.addEventListener('mouseenter', this.show)
            now.addEventListener('mouseleave', this.hide)
        }
    }
    
    async remove () {
        await super.remove()
        if (window.activeTooltips[this.scope] == this) {
            delete window.activeTooltips[this.scope]
        }
    }

}
window.customElements.define('komp-tooltip', Tooltip);