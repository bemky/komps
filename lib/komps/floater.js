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
<div class="pad-2x bg-purple-10 text-center rounded-lg">
<div id="example" class="border-2px border-dashed inline-block pad bg-white">
    This is the anchor
</div>
<komp-floater anchor="#example" class="bg-gray-90 bg-opacity-80 text-white pad-1/2x rounded-lg shadow-lg shadow-opacity-30">
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
    description: True to show default size, or pass integer to set size in ems
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

Transition Animation
----
The floater will follow the transition effects set by CSS, and adds classes `-out`, `-out-start`, `-in` and `-in-start` when hiding and showing.

Additionally, the floater adds classes for placement `-left`, `-right`, `-top`, `-bottom`

Example Transition Effect
```scss
TODO
```
*/

import { computePosition, offset, flip, shift, arrow, size, autoPlacement, inline, autoUpdate } from '@floating-ui/dom';
import { css, createElement } from 'dolla';

import KompElement from './element.js';

export default class Floater extends KompElement {
    
    static assignableAttributes = [
        'content', 'anchor', 'placement', 'strategy', 'flip', 'offset', 'shift', 'arrow', 'size', 'autoPlacement', 'inline', 'autoUpdate'
    ]
    
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
    `

    autoPlacement = true
    shift = true
    strategy = 'absolute'
        
    constructor (...args) {
        super(...args)
    }
    
    instantiate () {
        super.instantiate()
        if (typeof this.anchor == "string") {
            this.anchor = this.getRootNode().querySelector(this.anchor);
        }
    }

    connected () {
        this.style.position = this.strategy
        
        if (!this.anchor) { throw 'Floater needs anchor to position to.' }
        
        const middleware = []
        Object.keys(middlewares).forEach(key => {
            if (this[key]) {
                if (key == "arrow") {
                    const arrowEl = createElement('div', {style: {position: 'absolute', left: 0, top: 0, width: "1px", height: "1px"}})
                    this.prepend(arrowEl)
                    middleware.push(arrow({element: arrowEl}))
                    this.classList.add('komp-floater-arrow')
                    if (typeof this.arrow == "number") {
                        this.style.setProperty('--arrow-size', this.arrow)
                    }
                    if (!this.offset) {
                        this.offset = this.arrow === true ? 10 : this.arrow
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
                }).then(({x, y, placement, middlewareData}) => {
                    this.style.left = `${x}px`;
                    this.style.top = `${y}px`;
                    this.classList.remove('-top', '-left', '-bottom', '-right')
                    this.classList.add('-' + placement);
            
                    if (middlewareData.arrow) {
                        const {x, y} = middlewareData.arrow;
                        if (x != null) { this.style.setProperty('--arrow-left', `${x}px`) }
                        if (y != null) { this.style.setProperty('--arrow-top', `${y}px`) }
                    }
                })
            },
            this.autoUpdate
        ))
        
        this.classList.add('-in', '-in-start')
        const transitionDuration = Math.max(...css(this, 'transition-duration').split(", ").map(x => parseFloat(x))) * 1000
        setTimeout(() => {
            this.classList.remove('-in-start')
        }, 0)
        setTimeout(() => {
            this.classList.remove('-in')
        }, transitionDuration)
    }
    
    remove (callback) {
        super.remove(() => new Promise(resolve => {
            this.classList.add('-out', '-out-start')
            const transitionDuration = Math.max(...css(this, 'transition-duration').split(", ").map(x => parseFloat(x))) * 1000
            setTimeout(() => {
                this.classList.remove('-out-start')
            }, 0)
            setTimeout(() => {
                resolve()
                if (callback) { callback() }
                this.classList.remove('-out');
            }, transitionDuration)
        }))
    }
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