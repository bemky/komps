/*

Description
----
Assign a message to show on hover.

Syntax
----
```javascript
    new Tooltip({
        content: "Hello World",
        anchor: '#hi-button'
    })
```

HTML
```html
<komp-tooltip anchor="#hi-button">
    Hello World
</komp-tooltip>
```

Example
----
<div class="pad-v-8x flex justify-content-center rounded-lg">
<div class="flex align-center gap-1/2x">
    <div class="pad-h-1/2x rounded bg-purple-60 text-white inline-block cursor-help" id="example">
        ?
    </div>
    <svg width="24" height="24" viewBox="0 0 24 24" class="text-purple-50" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
    Hover This
</div>
<komp-tooltip anchor="#example" class="animate bg-gray-90 bg-opacity-80 text-white pad-v-1/2x pad-h text-sm rounded shadow-lg shadow-opacity-30">
    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
</komp-tooltip>
</div>

Options
----
timeout:
    default: 300
    types: Number
    description: ms to wait until hiding after mouseout

*/

import { createElement, remove } from 'dolla';
import Floater from './floater.js'; 

export default class Tooltip extends Floater {

    static watch = ['anchor']
    
    static assignableAttributes = {
        autoPlacement: false,
        flip: true,
        shift: true,
        strategy: 'absolute',
        placement: 'top',
        arrow: true,
        timeout: 300
    }
    
    constructor (options, ...args) {
        super(options, ...args)
        this.anchorChanged(this.anchor, this.anchor)
        if (options === undefined) {
            this.needsFirstRemoval = true
        }
        this.addEventListener('mouseenter', this.show)
        this.addEventListener('mouseleave', this.hide)
    }
    
    connected () {
        super.connected();
        if (this.getRootNode() == this.anchor.getRootNode()) {
            if (this.showing == false) {
                remove(this);
                return false
            }
        }
    }
    
    anchorChanged (was, now) {
        if (was && was.removeEventListener) {
            was.removeEventListener('mouseenter', this.show)
            was.removeEventListener('mouseleave', this.hide)
        }
        if (now && now.addEventListener) {
            now.addEventListener('mouseenter', this.show)
            now.addEventListener('mouseleave', this.hide)
        }
    }
    
    show (...args) {
        super.show()
        if (window.activeTooltip && window.activeTooltip != this) {
            window.activeTooltip.hideNow()
        }
        window.activeTooltip = this
    }
    
    async remove () {
        await super.remove()
        if (window.activeTooltip == this) {
            delete window.activeTooltip
        }
    }

}
window.customElements.define('komp-tooltip', Tooltip);