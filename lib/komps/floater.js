/**
 * Render content on a layer above an anchored element.
 *
 * @class Floater
 * @extends KompElement
 *
 * @param {Object} [options={}]
 * @param {HTMLElement} options.anchor - element to anchor positioning to
 * @param {string|HTMLElement} [options.container=null] - element to append floater to. If `String`, then used as selector for `this.closest(selector)`
 * @param {string} [options.placement="bottom"] - how the floater is anchored, e.g. "top", "top-start", "top-end", "left", "left-start"...
 * @param {string} [options.strategy="absolute"] - how the floater is positioned in the document. "absolute" or "fixed"
 * @param {boolean|Object} [options.flip=false] - See {@link https://floating-ui.com/docs/flip}, defaults to false in favor of autoPlacement
 * @param {boolean|Object} [options.offset=false] - See {@link https://floating-ui.com/docs/offset}
 * @param {boolean|Object} [options.shift=true] - See {@link https://floating-ui.com/docs/shift}
 * @param {boolean|number} [options.arrow=false] - True to show default size, or number in pixels
 * @param {boolean|Object} [options.size=false] - See {@link https://floating-ui.com/docs/size}
 * @param {boolean|Object} [options.autoPlacement=true] - See {@link https://floating-ui.com/docs/autoPlacement}
 * @param {boolean|Object} [options.inline=false] - See {@link https://floating-ui.com/docs/inline}
 * @param {boolean|Object} [options.autoUpdate=true] - See {@link https://floating-ui.com/docs/autoUpdate#options}
 * @param {boolean} [options.removeOnBlur=false] - hide floater on outside click/focus or escape key
 * @param {number} [options.timeout=0] - ms to wait until hiding after mouseout
 * @param {function} [options.onShow] - event listener for show (cancellable, fires before showing)
 * @param {function} [options.onShown] - event listener for shown (fires after showing)
 * @param {function} [options.onHide] - event listener for hide (cancellable, fires before hiding)
 * @param {function} [options.onHidden] - event listener for hidden (fires after hiding)
 * @param {string} [options.scope=null] - showing a floater will hide all other floaters of same scope
 *
 * @property {boolean} showing - is floater showing, can be disconnected and not showing in case of Tooltip
 *
 * @fires Floater#show
 * @fires Floater#shown
 * @fires Floater#hide
 * @fires Floater#hidden
 *
 * @example <caption>JS</caption>
 * new Floater({
 *     content: "Hello World",
 *     anchor: '#hi-button'
 * })
 *
 * @example <caption>HTML</caption>
 * <komp-floater anchor="#hi-button">
 *     Hello World
 * </komp-floater>
 *
 * @remarks
 * ## Transition Animation
 *
 * The floater will follow the transition effects set by CSS, and adds classes
 * `-out`, `-out-start`, `-in` and `-in-start` when hiding and showing.
 * Additionally, the floater adds classes for placement `-left`, `-right`, `-top`, `-bottom`.
 *
 * @todo convert to Popover and use Popover API
 * @todo convert to use CSS anchor positioning
 */

/**
 * Fired before the floater is shown (cancellable)
 * @event Floater#show
 */

/**
 * Fired after the floater is shown
 * @event Floater#shown
 */

/**
 * Fired before the floater is hidden (cancellable)
 * @event Floater#hide
 */

/**
 * Fired after the floater is hidden
 * @event Floater#hidden
 */

import { computePosition, offset, flip, shift, arrow, size, autoPlacement, inline, autoUpdate } from '@floating-ui/dom';
import { css, createElement } from 'dolla';

import KompElement from './element.js';

export default class Floater extends KompElement {
    static tagName = 'komp-floater';
    static activeFloaters = {};
    static { this.define() }

