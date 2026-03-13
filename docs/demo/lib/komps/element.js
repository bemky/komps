/**
 * Base Element for all Komps Components. It provides some syntax sugar for working with
 * [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_Components/Using_custom_elements),
 * provides some built-in events, and adds some helpful methods.
 *
 * @class KompElement
 * @extends HTMLElement
 *
 * @param {Object} [options={}]
 * @param {string|HTMLElement|Array|Object} [options.content] - content to append to element. Passed to {@link https://dollajs.com/#content Dolla's content}
 *
 * @fires KompElement#beforeConnect
 * @fires KompElement#afterConnect
 * @fires KompElement#beforeDisconnect
 * @fires KompElement#afterDisconnect
 * @fires KompElement#beforeRemove
 * @fires KompElement#afterRemove
 *
 * @example
 * class DropzoneElement extends KompElement {}
 * window.customElements.define('komp-dropzone', DropzoneElement);
 */

/**
 * Fired before the element is connected to the DOM
 * @event KompElement#beforeConnect
 */

/**
 * Fired after the element is connected to the DOM and initialized
 * @event KompElement#afterConnect
 */

/**
 * Fired before the element is disconnected from the DOM
 * @event KompElement#beforeDisconnect
 */

/**
 * Fired after the element is disconnected from the DOM
 * @event KompElement#afterDisconnect
 */

/**
 * Fired before the element is removed
 * @event KompElement#beforeRemove
 */

/**
 * Fired after the element is removed
 * @event KompElement#afterRemove
 */

import { content, remove, trigger, setAttributes, HTML_ATTRIBUTES, addEventListenerFor } from 'dolla';
import { scanPrototypesFor, result, isFunction, eachPrototype, uniq } from '../support.js';

export default class KompElement extends HTMLElement {
    static tagName = 'komp-element'

    /**
     * Attributes settable via constructor options
     * @type {Array|Object}
     */
    static assignableAttributes = []

    /**
     * Methods overridable via constructor options
     * @type {Array}
     */
    static assignableMethods = []

    /**
     * Methods to auto-bind to `this`
     * @type {Array}
     */
    static bindMethods = []

    /**
     * CSS injected once per component via `adoptedStyleSheets`
     * @type {string}
     */
    static style = ``

    /**
     * Attributes to observe for changes. Triggers {@link KompElement#changed changed(attribute, was, now)} and `[attribute]Changed(was, now)` callbacks.
     * @type {Array}
     */
    static watch = []

    /**
     * Event names that can be bound via `onEventName` constructor options
     * @type {Array}
     */
    static events = ['afterRemove', 'beforeRemove', 'beforeConnect', 'afterConnect', 'beforeDisconnect', 'afterDisconnect']
    
    static get observedAttributes() { return this.watch }
    
    static include(module) {
        if (!this._plugins) { this._plugins = [] }
        if (!this._plugins.includes(module.name)) {
            this._plugins.push(module.name)
            module.call(this, this.prototype)
        }
    }
    
    _assignableAttributes = {}
    _attributes = {}
    _cleanupCallbacks = []
    is_initialized = false
    
    constructor(attrs={}) {
        super()
        const htmlAttrs = Object.assign({}, attrs)
        
        scanPrototypesFor(this.constructor, 'bindMethods').filter(x => x).reverse().forEach(methods => {
            methods.forEach(method => {
                this[method] = this[method].bind(this)
            })
        })
        
        scanPrototypesFor(this.constructor, 'assignableAttributes').filter(x => x).reverse().forEach(attributes => {
            if (Array.isArray(attributes)) {
                attributes.forEach(attr => {
                    this._assignableAttributes[attr] = this._assignableAttributes[attr] || null
                })
            } else {
                Object.assign(this._assignableAttributes, attributes)
            }
        })
        Object.keys(this._assignableAttributes).forEach(attribute => {
            Object.defineProperty(this, attribute, {
                configurable: true,
                get: () => this._attributes[attribute],
                set: (value) => {
                    const was = this._attributes[attribute]
                    if (value !== was) {
                        this._attributes[attribute] = value
                        this.attributeChangedCallback(attribute, was, value);
                    }
                }
            });
            if (attrs.hasOwnProperty(attribute)) {
                this[attribute] = attrs[attribute]
                delete htmlAttrs[attribute]
            } else {
                this[attribute] = this._assignableAttributes[attribute]
            }
        })
        
        scanPrototypesFor(this.constructor, 'assignableMethods').filter(x => x).reverse().forEach(methods => {
            methods.forEach(method => {
                if (attrs.hasOwnProperty(method) && typeof attrs[method] == 'function') {
                    const superMethod = this[method]
                    this[method] = function (...args) {
                        args.push(superMethod)
                        return attrs[method].call(this, ...args)
                    }
                    delete htmlAttrs[method]
                }
            })
        })
        
        scanPrototypesFor(this.constructor, 'events').filter(x => x).reverse().forEach(events => {
            events.forEach(event => {
                const eventKey = "on" + event[0].toUpperCase() + event.slice(1)
                if (attrs.hasOwnProperty(eventKey)) {
                    this.addEventListener(event, attrs[eventKey])
                    delete htmlAttrs[eventKey]
                }
            })
        })
        
        Object.keys(htmlAttrs).forEach(key => {
            if (htmlAttrs[key] == undefined) delete htmlAttrs[key]
        })
        setAttributes(this, htmlAttrs);
    }

