import { content, remove, trigger } from 'dolla';

/*

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
trigger:
    arguments: eventName:string, ...args
    description: triggers an event this element passes args

addEventListenerFor:
    arguments: element:HTMLElement, eventType:string, ...args
    description: calls callback when eventType is triggered on element, enables component to tear down listener when disconnected.
*/

export default class KompElement extends HTMLElement {
    
    static options = []
    static style = ``
    
    cleanupCallbacks = []
    
    constructor(attrs={}) {
        super()
        this.constructor.options.forEach(key => {
            if (attrs[key]) {
                if (key == "content") {
                    content(this, attrs[key])
                } else {
                    this.setAttribute(key, attrs[key])
                }
            }
        })
    }
    
    connected () {}
    connectedCallback () {
        this.trigger('beforeConnect')
        this.appendStyle()
        this.constructor.options.forEach(key => {
            const value = this.getAttribute(key) || this.dataset[key] || this[key]
            if (key == "content" && value) {
                this.removeAttribute('content')
                content(this, value)
            } else {
                this[key] = value
            }
        })
        this.connected()
        this.trigger('afterConnect')
    }
    
    disconnected () {}
    disconnectedCallback () {
        this.trigger('beforeDisconnect')
        this.cleanupCallbacks.forEach(cb => cb());
        this.cleanupCallbacks = []
        this.disconnected()
        this.trigger('afterDisconnect')
    }
    
    appendStyle () {
        if (this.constructor.style) {
            const root = this.getRootNode()
            const id = this.tagName.toLowerCase()
            if (root && root.adoptedStyleSheets && !root.adoptedStyleSheets.find(s => s.id != id)) {
                const style = new CSSStyleSheet()
                style.replaceSync(this.constructor.style)
                style.id = id
                root.adoptedStyleSheets.push(style)
            }
        }
    }
    
    remove (callback) {
        this.trigger('beforeRemove')
        if (callback) callback()
        remove(this);
        this.trigger('afterRemove')
        return this;
    }
    
    addEventListenerFor(...listener) {
        this.cleanupCallbacks.push(() => {
            listener[0].removeEventListener(...listener.slice(1))
        })
        listener[0].addEventListener(...listener.slice(1));
    }
    
    trigger(...args) { trigger(this, ...args) }
}