    static assignableAttributes = {
        anchor: {
            type: 'HTMLElement',
            default: null,
            null: true,
            load: function (v) {
                if (typeof v == "string") {
                    const container = this.getRootNode() == this ? document.body : this.getRootNode();
                    return container.querySelector(v);
                } else if (!(v instanceof Element)) {
                    const coords = v
                    return {
                        getBoundingClientRect() {
                            return {
                                width: 0,
                                height: 0,
                                x: coords.x,
                                y: coords.y,
                                left: coords.x,
                                right: coords.x,
                                top: coords.y,
                                bottom: coords.y
                            };
                        }
                    }
                } else {
                    return v
                }
            }
        },
        placement: { type: 'string', default: undefined, null: true },
        strategy: { type: 'string', default: 'absolute', null: false },
        flip: { type: ['boolean', 'object'], default: null, null: true },
        offset: { type: ['boolean', 'object'], default: null, null: true },
        shift: { type: ['boolean', 'object'], default: true, null: false },
        arrow: { type: ['boolean', 'number'], default: null, null: true },
        autoPlacement: { type: ['boolean', 'object'], default: true, null: false },
        inline: { type: ['boolean', 'object'], default: null, null: true },
        autoUpdate: { type: ['boolean', 'object'], default: {}, null: false },
        removeOnBlur: { type: 'boolean', default: false, null: false },
        container: { type: ['string', 'HTMLElement'], default: null, null: true },
        timeout: { type: 'number', default: 0, null: false },
        scope: { type: 'string', default: null, null: true }
    }
    static events = ['show', 'shown', 'hide', 'hidden']
    static bindMethods = ['show', 'hide', 'checkFocus', 'checkEscape', 'toggle']
    static middlewares = {
        size: size,
        shift: shift,
        autoPlacement: autoPlacement,
        flip: flip,
        inline: inline,
        arrow: arrow,
        offset: offset
    }
    
    showing = false
    
    initialize () {
        super.initialize()
        
        this.middleware = []
        Object.keys(this.constructor.middlewares).forEach(key => {
            if (this[key]) {
                if (key == "arrow") {
                    this.classList.add('komp-floater-arrow')
                    this.middleware.push(arrow({element: this.initializeArrow()}))
                } else {
                    this.middleware.push(this.constructor.middlewares[key](this[key] === true ? {} : this[key]))
                }
            }
        })
    }

    connected () {
        this.style.position = this.strategy
        
        if (!this.anchor) { throw 'Floater needs anchor to position to.' }
        
        this._cleanupCallbacks.push(autoUpdate(
            this.anchor,
            this,
            this.updatePosition.bind(this),
            this.autoUpdate
        ))
        
        this.classList.add('-in')
        this.addEventListener('animationend', () => {
            this.classList.remove('-in')
        }, {once: true})
        
        if (this.removeOnBlur) {
            this.cleanupEventListenerFor(this.getRootNode().body, 'focusin', this.checkFocus)
            this.cleanupEventListenerFor(this.getRootNode().body, 'click', this.checkFocus)
            this.cleanupEventListenerFor(this.getRootNode().body, 'keyup', this.checkEscape)
        }
    }
    
    initializeArrow () {
        if (this.querySelector('komp-floater-arrow-locator')) {
            return this.querySelector('komp-floater-arrow-locator')
        }
        
        const el = createElement('komp-floater-arrow-locator')
        this.prepend(el)
        if (typeof this.arrow == "number") {
            this.style.setProperty('--arrow-size', this.arrow + "px")
        } 
        if (!this.offset) {
            this.offset = this.arrow === true ? 10 : this.arrow
        }
        if (css(this, 'box-shadow') != "none") {
            this.style.filter = css(this, 'box-shadow').split(/(?<!\([^\)]*),/).map(shadow => {
                return `drop-shadow(${shadow.trim().split(/(?<!\([^\)]*)\s/).slice(0,4).join(" ")})`
            }).join(" ")
            this.style.boxShadow = 'none'
        }
        
        return el
    }
    
    updatePosition () {
        computePosition(this.anchor, this, {
            strategy: this.strategy,
            placement: this.placement,
            middleware: this.middleware,
        }).then(this.computePosition.bind(this))
    }
    
    computePosition({x, y, placement, middlewareData, ...args}) {
        this.style.left = `${x}px`;
        this.style.top = `${y}px`;
        this.classList.remove('-top', '-left', '-bottom', '-right')
        this.classList.add('-' + placement.split('-')[0]);

        if (middlewareData.arrow) {
            const {x, y} = middlewareData.arrow;
            if (x != null) {
                this.style.setProperty('--arrow-left', `${x}px`)
                this.querySelector('komp-floater-arrow-locator').style.setProperty('left', `${x}px`)
            }
            if (y != null) {
                this.style.setProperty('--arrow-top', `${y}px`)
                this.querySelector('komp-floater-arrow-locator').style.setProperty('top', `${x}px`)
            }
        }
    }
    
