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
<komp-modal class="bg-white pad">
    Example Modal
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
        if (this.parentElement.tagName != `${this.tagName.toUpperCase()}-CONTAINER`) {
            const container = createElement(`${this.tagName}-container`)
            this.backdrop = createElement(`${this.tagName}-backdrop`, {content: container})
            this.backdrop.addEventListener('click', e => {
                if (e.target == this.backdrop || e.target == container) { this.remove() }
            })
            
            this.replaceWith(this.backdrop)
            container.append(this);
            container.append(createElement(`${this.tagName}-close`, {
                content: listenerElement({
                    content: `<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
                }, e => {
                    this.remove()
                })
            }))
        }
        this.getRootNode().body.style.overflow = 'hidden'
    }
    
    remove () {
        this.getRootNode().body.style.overflow = ''
        remove(this.backdrop)
        return super.remove()
    }
    
    static style = function() { return `
        ${this.tagName} {
            max-width: 100%;
        }
        ${this.tagName}-backdrop {
            position: fixed;
            inset: 0;
            overflow: scroll;
            display: flex;
            justify-content: center;
            align-items: start;
            background: rgba(0,0,0, 0.6);
            backdrop-filter: blur(4px); /* Not supported for dialog::backdrop as of 2023-09-13 */
        }
        ${this.tagName}-container {
            max-width: 100%;
            display: flex;
            justify-content: center;
            align-items: stretch;
            padding: 2em;
        }
        ${this.tagName}-close {
            width: 0;
            position: relative;
            background: red;
        }
        ${this.tagName}-close button {
            position: absolute;
            bottom: 100%;
            left: 0;
            padding: 0.25em;
            outline: none;
            appearance: none;
            border: none;
            background:none;
            padding: 0;
            margin: 0;
            list-style:none;
            text-decoration: none;
            color: white;
            cursor: pointer;
            opacity: 0.75;
        }
        ${this.tagName}-close button:hover {
            opacity: 1;
        }
    `}
}
window.customElements.define(Modal.tagName, Modal);