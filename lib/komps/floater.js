import { computePosition, offset, flip, shift, arrow, size, autoPlacement, inline, autoUpdate } from '@floating-ui/dom';
import { css } from 'dolla';

import KompElement from './element.js';

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
<komp-floater anchor="#example" align="right top" class="bg-gray-90 bg-opacity-80 text-white pad-1/2x rounded-lg shadow-lg shadow-opacity-30">
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
    types: Boolean, Object, HTMLElement
    description: See https://floating-ui.com/docs/arrow, element, uses default options with provided element
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
The floater will follow the transition effects set by CSS, it adds classes `-left`, `-right`, `-top`, `-bottom`, based on selected alignment, and adds classes `-out` and `-in` when hiding and showing.
*/

export default class Floater extends KompElement {
    
    static options = [
        'content', 'anchor', 'placement', 'strategy', 'flip', 'offset', 'shift', 'arrow', 'size', 'autoPlacement', 'inline', 'autoUpdate'
    ]

    autoPlacement = true
    shift = true
    strategy = 'absolute'
    placement = 'bottom'

    connected () {
        if (typeof this.anchor == "string") {
            this.anchor = this.getRootNode().querySelector(this.anchor);
        }
        this.style.position = this.strategy
        
        const root = this.getRootNode()
        if (!root) { throw 'Floater needs root to find anchor to position to.' }
        if (!this.anchor) { throw 'Floater needs anchor to position to.' }
        
        const middleware = []
        Object.keys(middlewares).forEach(key => {
            if (this[key]) { middleware.push(middlewares[key](this[key] === true ? {} : this[key])) }
        })

        const transitionDuration = Math.max(...css(this, 'transition-duration').split(", ").map(x => parseFloat(x))) * 1000
        this.classList.add('-in')
        setTimeout(() => {
            this.classList.remove('-in')
        }, transitionDuration)
        
        this.cleanupCallbacks.push(autoUpdate(
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
                    this.classList.add('-' + placement);
            
                    if (middlewareData.arrow) {
                        const {x, y} = middlewareData.arrow;
 
                        const staticSide = {
                          top: 'bottom',
                          right: 'left',
                          bottom: 'top',
                          left: 'right',
                        }[placement.split('-')[0]];
                
                        Object.assign(this.arrow.style, {
                            left: x != null ? `${x}px` : '',
                            top: y != null ? `${y}px` : '',
                            right: '',
                            bottom: '',
                            [staticSide]: '-4px',
                        });
                    }
                })
            },
            this.autoUpdate
        ))
    }
    
    remove () {
        const transitionDuration = Math.max(...css(this, 'transition-duration').split(", ").map(x => parseFloat(x))) * 1000
        super.remove(() => new Promise(resolve => {
            this.classList.add('-out')
            setTimeout(() => {
                resolve()
                this.classList.remove('-out');
            }, transitionDuration)
        }))
    }
}
window.customElements.define('komp-floater', Floater);
const middlewares = {
    size: size,
    offset: offset,
    shift: shift,
    autoPlacement: autoPlacement,
    flip: flip,
    inline: inline,
    arrow: arrow
}