    checkFocus (e) {
        if (e.defaultPrevented) { return }
        if (e.target == this) { return }
        if (e.target == this.anchor) { return }
        if (this.contains(e.target)) { return }
        if (this.anchor.contains && this.anchor.contains(e.target)) { return }
        this.hide()
    }
    
    checkEscape (e) {
        if (e.which != 27) return;
        this.hide();
    }
    
    remove () {
        return new Promise(resolve => {
            this.classList.add('-out')
        
            const done = () => {
                this.classList.remove('-out')
                super.remove().then(resolve)
            }
            if (css(this, 'animation-name') != "none") {
                this.addEventListener('animationend', done, {once: true})
            } else {
                done()
            }
        })
    }
    
    show () {
        if (this._hideTimeout) {
            clearTimeout(this._hideTimeout);
            delete this._hideTimeout;
        }
        if (this._removing) {
            return this._removing.then(this.show)
        }
        if (typeof this.container == "string") {
            this.container = this.closest(this.container) || (this.anchor.closest && this.anchor.closest(this.container))
        }
        if (this.container == null) {
            this.container = this.parentElement || this.anchor.parentElement;
        }
        if (!this.parentElement) {
            if (!this.trigger('show')) return
            this.showing = true
            
            this.activeFloater?.hideNow()
            this.activeFloater = this
            
            this.container.append(this)
            this.trigger('shown')
        }
        return this;
    }
    
    get activeFloater () {
        if (this.scope) {
            return this.constructor.activeFloater(this.scope)
        }
    }
    
    set activeFloater (v) {
        if (this.scope) {
            this.constructor.activeFloaters[this.scope] = v
        }
    }
    
    static activeFloater (scope) {
        return this.activeFloaters[scope]
    }
    
    hideNow () {
        this.hideAfterTimeout()
    }
    
    hide () {
        if (this._hideTimeout) { return }
        if (this._hiding) { return }
        
        return new Promise(resolve => {
            this._hideTimeout = setTimeout(() => {
                this.hideAfterTimeout()
                resolve()
            }, this.timeout)
        })
    }
    
    hideAfterTimeout () {
        if (this.parentElement) {
            if (!this.trigger('hide')) return this
            return this._removing = this.remove().then(() => {
                this.showing = false
                this.trigger('hidden')
                delete this._hideTimeout;
                delete this._removing;
                if (this.activeFloater == this) delete this.constructor.activeFloaters[this.scope]
            })
        }
        return this;
    }
    
    /**
     * Toggle the floater visibility
     * @param {boolean} [shouldHide] - explicitly show or hide. If omitted, toggles based on current visibility.
     * @returns {Floater} this
     */
    toggle (shouldHide) {
        if (typeof shouldHide !== 'boolean') {
            shouldHide = this.offsetParent !== null
        }
        this[shouldHide ? 'hide' : 'show']()
        return this;
    }
    
    static style = `
        .komp-floater-arrow {
            --arrow-size: 0.5em;
            --arrow-left: 0;
            --arrow-top: 0;
        }
        .komp-floater-arrow:after{
            content: '';
            clip-path: polygon(0 0, 50% 100%, 100% 0);
            z-index: 1;
            position:absolute;
            top: calc(var(--arrow-top) - var(--arrow-size));
            left: calc(var(--arrow-left) - var(--arrow-size));
            width: calc(var(--arrow-size) * 2);
            height: var(--arrow-size);
            overflow: hidden;
            border-style: solid;
            border-width: inherit;
            box-shadow: inherit;
            background: inherit;
            border: inherit;
        }
        .komp-floater-arrow.-top:after{
            top: 100%;
        }
        .komp-floater-arrow.-bottom:after{
            top: auto;
            bottom: 100%;
            transform: rotate(180deg);
        }
        .komp-floater-arrow.-left:after,
        .komp-floater-arrow.-right:after {
            clip-path: polygon(0 0, 100% 50%, 0 100%);
            width: var(--arrow-size);
            height: calc(var(--arrow-size) * 2);
        }
        .komp-floater-arrow.-left:after{
            left: 100%;
        }
        .komp-floater-arrow.-right:after{
            left: auto;
            right: 100%;
            transform: rotate(180deg);
        }
        komp-floater-arrow-locator {
            position: absolute;
            left: 0;
            top: 0;
            width: var(--arrow-size, 1px);
            height: var(--arrow-size, 1px);
        }
    `
}
if (!window.customElements.get('komp-floater')) {
}