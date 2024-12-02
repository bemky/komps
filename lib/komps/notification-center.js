/*

Description
----
Render message on the top layer. 

Syntax
----
```javascript
    new NotificationCenter().add('Success!')
```

Example
----
<div class="pad-2x bg-purple-10 rounded-lg height-200-px">
    <div class="text-purple-40">
    <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>
    <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>
    <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>
    </div>
    <button type="button" class="uniformButton -purple -xl position-center">
        Click Me
    </button>
</div>

<script>
    const messages = [
        'Success!',
        'You did it!',
        'Look at us',
        'Hello!',
        'Pretty simple, eh?',
        '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elite.</p><p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>'
    ]
    const notificationCenter = new NotificationCenter()
    document.body.append(notificationCenter)
    document.querySelector('button').addEventListener('click', e => {
        notificationCenter.add(messages[Math.floor(Math.random() * messages.length)], {
            class: 'text-bold bg-green bg-opacity-80 rounded border-green-70 border text-white pad-h pad-v-1/2x bottom-0 right-0'
        })
    })
</script>

Options
----
content:
    types: String, HTMLElement, Array, Object
    description: content for the notification, uses [Dolla's `content`](https://dollajs.com/#content)
timeout:
    default: 5000
    types: Number
    description: default setting for notifications timeout
animation
    types: Boolean or Object
    description: true/false to animate or not, pass object to animate with options for [`animate`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate)

Methods
----
add:
    arguments: content:DollaContent, options:Object
    description: content to add to notification center, uses [Dolla's `content`](https://dollajs.com/#content)
    return: NotificationElement

Notification Options
----
timeout:
    default: 5000
    types: Number
    description: ms to wait until hiding
animation
    types: Boolean or Object
    description: true/false to animate or not, pass object to animate with options for [`animate`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate)

Events
----
shown:
    description: when notification is shown
hidden:
    description: when notification is hidden

Transition Animation
----
The notification will follow the transition effects set by CSS, and adds classes `-out`, `-out-start`, `-in` and `-in-start` when hiding and showing.
*/

import { append, content, css, listenerElement, createElement } from 'dolla';
import KompElement from './element.js';
export default class NotificationCenter extends KompElement {
    
    static assignableAttributes = {
        timeout: 2000,
        animation: true
    }
    
    constructor (...args) {
        super(...args)
        this.setAttribute('popover', 'manual');
    }
    
    connected () {
        this.showPopover();
    }
    
    add (content, options) {
        // bump to top of top layer
        this.hidePopover();
        this.showPopover();
        const notification = new Notification(content, Object.assign({
            timeout: this.timeout,
            dismissable: this.dismissable
        }, options))
        append(this, notification)

        return notification
    }
    
    static style = `
        komp-notification-center {
            overflow: visible;
            background: none;
            position: fixed;
            margin: 4px;
            inset: unset;
            bottom: 0;
            right: 0;
            display: flex;
            flex-direction: column;
            align-items: end;
            gap: 1px;
            transition: all 150ms;
        }
        komp-notification {
            backdrop-filter: blur(2px);
            display: flex;
            gap: 1em;
            align-items: start;
        }
        komp-notification .dismiss-button {
            outline: none;
            appearance: none;
            border: none;
            background:none;
            padding: 0;
            margin: 0;
            cursor: pointer;
            opacity: 0.75;
            color: currentColor;
        }
        komp-notification .dismiss-button:hover {
            opacity: 1;
        }
    `
}
window.customElements.define('komp-notification-center', NotificationCenter);

class Notification extends KompElement {
    
    static assignableAttributes = NotificationCenter.assignableAttributes
    
    constructor (thisContent, options) {
        super(options)
        content(this, createElement({
            class: 'komp-notification-body',
            content: thisContent
        }))
        append(this, listenerElement({
            type: 'button',
            class: 'dismiss-button',
            content: `
                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
                <circle cx="12.5" cy="12.5" r="11" stroke-dasharray="0% 300%" />
                <line x1="16" y1="8" x2="8" y2="16"></line><line x1="8" y1="8" x2="16" y2="16"></line>
                </svg>`
        }, e => {
            this.remove()
        }))
    }
    
    connected () {
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