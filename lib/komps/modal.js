/**
 * Render any content into a modal
 *
 * @class Modal
 * @extends KompElement
 *
 * @param {Object} [options={}]
 * @param {string|HTMLElement|Array|Object} [options.content] - content for the modal, uses {@link https://dollajs.com/#content Dolla's content}
 *
 * @example <caption>HTML</caption>
 * <komp-modal>Hello World</komp-modal>
 *
 * @example <caption>JS</caption>
 * new Modal({content: "Hello World"})
 */

// TODO move to custom built-in element to extend HTMLDialogElement
// when supported by apple https://bugs.webkit.org/show_bug.cgi?id=182671

import { append, createElement, listenerElement, remove } from 'dolla';
import KompElement from './element.js';

export default class Modal extends KompElement {

    static tagName = "komp-modal";
    static { this.define() }

    constructor (...args) {
        super(...args)
        this.container = createElement(`${this.tagName}-popover`, {
            popover: 'manual'
        });
    }
    
    connected () {
        if (this.parentElement.localName != `${this.localName}-popover`) {
            const existingModals = Array.from(this.parentElement.querySelectorAll('komp-modal-popover'))
            let index = Math.max(...existingModals.map(modal => parseInt(modal.dataset.modalOrder || "0")))
            index++
            existingModals.forEach(modal => {
                modal.dataset.modalOrder = modal.dataset.modalOrder || index++
            })
            
            this.replaceWith(this.container);
            this.container.addEventListener('click', e => {
                if (e.target == this.container) { this.remove() }
            })
            this.container.append(this)
            this.container.append(createElement(`${this.tagName}-close`, {
                content: listenerElement({
                    content: `<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
                }, this.remove.bind(this))
            }))
            this.container.showPopover();
        }
    }
    
    remove () {
        const root = this.container.parentElement
        this.container.remove();
        if (root) {
            const existingModals = Array.from(root.querySelectorAll(`${this.localName}-popover`))
            const nextModal = existingModals.sort((a, b) => {
                return parseInt(b.dataset.modalOrder) - parseInt(a.dataset.modalOrder)
            })[0]
            if (nextModal) {
                delete nextModal.dataset.modalOrder
            }
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
        
        ${this.tagName}-close {
            width: 0;
            position: relative;
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
