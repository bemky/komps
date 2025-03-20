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
<div class="pad-2x rounded-lg height-200-px">
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
    description: content to add to notification center, uses [Dolla's `content`](https://dollajs.com/#content). Options are [Notification](/notification-center/notification) options
    return: Notification

Events
----
shown:
    description: when notification is shown
hidden:
    description: when notification is hidden

Transition Animation
----
The notification will follow the transition effects set by CSS, and adds classes `-out`, `-out-start`, `-in` and `-in-start` when hiding and showing.


TODO
----
- [ ] implement @starting-style (https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style?ck_subscriber_id=1747048115)
*/

import { append, content, css, listenerElement, createElement } from 'dolla';
import KompElement from './element.js';
import Notification from './notification-center/notification';

export default class NotificationCenter extends KompElement {
    
    static assignableAttributes = {
        timeout: 5000,
        animation: true,
        dismissable: true
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