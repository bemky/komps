/*

Description
----
Base Element for all Komps Components. It provides some syntax sugar for working with [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_Components/Using_custom_elements), provides some built in events, and adds some helpful methods.

Example
----
    <div>TODO</div>

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

export default class KompElement extends HTMLElement {
    
    static assignableAttributes = []
    static assignableMethods = []
    static bindMethods = []
    static style = ``
    static watch = []
    
    static get observedAttributes() { return this.watch }
    
    _assignableAttributes = {}
    _assignableMethods = []
    _attributes = {}
    _cleanupCallbacks = []
    is_initialized = false
    
    constructor(attrs={}) {
        super()
        const htmlAttrs = Object.assign({}, attrs)
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
                enumerable: true,
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
                this._attributes[attribute] = attrs[attribute]
                delete htmlAttrs[attribute]
            } else {
                this._attributes[attribute] = this._assignableAttributes[attribute]
            }
        })
        
        scanPrototypesFor(this.constructor, 'assignableMethods').filter(x => x).reverse().forEach(methods => {
            methods.forEach(method => {
                if (attrs.hasOwnProperty(method)) {
                    this[method] = attrs[method]
                    delete htmlAttrs[method]
                }
            })
        })
        
        scanPrototypesFor(this.constructor, 'bindMethods').filter(x => x).reverse().forEach(methods => {
            methods.forEach(method => {
                this[method] = this[method].bind(this)
            })
        })
        setAttributes(this, htmlAttrs);
    }

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
        return this.is_initialized = true
    }
    
    connected () {}
    connectedCallback () {
        this.trigger('beforeConnect')
        this.appendStyle()
        if (!this.is_initialized) {
            if (this.initialize() === false) return
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
        return this.changed(attribute, ...args)
    }
    
    appendStyle () {
        if (this.constructor.style) {;
            const root = this.getRootNode()
            const thisId = this.constructor.name
            const tagChain = []
            if (root && root.adoptedStyleSheets && !root.adoptedStyleSheets.find(s => s.id == thisId)) {
                eachPrototype(this.constructor, p => {
                    if (p.style) {
                        let style = root.adoptedStyleSheets.find(s => s.id == p.name)
                        if (!style) {
                            style = new CSSStyleSheet()
                            style.id = p.name
                            let body = result(p, 'style', p)
                            if (p.tagName !== this.tagName) {
                                body = body.replaceAll(new RegExp(`${p.tagName}([^\,\{]*)`, 'g'), (match, suffix) => {
                                    return uniq([p.tagName, this.localName]).map(x => x + suffix).join(", ")
                                })
                            }
                            style.replaceSync(body)
                            root.adoptedStyleSheets.push(style)
                        } else {
                            for (const rule of style.cssRules) {
                                rule.cssText = rule.cssText.replaceAll(new RegExp(`${p.tagName}([^\,\{]*)`, 'g'), (match, suffix) => {
                                    return uniq([p.tagName, this.localName]).map(x => x + suffix).join(", ")
                                })
                            }
                        }
                    }
                })
            }
        }
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