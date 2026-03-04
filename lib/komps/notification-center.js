/**
 * Render messages on the top layer.
 *
 * The notification will follow the transition effects set by CSS, and adds classes
 * `-out`, `-out-start`, `-in` and `-in-start` when hiding and showing.
 *
 * @class NotificationCenter
 * @extends KompElement
 *
 * @param {Object} [options={}]
 * @param {string|HTMLElement|Array|Object} [options.content] - content for the notification, uses {@link https://dollajs.com/#content Dolla's content}
 * @param {number} [options.timeout=5000] - default setting for notifications timeout
 * @param {boolean|Object} [options.animation] - true/false to animate or not, pass object to animate with options for {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/animate animate}
 *
 * ## Methods
 *
 * | Method | Arguments | Return | Description |
 * |---|---|---|---|
 * | `add` | `content:DollaContent, options:Object` | `Notification` | content to add to notification center, uses {@link https://dollajs.com/#content Dolla's content}. Options are {@link Notification} options |
 *
 * ## Events
 *
 * | Event | Description |
 * |---|---|
 * | `shown` | when notification is shown |
 * | `hidden` | when notification is hidden |
 *
 * @example <caption>JS</caption>
 * const notificationCenter = new NotificationCenter()
 * document.body.append(notificationCenter)
 * notificationCenter.add('Success!')
 *
 * @todo implement @starting-style
 */

import { append, content, css, listenerElement, createElement } from 'dolla';
import KompElement from './element.js';
import Notification from './notification-center/notification';

export default class NotificationCenter extends KompElement {
    
    static assignableAttributes = Notification.assignableAttributes
    
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