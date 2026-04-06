/**
 * An overlay element that provides resize handles around a target element,
 * allowing the user to resize and optionally move it by dragging.
 *
 * @class Resizer
 * @extends KompElement
 *
 * @param {Object} [options={}]
 * @param {HTMLElement} [options.target] - element to resize
 * @param {boolean} [options.autohide=true] - show/hide handles on target hover
 * @param {string} [options.offset] - CSS offset value for edge handles
 * @param {string[]} [options.directions=['top','right','bottom','left']] - which edges get resize handles
 * @param {boolean} [options.move=false] - enable a move handle for dragging the element
 * @param {HTMLElement} [options.container] - positioning container (defaults to `document.body`)
 * @param {Function} [options.bounds] - function returning an object with optional `top`, `right`, `bottom`, `left` properties to constrain resize/move operations
 * @param {Object} [options.handles] - handle display options
 * @param {boolean} [options.handles.autohide=false] - show/hide edge handles until *handle* is hovered
 * @param {number} [options.handles.hitBox=5] - handle hit area in pixels
 *
 * @fires Resizer#resize
 *
 * @example
 * const resizer = new Resizer({
 *     target: document.getElementById('box'),
 *     move: true,
 *     autohide: false,
 *     directions: ['right', 'bottom'],
 *     bounds: () => container.getBoundingClientRect()
 * })
 * container.append(resizer)
 */

/**
 * Fired after a resize or move operation completes
 * @event Resizer#resize
 */

import KompElement from './element.js';
import { append, offsetTo, createElement } from 'dolla';

const DIRECTIONS_ORDER = ['top', 'right', 'bottom', 'left']

export default class Resizer extends KompElement {
    static tagName = 'komp-resizer'

    static _targetMap = new Map()
    static observer = new ResizeObserver(entries => {
        entries.forEach(entry => {
            const resizer = Resizer._targetMap.get(entry.target)
            if (resizer) { resizer.reposition() }
        })
    })
    
    static observe (inst) {
        Resizer.observer.observe(inst.target)
        Resizer._targetMap.set(inst.target, inst)
    }
    
    static unobserve (inst) {
        Resizer.observer.unobserve(inst.target)
        Resizer._targetMap.delete(inst.target)
    }

    static assignableAttributes = {
        target: { type: 'HTMLElement', default: null, null: true },
        autohide: { type: 'boolean', default: true, null: false },
        offset: { type: 'string', default: null, null: true },
        directions: { type: 'object', default: ['top', 'right', 'bottom', 'left'], null: false },
        move: { type: 'boolean', default: false, null: false },
        container: { type: 'HTMLElement', default: null, null: true },
        handles: { type: 'object', default: { autohide: false, hitBox: 5 }, null: false },
        bounds: { type: 'function', default: () => ({}), null: false }
    }

    static assignableMethods = [
        'onResize'
    ]

    static bindMethods = ['activate']

    connected () {
        if (this.container == null) {
            this.container = this.getRootNode()
        }

        this.style.setProperty('--offset', this.offset)

        if (this.move) {
            append(this, createElement('komp-resizer-move', {
                data: { move: true }
            }))
        }

        const directions = DIRECTIONS_ORDER.filter(dir => this.directions.includes(dir))
        directions.forEach(direction => {
            const handle = createElement('komp-resizer-handle', {
                class: `-${direction}`,
                data: {
                    x: direction == "left" || direction == "right" ? direction : '',
                    y: direction == "bottom" || direction == "top" ? direction : ''
                }
            })
            handle.classList.toggle('autohide', this.handles.autohide)
            handle.style.setProperty('--hitbox', this.handles.hitBox + 'px')
            append(this, handle)
        })

        DIRECTIONS_ORDER.forEach((direction, index) => {
            const next = DIRECTIONS_ORDER[index + 1] || DIRECTIONS_ORDER[0]
            if (directions.includes(direction) && directions.includes(next)) {
                append(this, createElement('komp-resizer-corner', {
                    class: `-${direction} -${next}`,
                    data: {
                        x: [direction, next].find(x => x == "left" || x == "right"),
                        y: [direction, next].find(x => x == "top" || x == "bottom")
                    }
                }))
            }
        })

        this.reposition()

        Resizer.observe(this)

        this.addEventListener('mousedown', this.activate)
        if (this.autohide) {
            this.target.addEventListener('mouseenter', this.show.bind(this))
            this.target.addEventListener('mouseleave', this.hide.bind(this))
            this.addEventListener('mouseenter', this.show.bind(this))
            this.addEventListener('mouseleave', this.hide.bind(this))
        }
    }

    disconnected () {
        this.removeEventListener('mousedown', this.activate)
        Resizer.unobserve(this)
        if (this.hideTimeout) { clearTimeout(this.hideTimeout) }
    }

    hide () {
        if (this.hideTimeout) { clearTimeout(this.hideTimeout) }
        this.hideTimeout = setTimeout(() => this.remove(), 200)
    }

    show () {
        if (this.hideTimeout) { clearTimeout(this.hideTimeout) }
        if (this.getRootNode() == this) {
            this.container.append(this)
        }
    }

    /**
     * Sync the overlay position/size to match the target element.
     */
    reposition () {
        const rect = offsetTo(this.target, this.container)
        this.style.left = rect.left + "px"
        this.style.top = rect.top + "px"
        this.style.width = rect.width + "px"
        this.style.height = rect.height + "px"
    }

