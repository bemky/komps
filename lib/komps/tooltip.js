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
<div class="pad-v-8x bg-purple-10 flex justify-content-center rounded-lg">
<div class="flex align-center gap-1/2x">
    <span class="uniformLabel block cursor-help" id="example">
        ?
    </span>
    <svg width="24" height="24" viewBox="0 0 24 24" class="text-purple-50" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
    Hover This
</div>
<komp-tooltip anchor="#example" class="custom-transition-fade bg-gray-90 bg-opacity-80 text-white pad-v-1/2x pad-h text-sm rounded-lg shadow-lg shadow-opacity-30">
    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
</komp-tooltip>
</div>

Options
----
timeout:
    types: Number
    description: Number of milliseconds to wait to remove after showing

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
        arrow: true
    }
    
    _showing = false
    
    constructor (options, ...args) {
        super(options, ...args)
        if (this.anchor) {
            this.anchorChanged(this.anchor, this.anchor)
        }
        if (options === undefined) {
            this.needsFirstRemoval = true
        }
    }
    
    connected () {
        super.connected();
        if (this.getRootNode() == this.anchor.getRootNode()) {
            if (this._showing == false) {
                remove(this);
                return false
            }
        }
    }
    
    anchorChanged (was, now) {
        if (was && was instanceof HTMLElement) {
            was.removeEventListener('mouseenter', this.show.bind(this))
            was.removeEventListener('mouseleave', this.hide.bind(this))
        }
        if (now && now instanceof HTMLElement) {
            now.addEventListener('mouseenter', this.show.bind(this))
            now.addEventListener('mouseleave', this.hide.bind(this))
        }
    }

}
window.customElements.define('komp-tooltip', Tooltip);