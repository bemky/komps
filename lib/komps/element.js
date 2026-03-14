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
import { scanPrototypesFor, result, isFunction, eachPrototype, uniq, generateRefId} from '../support.js';

const SERIALIZABLE_TYPES = new Set(['string', 'number', 'boolean'])
function isSerializableSchema(schema) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type]
    return types.every(t => SERIALIZABLE_TYPES.has(t))
}

const _registry = new FinalizationRegistry(refIds => {
    for (const id of refIds) {
        KompElement.manifest.delete(id)
    }
})

export default class KompElement extends HTMLElement {
    static tagName = 'komp-element'
    static manifest = new Map()

     /**
     * Attributes settable via constructor options. Each key is the attribute
     * name and the value is a schema object describing how to handle it.
     *
     * @type {Object}
     * @static
     *
     * @property {string|string[]} type - expected type(s): `'string'`, `'number'`, `'boolean'`, `'object'`, `'array'`, `'function'`, or a class/element name like `'HTMLElement'`
     * @property {*} default - default value when none is provided
     * @property {boolean} null - whether `null` is an acceptable value
     * @property {function} [load] - optional transform applied when reading the attribute value
     *
     * @example
     * static assignableAttributes = {
     *     anchor: { type: 'HTMLElement', default: null, null: true },
     *     placement: { type: 'string', default: 'bottom', null: false },
     *     enabled: { type: 'boolean', default: true, null: false },
     *     data: { type: 'array', default: [], null: false }
     * }
     */
    static assignableAttributes = {}

     /**
     * Methods overridable via constructor options
     * @type {Array}
     * @static
     */
    static assignableMethods = []

    /**
     * Methods to auto-bind to `this`
     * @type {Array}
     * @static
     */
    static bindMethods = []

    /**
     * CSS injected once per component via `adoptedStyleSheets`
     * @type {string}
     * @static
     */
    static style = ``

    /**
     * Attributes to observe for changes. Triggers {@link KompElement#changed changed(attribute, was, now)} and `[attribute]Changed(was, now)` callbacks.
     * @type {Array}
     * @static
     */
    static watch = []

    /**
     * Event names that can be bound via `onEventName` constructor options
     * @type {Array}
     * @static
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
    _refIds = []
    _cleanupCallbacks = []
    is_initialized = false
    
    constructor(attrs={}) {
        super()
        const htmlAttrs = Object.assign({}, attrs)
        
        /* bindMethods */
        scanPrototypesFor(this.constructor, 'bindMethods').filter(x => x).reverse().forEach(methods => {
            methods.forEach(method => {
                this[method] = this[method].bind(this)
            })
        })

        /* assignableAttributes */
        scanPrototypesFor(this.constructor, 'assignableAttributes').filter(x => x).reverse().forEach(attributes => {
            if (Array.isArray(attributes)) {
                console.warn(`[Komps] assignableAttributes on ${this.constructor.name} uses deprecated array format. Convert to object schema: { attr: { type, default, null } }`)
                attributes.forEach(attr => {
                    this._assignableAttributes[attr] = this._assignableAttributes[attr] || { type: 'object', default: null, null: true }
                })
            } else {
                Object.assign(this._assignableAttributes, attributes)
            }
        })
        Object.keys(this._assignableAttributes).forEach(attribute => {
            if (attribute == 'content') return
            
            let schema = this._assignableAttributes[attribute]
            if (typeof schema != 'object' || schema == null || schema.type == undefined) {
                console.warn(`[Komps] assignableAttributes on ${this.constructor.name} is direct value. Convert to object schema: { attr: { type, default, null } }`)
                schema = {
                    type: 'object',
                    default: schema,
                    null: true
                }
            }
            const serializable = isSerializableSchema(schema)
            const refAttr = attribute + '_ref'
            Object.defineProperty(this, attribute, {
                configurable: true,
                get: () => this._attributes[attribute],
                set: (value) => {
                    const was = this._attributes[attribute]
                    if (value !== was) {
                        if (schema.load) {
                            value = schema.load.call(this, value)
                        }
                        this._attributes[attribute] = value
                        this.attributeChangedCallback(attribute, was, value);
                        if (serializable) {
                            if (value == null) {
                                this.removeAttribute(attribute)
                            } else if (typeof value === 'boolean') {
                                this.toggleAttribute(attribute, value)
                            } else {
                                this.setAttribute(attribute, value)
                            }
                        } else {
                            const currentRef = this.getAttribute(refAttr)
                            if (value != null) {
                                if (currentRef) {
                                    KompElement.manifest.set(currentRef, value)
                                } else {
                                    const id = generateRefId()
                                    this.setAttribute(refAttr, id)
                                    this._refIds.push(id)
                                    KompElement.manifest.set(id, value)
                                }
                            } else if (currentRef) {
                                KompElement.manifest.delete(currentRef)
                                this.removeAttribute(refAttr)
                            }
                        }
                    }
                }
            });
            if (attrs.hasOwnProperty(attribute)) {
                this[attribute] = attrs[attribute]
                delete htmlAttrs[attribute]
            } else {
                const existingRef = this.getAttribute(refAttr)
                if (existingRef && KompElement.manifest.has(existingRef)) {
                    const value = KompElement.manifest.get(existingRef)
                    const id = generateRefId()
                    this.setAttribute(refAttr, id)
                    this._refIds.push(id)
                    KompElement.manifest.set(id, value)
                    this._attributes[attribute] = value
                } else if (serializable && this.hasAttribute(attribute)) {
                    const raw = this.getAttribute(attribute)
                    const primaryType = Array.isArray(schema.type) ? schema.type[0] : schema.type
                    if (primaryType === 'boolean') {
                        this._attributes[attribute] = true
                    } else if (primaryType === 'number') {
                        this._attributes[attribute] = Number(raw)
                    } else {
                        this._attributes[attribute] = raw
                    }
                } else {
                    this._attributes[attribute] = schema.default
                    if (serializable && schema.default != null) {
                        if (typeof schema.default === 'boolean') {
                            this.toggleAttribute(attribute, schema.default)
                        } else {
                            this.setAttribute(attribute, schema.default)
                        }
                    }
                }
            }
        })
        _registry.register(this, this._refIds)

        /* assignableMethods */
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
        
        /* events */
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
            const schema = this._assignableAttributes[attribute]
            const serializable = typeof schema == 'object' && schema != null && schema.type != undefined && isSerializableSchema(schema)
            const refAttr = attribute + '_ref'
            const existingRef = this.getAttribute(refAttr)
            if (!serializable && existingRef && KompElement.manifest.has(existingRef)) {
                this[attribute] = KompElement.manifest.get(existingRef)
            } else {
                const value = this.getAttribute(attribute) || this.dataset[attribute] || this[attribute]
                if (!value && this.dataset[attribute]) {
                    console.warn("[Komps] assigning attributes via data- is deprecated.")
                }
                if (attribute == "content" && value) {
                    this.removeAttribute('content')
                    content(this, value)
                } else if (value !== null) {
                    this[attribute] = value
                }
            }
            // Reflect serializable defaults to DOM (deferred from constructor)
            if (serializable && this._attributes[attribute] != null
                && !this.hasAttribute(attribute)) {
                const v = this._attributes[attribute]
                if (typeof v === 'boolean') {
                    this.toggleAttribute(attribute, v)
                } else {
                    this.setAttribute(attribute, v)
                }
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
                            if (style) root.adoptedStyleSheets.push(style)
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