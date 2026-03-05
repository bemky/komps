/*

Description
----
Base Element for all Komps Components. It provides some syntax sugar for working with [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_Components/Using_custom_elements), provides some built in events, and adds some helpful methods.

Syntax
----
    class DropzoneElement extends KompsElement {}
    window.customElements.define('komp-dropzone', DropzoneElement);

Options
----
content:
    types: String, HTMLElement, Array, Object
    description: content to append to element. Passed to [Dolla's `content`](https://dollajs.com/#content)

Extending
----

style:
    static: true
    types: String
    description: Define style that is dynamically appended when component is used for the first time.

defaults:
    static: true
    types: Object
    description: keys and values to set on initialization

connected:
    types: Function
    description: called when element is connected to a DOM element

disconnected:
    types: Function
    description: called when element is disconnected from a DOM element

remove:
    types: Function
    arguments: callback:Function
    description: remove element, calls callback between event Triggers beforeRemove and afterRemove
watch:
    static: true
    types: Array
    description: array of attibutes to watch for changes and call `changed(attribute, was, now)` also calls `this[${attribute}Changed](was, now)`

Events
----
beforeRemove:
    arguments: []
    description: called before element is removed
afterRemove:
    arguments: []
    description: called after element is removed
beforeConnect:
    arguments: []
    description: called before element is connected
afterConnect:
    arguments: []
    description: called before element is connected
beforeDisconnect:
    arguments: []
    description: called before element is disconnected
afterDisconnect:
    arguments: []
    description: called before element is disconnected

Methods
----
intialize:
    arguments: []
    description: method called once for each instantiation, but only after element is connected (required for accessing some properties)

trigger:
    arguments: eventName:string, ...args
    description: triggers an event this element passes args

addEventListenerFor:
    arguments: element:HTMLElement, eventType:string, ...args
    description: calls callback when eventType is triggered on element, enables component to tear down listener when disconnected.

changed:
    arguments: attribute, was, now
    description: called every time an attribute of the element changes. Must include attribute in `static watch = ['foo']`

'[attribute]Changed':
    arguments: was, now
    description: called every time `attribute` of the element changes. Must include attribute in `static watch = ['foo']`
*/

import { content, remove, trigger, setAttributes, HTML_ATTRIBUTES, addEventListenerFor } from 'dolla';
import { scanPrototypesFor, result, isFunction, eachPrototype, uniq } from '../support';

const SERIALIZABLE_TYPES = new Set(['string', 'number', 'boolean'])
function isSerializableSchema(schema) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type]
    return types.every(t => SERIALIZABLE_TYPES.has(t))
}

let _refId = 0
function generateRefId() {
    return 'komp-ref-' + (++_refId)
}

const _registry = new FinalizationRegistry(refIds => {
    for (const id of refIds) {
        KompElement.manifest.delete(id)
    }
})

export default class KompElement extends HTMLElement {
    static tagName = 'komp-element'
    static manifest = new Map()
    static assignableAttributes = {}
    static assignableMethods = []
    static bindMethods = []
    static style = ``
    static watch = []
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
            let schema = this._assignableAttributes[attribute]
            if (typeof schema != 'object' || schema.type == undefined) {
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
                    this[attribute] = schema.default
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

    initialize () {
        Object.keys(this._assignableAttributes).forEach(attribute => {
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
        })
    }
    
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
    
    disconnected () {}
    disconnectedCallback () {
        this.trigger('beforeDisconnect')
        this._cleanupCallbacks.forEach(cb => cb());
        this._cleanupCallbacks = []
        this.disconnected()
        this.trigger('afterDisconnect')
    }
    
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
    
    async remove (callback) {
        this.trigger('beforeRemove')
        if (callback) await callback()
        super.remove()
        this.trigger('afterRemove')
        return this;
    }
    
    addEventListenerFor(...args) {
        addEventListenerFor(this, ...args)
    }
    
    cleanupEventListenerFor(...listener) {
        this._cleanupCallbacks.push(() => {
            listener[0].removeEventListener(...listener.slice(1))
        })
        listener[0].addEventListener(...listener.slice(1));
    }
    
    trigger(...args) { trigger(this, ...args) }
}