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
import { generateRefId } from '../support.js'; 

export default class Tooltip extends Floater {
    static tagName = 'komp-tooltip'
    static { this.define() }
    static watch = ['anchor']
    static bindMethods = ['anchorKeydown']
    
    static assignableAttributes = {
        autoPlacement: { type: 'boolean', default: false, null: false },
        flip: { type: 'boolean', default: true, null: false },
        shift: { type: 'boolean', default: true, null: false },
        strategy: { type: 'string', default: 'absolute', null: false },
        placement: { type: 'string', default: 'top', null: false },
        arrow: { type: 'boolean', default: true, null: false },
        timeout: { type: 'number', default: 300, null: false },
        scope: { type: 'string', default: 'general', null: false }
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
        this.setAttribute('role', 'tooltip');
        if (!this.id) {
            this.id = generateRefId('komp-tooltip');
        }
        if (this.anchor instanceof HTMLElement) {
            this.anchor.setAttribute('aria-describedby', this.id);
        }
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
            was.removeEventListener('focus', this.show)
            was.removeEventListener('blur', this.hide)
            was.removeEventListener('keydown', this.anchorKeydown)
        }
        if (now && now.addEventListener) {
            now.addEventListener('mouseenter', this.show)
            now.addEventListener('mouseleave', this.hide)
            now.addEventListener('focus', this.show)
            now.addEventListener('blur', this.hide)
            now.addEventListener('keydown', this.anchorKeydown)
        }
    }
    
    anchorKeydown (e) {
        if (e.key === 'Escape' && this.showing) {
            e.preventDefault()
            this.hide()
        }
    }
    
    async remove () {
        if (this.anchor instanceof HTMLElement) {
            this.anchor.removeAttribute('aria-describedby');
        }
        await super.remove()
        if (window.activeTooltips[this.scope] == this) {
            delete window.activeTooltips[this.scope]
        }
    }

}
