/*

Description
----
Render content on a layer above an anchored element. 

Syntax
----
```javascript
    new Floater({
        content: "Hello World",
        anchor: '#hi-button'
    })
```

HTML
```html
<komp-floater anchor="#hi-button">
    Hello World
</komp-floater>
```

Example
----
<div class="pad-2x text-center rounded-lg">
<div id="example" class="border-2px border-dashed inline-block pad bg-white">
    This is the anchor
</div>
<komp-floater anchor="#example" class="bg-gray-90 bg-opacity-80 text-white pad-1/2x rounded shadow-lg shadow-opacity-30">
    FLOATER
</komp-floater>
</div>

Options
----
content:
    types: String, HTMLElement, Array, Object
    description: content for the floater, uses [Dolla's `content`](https://dollajs.com/#content)
anchor:
    types: HTMLElement
    description: element to anchor positioning to
    required: true
container
    types: String, HTMLElement
    description: element to append floater to. If `String`, then used as selector for `this.closest(selector)`
    default: null/anchor.parentElement
placement:
    default: "bottom"
    types: String
    description: how the floater is anchored options like "top", "top-start", "top-end", "left", "left-start"...
strategy:
    default: "absolute"
    types: String
    description: how the floater is positioned in the document. "absolute" or "fixed"
flip:
    default: false
    types: Boolean, Object
    description: See https://floating-ui.com/docs/flip, defaults to false in favor of autoPlacement
offset: 
    default: false
    types: Boolean, Object
    description: See https://floating-ui.com/docs/offset
shift:
    default: true
    types: Boolean, Object
    description: See https://floating-ui.com/docs/shift
arrow: 
    default: false
    types: Boolean, Number
    description: True to show default size, or number in pixels
size: 
    default: false
    types: Boolean, Object
    description: See https://floating-ui.com/docs/size
autoPlacement: 
    default: true
    types: Boolean, Object
    description: See https://floating-ui.com/docs/autoPlacement
inline: 
    default: false
    types: Boolean, Object
    description: See https://floating-ui.com/docs/inline
autoUpdate:
    default: true
    types: Boolean, Object
    description: See https://floating-ui.com/docs/autoUpdate#options
removeOnBlur:
    default: false
    types: Boolean
    description: hide floater on outside click/focus or escape key
timeout:
    default: 0
    types: Number
    description: ms to wait until hiding after mouseout
onHide:
    default: null
    types: Function
    description: called after hidden
onShow:
    default: null
    types: Function
    description: called before showing

Properties
----
showing:
    type: boolean
    description: is floater showing, can be disconnected and not showing in case of Tooltip

Events
----
shown:
    description: when floater is shown
hidden:
    description: when floater is hidden

Transition Animation
----
The floater will follow the transition effects set by CSS, and adds classes `-out`, `-out-start`, `-in` and `-in-start` when hiding and showing.

Additionally, the floater adds classes for placement `-left`, `-right`, `-top`, `-bottom`

TODO
----
- [ ] convert to Popover and use [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)
- [ ] convert to use [CSS anchor positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning)
*/

import { computePosition, offset, flip, shift, arrow, size, autoPlacement, inline, autoUpdate } from '@floating-ui/dom';
import { css, createElement } from 'dolla';

import KompElement from './element.js';

export default class Floater extends KompElement {
    static tagName = 'komp-floater';
    
    static assignableAttributes = {
        content: null,
        anchor: null,
        placement: undefined,
        strategy: 'absolute',
        flip: null,
        offset: null,
        shift: true,
        arrow: null,
        autoPlacement: true,
        inline: null,
        autoUpdate: {},
        removeOnBlur: false,
        container: null,
        timeout: 0,
        onHide: null,
        onShow: null
    }
    
    static bindMethods = ['show', 'hide', 'checkFocus', 'checkEscape']
    showing = false
    
    initialize () {
        super.initialize()
        if (typeof this.anchor == "string") {
            this.anchor = this.getRootNode().querySelector(this.anchor);
        } else if (!(this.anchor instanceof Element)) {
            const coords = this.anchor
            this.anchor = {
                getBoundingClientRect() {
                    return {
                        width: 0,
                        height: 0,
                        x: coords.x,
                        y: coords.y,
                        left: coords.x,
                        right: coords.x,
                        top: coords.y,
                        bottom: coords.y
                    };
                }
            }
        }
    }