    /**
     * Called once per instantiation, but only after element is connected to the DOM
     */
    initialize () {
        Object.keys(this._assignableAttributes).forEach(attribute => {
            const value = this.getAttribute(attribute) || this.dataset[attribute] || this[attribute]
            if (attribute == "content" && value) {
                this.removeAttribute('content')
                content(this, value)
            } else if (value !== null) {
                this[attribute] = value
            }
        })
    }
    
    /**
     * Called when element is connected to the DOM
     */
    connected () {}
    async connectedCallback () {
        this.trigger('beforeConnect')
        this.appendStyle()
        if (!this.is_initialized && !this.initializing) {
            this.initializing = true
            if ((await this.initialize()) === false) return
            this.is_initialized = true
            delete this.initializing
        }
        this.connected()
        this.trigger('afterConnect')
    }
    
    /**
     * Called when element is disconnected from the DOM
     */
    disconnected () {}
    disconnectedCallback () {
        this.trigger('beforeDisconnect')
        this._cleanupCallbacks.forEach(cb => cb());
        this._cleanupCallbacks = []
        this.disconnected()
        this.trigger('afterDisconnect')
    }
    
    /**
     * Called every time an observed attribute changes. Attribute must be listed in `static watch`.
     * @param {string} attribute - the attribute that changed
     * @param {*} was - previous value
     * @param {*} now - new value
     */
    changed(attribute, was, now){}
    attributeChangedCallback(attribute, ...args) {
        if (this[attribute+"Changed"]) { this[attribute+"Changed"](...args) }
        this.trigger(attribute+"Changed", {
            detail: args
        })
        return this.changed(attribute, ...args)
    }
    
    appendStyle () {
        if (this.constructor.style) {;
            const root = this.getRootNode()
            if (root && root.adoptedStyleSheets && !root.adoptedStyleSheets.find(s => s.id == this.constructor.name)) {
                eachPrototype(this.constructor, proto => {
                    if (proto.hasOwnProperty('style') && proto.renderStyle) {
                        if (root && root.adoptedStyleSheets && !root.adoptedStyleSheets.find(s => s.id == proto.name)) {
                            const style = proto.renderStyle()
                            if (style) root.adoptedStyleSheets.push(proto.renderStyle(style))
                        }
                    }
                })
            }
        }
    }
    
    static renderStyle () {
        if (!this.style) return null;
        
        const style = new CSSStyleSheet()
        style.id = this.name
        let body = '';
        
        const expandStyle = (style) => {
            if (Array.isArray(style)) {
                return style.map(expandStyle).join("\n")
            } else if (isFunction(style)) {
                return style.call(this)
            } else if (!!style) {
                return style
            }
        }
        
        eachPrototype(this, proto => {
            body += expandStyle(proto.style)
        })
        style.replaceSync(body)
        return style
    }
    
    /**
     * Remove element. Fires beforeRemove, calls optional callback, removes from DOM, then fires afterRemove.
     * @param {function} [callback] - async callback called between beforeRemove and afterRemove
     * @returns {KompElement} this
     */
    async remove (callback) {
        this.trigger('beforeRemove')
        if (callback) await callback()
        super.remove()
        this.trigger('afterRemove')
        return this;
    }
    
    /**
     * Listen for events on another element, automatically cleaned up when this component disconnects
     * @param {HTMLElement} element - element to listen on
     * @param {string} eventType - event type
     * @param {...*} args - additional arguments passed to addEventListener
     */
    addEventListenerFor(...args) {
        addEventListenerFor(this, ...args)
    }
    
    cleanupEventListenerFor(...listener) {
        this._cleanupCallbacks.push(() => {
            listener[0].removeEventListener(...listener.slice(1))
        })
        listener[0].addEventListener(...listener.slice(1));
    }
    
    /**
     * Trigger an event on this element
     * @param {string} eventName - event name to trigger
     * @param {...*} args - additional arguments
     */
    trigger(...args) { trigger(this, ...args) }
}