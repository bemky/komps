/*
Description
----
Message component for [NotificationCenter](/notification-center)

Options
----
timeout:
    default: 5000
    types: Number
    description: ms to wait until hiding
animation:
    types: Boolean or Object
    description: true/false to animate or not, pass object to animate with options for [`animate`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate)
dismissable:
    types: Boolean
    description: true/false to render dismiss counter and action
*/

import { append, content, listenerElement, createElement } from 'dolla';
import KompElement from '../element.js';
export default class Notification extends KompElement {
    
    static assignableAttributes = {
        timeout: 5000,
        animation: true,
        dismissable: true
    }
    
    constructor (thisContent, options) {
        super(options)
        content(this, createElement({
            class: 'komp-notification-body',
            content: thisContent
        }))
        if (this.dismissable) {
            append(this, listenerElement({
                type: 'button',
                class: 'dismiss-button',
                content: `
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 25 25" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
                    <circle cx="13" cy="13" r="11" stroke-dasharray="0% 300%" />
                    <line x1="17" y1="9" x2="9" y2="17"></line><line x1="9" y1="9" x2="17" y2="17"></line>
                    </svg>`
            }, e => {
                this.remove()
            }))
        }
    }
    
    connected () {
        if (this.dismissable) {
            this.addEventListener('mouseenter', this.clearTimeout);
            this.addEventListener('mouseleave', this.restartTimeout);
            this.timer = this.querySelector('.dismiss-button circle').animate([
                {strokeDasharray: "300% 300%"},
                {strokeDasharray: "0% 300%"}
            ],{
                duration: this.timeout,
                iterations: 1
            })
            this.timer.finished.then(() => this.remove())
        } 
        
        if (this.animation) {
            this.animate([
                { opacity: 0, easing: 'ease-out', marginBottom: this.offsetHeight * -1 + "px"},
                { opaicty: 1, marginBottom: "0px"}
            ], Object.assign({
                duration: 150,
                iterations: 1
            }, this.animation))
        }
    }
    
    remove (...args) {
        if (this.animation) {
            return this.animate([
                { opaicty: 1, marginBottom: "0px", easing: 'ease-in'},
                { opacity: 0, marginBottom: this.offsetHeight * -1 + "px"}
            ], Object.assign({
                duration: 150,
                iterations: 1
            }, this.animation)).finished.then(() => {
                super.remove.call(this, ...args)
            })
        } else {
            super.remove.call(this, ...args)
        }
    }
    
    clearTimeout () {
        this.timer.pause()
        this.timer.currentTime = 0
    }
    
    restartTimeout () {
        this.timer.play()
    }
}
window.customElements.define('komp-notification', Notification);