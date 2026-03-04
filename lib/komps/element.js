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
 * @example <caption>Extending</caption>
 * class DropzoneElement extends KompElement {}
 * window.customElements.define('komp-dropzone', DropzoneElement);
 *
 * ## Extending
 *
 * | Property | Static | Type | Description |
 * |---|---|---|---|
 * | `style` | yes | `string` | Define style that is dynamically appended when component is used for the first time |
 * | `defaults` | yes | `Object` | keys and values to set on initialization |
 * | `watch` | yes | `Array` | array of attributes to watch for changes and call `changed(attribute, was, now)` also calls `this[${attribute}Changed](was, now)` |
 * | `connected` | no | `function` | called when element is connected to a DOM element |
 * | `disconnected` | no | `function` | called when element is disconnected from a DOM element |
 * | `remove` | no | `function` | remove element, calls callback between event triggers beforeRemove and afterRemove |
 *
 * ## Events
 *
 * | Event | Description |
 * |---|---|
 * | `beforeRemove` | called before element is removed |
 * | `afterRemove` | called after element is removed |
 * | `beforeConnect` | called before element is connected |
 * | `afterConnect` | called after element is connected |
 * | `beforeDisconnect` | called before element is disconnected |
 * | `afterDisconnect` | called after element is disconnected |
 *
 * ## Methods
 *
 * | Method | Arguments | Description |
 * |---|---|---|
 * | `initialize` | none | method called once for each instantiation, but only after element is connected |
 * | `trigger` | `eventName:string, ...args` | triggers an event on this element, passes args |
 * | `addEventListenerFor` | `element:HTMLElement, eventType:string, ...args` | calls callback when eventType is triggered on element, enables component to tear down listener when disconnected |
 * | `changed` | `attribute, was, now` | called every time an attribute of the element changes. Must include attribute in `static watch = ['foo']` |
 * | `[attribute]Changed` | `was, now` | called every time `attribute` of the element changes. Must include attribute in `static watch = ['foo']` |
 */

import { content, remove, trigger, setAttributes, HTML_ATTRIBUTES, addEventListenerFor } from 'dolla';
import { scanPrototypesFor, result, isFunction, eachPrototype, uniq } from '../support';

export default class KompElement extends HTMLElement {
    static tagName = 'komp-element'
    static assignableAttributes = []
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