    activate (e) {
        const handle = e.target
        const start = { x: e.x, y: e.y }
        const was = this.rect()
        const bounds = this.bounds()

        // Pause observing target during drag to avoid feedback loop
        Resizer.unobserve(this)

        const mousemove = e => {
            const position = { x: e.x, y: e.y }
            if (bounds.left != undefined) { position.x = Math.max(position.x, bounds.left) }
            if (bounds.right != undefined) { position.x = Math.min(position.x, bounds.right) }
            if (bounds.top != undefined) { position.y = Math.max(position.y, bounds.top) }
            if (bounds.bottom != undefined) { position.y = Math.min(position.y, bounds.bottom) }
            const movement = {
                x: position.x - start.x,
                y: position.y - start.y
            }

            if (handle.dataset.move) {
                this.style.left = Math.max(
                    Math.min(was.left + movement.x, bounds.right - was.width),
                    bounds.left
                ) + "px"
                this.style.top = Math.max(
                    Math.min(was.top + movement.y, bounds.bottom - was.height),
                    bounds.top
                ) + "px"
            }

            if (handle.dataset.x == "left") {
                this.style.left = Math.min(was.left + movement.x, was.left + was.width) + "px"
                this.style.width = Math.max(was.width - movement.x, 0) + "px"
            }
            if (handle.dataset.x == "right") {
                this.style.width = Math.max(was.width + movement.x, 0) + "px"
            }
            if (handle.dataset.y == "top") {
                this.style.top = Math.min(was.top + movement.y, was.top + was.height) + "px"
                this.style.height = Math.max(was.height - movement.y, 0) + "px"
            }
            if (handle.dataset.y == "bottom") {
                this.style.height = Math.max(was.height + movement.y, 0) + "px"
            }
        }
        window.addEventListener('mousemove', mousemove)
        window.addEventListener('mouseup', () => {
            this.onResize(this)
            this.trigger('komp:resize')
            window.removeEventListener('mousemove', mousemove)
            // Resume observing target
            Resizer.observe(this)
        }, { once: true })
    }

    /**
     * Returns the current position and size of the overlay.
     * @returns {{left: number, top: number, width: number, height: number}}
     */
    rect () {
        return {
            left: this.offsetLeft,
            top: this.offsetTop,
            width: this.offsetWidth,
            height: this.offsetHeight
        }
    }

    /**
     * Called after a resize/move completes. Default syncs position/size
     * back to the target element's inline styles. Override via constructor
     * option to customize behavior.
     * @param {Resizer} el - this element
     */
    onResize () {
        const targetOffset = offsetTo(this.target.offsetParent, this.container)
        const bb = this.rect()
        bb.left = bb.left - targetOffset.left
        bb.top = bb.top - targetOffset.top

        Object.keys(bb).forEach(k => {
            this.target.style[k] = bb[k] + "px"
        })
    }

    static style = `
        komp-resizer {
            pointer-events: none;
            position: absolute;
            display: block;
            z-index: 15;
            user-select: none;
            box-sizing: content-box;
        }

        komp-resizer-move {
            cursor: move;
            position: absolute;
            inset: 0;
            z-index: 2;
            display: block;
            pointer-events: auto;
        }

        komp-resizer-corner {
            pointer-events: auto;
            display: block;
            position: absolute;
            width: 15px;
            height: 15px;
            margin: -7px;
            padding: 2px;
            z-index: 5;
        }
        komp-resizer-corner::after {
            content: '';
            width: 100%;
            height: 100%;
            background: white;
            border: 2px solid blue;
            display: block;
            border-radius: 50%;
            box-sizing: border-box;
        }
        komp-resizer-corner.-top {
            top: 0;
        }
        komp-resizer-corner.-bottom {
            bottom: 0;
        }
        komp-resizer-corner.-left {
            left: 0;
        }
        komp-resizer-corner.-right {
            right: 0;
        }
        komp-resizer-corner.-top.-left,
        komp-resizer-corner.-bottom.-right {
            cursor: nwse-resize;
        }
        komp-resizer-corner.-top.-right,
        komp-resizer-corner.-bottom.-left {
            cursor: nesw-resize;
        }

        komp-resizer-handle {
            pointer-events: auto;
            display: block;
            position: absolute;
            z-index: 3;
            inset-inline: calc((var(--offset, 0px) + var(--hitbox)) * -1);
            inset-block: 0;
            padding-inline: var(--hitbox, 2px);
        }
        komp-resizer-handle.autohide {
            opacity: 0;
        }
        komp-resizer-handle.autohide:hover {
            opacity: 1;
        }
        komp-resizer-handle::after {
            content: '';
            block-size: 100%;
            inline-size: 2px;
            background: blue;
            display: block;
        }
        komp-resizer-handle.-deactivated {
            pointer-events: none;
        }
        komp-resizer-handle.-left,
        komp-resizer-handle.-top {
            inset-inline-end: auto;
        }
        komp-resizer-handle.-right,
        komp-resizer-handle.-bottom {
            inset-inline-start: auto;
        }

        komp-resizer-handle.-top,
        komp-resizer-handle.-bottom {
            writing-mode: vertical-lr;
            cursor: ns-resize;
        }

        komp-resizer-handle.-left,
        komp-resizer-handle.-right {
            cursor: ew-resize;
        }

        komp-resizer.guides::before,
        komp-resizer.guides::after {
            content: '';
            position: absolute;
            inset-inline: 0;
            inset-block-start: 33%;
            inset-block-end: 33%;
            border-inline-width: 0;
            border-block-width: 1px;
            border-style: inherit;
            border-color: rgb(225, 225, 225);
            mix-blend-mode: overlay;
        }
        komp-resizer.guides::after {
            writing-mode: vertical-lr;
        }
    `
}

window.customElements.define(Resizer.tagName, Resizer)
