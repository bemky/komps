/*

Description
----
Render any content into a modal

Syntax
----
HTML
```html
<komp-modal>Hello World</komp-modal>
```

JS
```javascript
new Modal({content: "Hello World"})
```

Example
----
<div class="pad-2x">
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
</div>
<komp-modal class="bg-white pad width-300-px">
    <p>Example of longer content that overflows the page</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
</komp-modal>
<komp-modal class="bg-white pad">
    Example Modal On Top of Another Modal
</komp-modal>

Options
----
content: 
    types: String, HTMLElement, Array, Object
    description: content for the floater, uses [Dolla's `content`](https://dollajs.com/#content)
    
*/

// TODO move to custom built-in element to extend HTMLDialogElement
// when supported by apple https://bugs.webkit.org/show_bug.cgi?id=182671

import { append, createElement, listenerElement, remove } from 'dolla';
import KompElement from './element.js';

export default class Modal extends KompElement {

    static tagName = "komp-modal";
    
    connected () {
        if (this.parentElement.localName != `${this.localName}-popover`) {
            const existingModals = Array.from(this.getRootNode().querySelectorAll('komp-modal-popover'))
            let index = Math.max(...existingModals.map(modal => parseInt(modal.dataset.modalOrder || "0")))
            index++
            existingModals.forEach(modal => {
                modal.dataset.modalOrder = modal.dataset.modalOrder || index++
            })
            
            this.container = createElement(`${this.tagName}-popover`, {
                popover: 'manual'
            });
            this.replaceWith(this.container);
            this.container.addEventListener('click', e => {
                if (e.target == this.container) { this.remove() }
            })
            this.container.append(this)
            this.container.showPopover();
        }
    }
    
    remove () {
        const root = this.getRootNode()
        this.container.remove();
        const existingModals = Array.from(root.querySelectorAll(`${this.localName}-popover`))
        const nextModal = existingModals.sort((a, b) => {
            return parseInt(b.dataset.modalOrder) - parseInt(a.dataset.modalOrder)
        })[0]
        if (nextModal) {
            delete nextModal.dataset.modalOrder
        }
        return super.remove()
    }
    
    static style = function() { return `
        body:has(komp-modal-popover:popover-open) {
            overflow: hidden;
            pointer-events: none;
        }
        ${this.tagName} {
            display: block;
            pointer-events: auto;
        }
        ${this.tagName}-popover {
            margin: 0;
            inset: 0;
            width: 100%;
            height: 100%;
            
            padding: 2em;
            overflow: auto;
            background: none;
            pointer-events: auto;
            
            display: flex;
            justify-content: center;
            align-items: start;
        }
        ${this.tagName}-popover::backdrop {
            background: rgba(0,0,0, 0.6);
            backdrop-filter: blur(4px);
        }
        ${this.tagName}-popover[data-modal-order]::backdrop {
            display: none;
        }
    `}
}
window.customElements.define(Modal.tagName, Modal);