    connected () {
        this.style.position = this.strategy
        
        if (!this.anchor) { throw 'Floater needs anchor to position to.' }
        
        const middleware = []
        Object.keys(middlewares).forEach(key => {
            if (this[key]) {
                if (key == "arrow") {
                    let arrowEl = this.querySelector('komp-floater-arrow-locator')
                    if (!arrowEl) {
                        arrowEl = createElement('komp-floater-arrow-locator')
                        this.prepend(arrowEl)
                    }
                    middleware.push(arrow({element: arrowEl}))
                    this.classList.add('komp-floater-arrow')
                    if (typeof this.arrow == "number") {
                        this.style.setProperty('--arrow-size', this.arrow + "px")
                    } 
                    if (!this.offset) {
                        this.offset = this.arrow === true ? 10 : this.arrow
                    }
                    if (css(this, 'box-shadow') != "none") {
                        this.style.filter = css(this, 'box-shadow').split(/(?<!\([^\)]*),/).map(shadow => {
                            return `drop-shadow(${shadow.trim().split(/(?<!\([^\)]*)\s/).slice(0,4).join(" ")})`
                        }).join(" ")
                        this.style.boxShadow = 'none'
                    }
                } else {
                    middleware.push(middlewares[key](this[key] === true ? {} : this[key]))
                }
            }
        })
        this._cleanupCallbacks.push(autoUpdate(
            this.anchor,
            this,
            () => {
                computePosition(this.anchor, this, {
                    strategy: this.strategy,
                    placement: this.placement,
                    middleware
                }).then(({x, y, placement, middlewareData, ...args}) => {
                    this.style.left = `${x}px`;
                    this.style.top = `${y}px`;
                    this.classList.remove('-top', '-left', '-bottom', '-right')
                    this.classList.add('-' + placement);
            
                    if (middlewareData.arrow) {
                        const {x, y} = middlewareData.arrow;
                        if (x != null) {
                            this.style.setProperty('--arrow-left', `${x}px`)
                            this.querySelector('komp-floater-arrow-locator').style.setProperty('left', `${x}px`)
                        }
                        if (y != null) {
                            this.style.setProperty('--arrow-top', `${y}px`)
                            this.querySelector('komp-floater-arrow-locator').style.setProperty('top', `${x}px`)
                        }
                    }
                })
            },
            this.autoUpdate
        ))
        
        this.classList.add('-in')
        this.addEventListener('animationend', () => {
            this.classList.remove('-in')
        }, {once: true})
        
        if (this.removeOnBlur) {
            this.cleanupEventListenerFor(this.getRootNode().body, 'focusin', this.checkFocus)
            this.cleanupEventListenerFor(this.getRootNode().body, 'click', this.checkFocus)
            this.cleanupEventListenerFor(this.getRootNode().body, 'keyup', this.checkEscape)
        }
    }
    
    checkFocus (e) {
        if (e.defaultPrevented) { return }
        if (e.target == this) { return }
        if (e.target == this.anchor) { return }
        if (this.contains(e.target)) { return }
        if (this.anchor.contains && this.anchor.contains(e.target)) { return }
        this.hide()
    }
    
    checkEscape (e) {
        if (e.which != 27) return;
        this.hide();
    }
    
    remove () {
        return new Promise(resolve => {
            this.classList.add('-out')
        
            const done = () => {
                this.classList.remove('-out')
                super.remove().then(resolve)
            }
            if (css(this, 'animation-name') != "none") {
                this.addEventListener('animationend', done, {once: true})
            } else {
                done()
            }
        })
    }
    
    show () {
        if (this._hideTimeout) {
            clearTimeout(this._hideTimeout);
            delete this._hideTimeout;
        }
        if (this._removing) {
            return this._removing.then(this.show)
        }
        if (typeof this.container == "string") {
            this.container = this.closest(this.container) || (this.anchor.closest && this.anchor.closest(this.container))
        }
        if (this.container == null) {
            this.container = this.parentElement || this.anchor.parentElement;
        }
        if (!this.parentElement) {
            this.showing = true
            if (this.onShow && this.onShow() == false) return
            this.container.append(this)
            this.trigger('shown')
        }
        return this;
    }
    
    hideNow () {
        this.hideAfterTimeout()
    }
    
    hide () {
        if (this._hideTimeout) { return }
        if (this._hiding) { return }
        this._hideTimeout = setTimeout(this.hideAfterTimeout.bind(this), this.timeout)
    }
    
    hideAfterTimeout () {
        if (this.parentElement) {
            return this._removing = this.remove().then(() => {
                this.showing = false
                this.trigger('hidden')
                if (this.onHide) this.onHide()
                delete this._hideTimeout;
                delete this._removing;
            })
        }
        return this;
    }
    
    toggle (shouldHide) {
        if (typeof shouldHide !== 'boolean') {
            shouldHide = this.offsetParent !== null
        }
        this[shouldHide ? 'hide' : 'show']()
        return this;
    }
    
    static style = `
        .komp-floater-arrow {
            --arrow-size: 0.5em;
            --arrow-left: 0;
            --arrow-top: 0;
        }
        .komp-floater-arrow:after{
            content: '';
            clip-path: polygon(0 0, 50% 100%, 100% 0);
            z-index: 1;
            position:absolute;
            top: calc(var(--arrow-top) - var(--arrow-size));
            left: calc(var(--arrow-left) - var(--arrow-size));
            width: calc(var(--arrow-size) * 2);
            height: var(--arrow-size);
            overflow: hidden;
            border-style: solid;
            border-width: inherit;
            box-shadow: inherit;
            background: inherit;
            border: inherit;
        }
        .komp-floater-arrow.-top:after{
            top: 100%;
        }
        .komp-floater-arrow.-bottom:after{
            top: auto;
            bottom: 100%;
            transform: rotate(180deg);
        }
        .komp-floater-arrow.-left:after,
        .komp-floater-arrow.-right:after {
            clip-path: polygon(0 0, 100% 50%, 0 100%);
            width: var(--arrow-size);
            height: calc(var(--arrow-size) * 2);
        }
        .komp-floater-arrow.-left:after{
            left: 100%;
        }
        .komp-floater-arrow.-right:after{
            left: auto;
            right: 100%;
            transform: rotate(180deg);
        }
        komp-floater-arrow-locator {
            position: absolute;
            left: 0;
            top: 0;
            width: var(--arrow-size, 1px);
            height: var(--arrow-size, 1px);
        }
    `
}
window.customElements.define('komp-floater', Floater);
const middlewares = {
    size: size,
    shift: shift,
    autoPlacement: autoPlacement,
    flip: flip,
    inline: inline,
    arrow: arrow,
    offset: offset
}