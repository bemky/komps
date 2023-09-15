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
<div class="flex align-center gap">
    <span class="uniformLabel block cursor-help" id="example">
        ?
    </span>
    <--- Hover This
</div>
<komp-tooltip anchor="#example" class="custom-transition-fade bg-gray-90 bg-opacity-80 text-white pad-1/2x rounded-lg shadow-lg shadow-opacity-30">
    Lorem
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
    
    autoPlacement = false
    flip = true
    shift = true
    strategy = 'absolute'
    placement = 'top'
    arrow = true
    
    instantiate () {
        super.instantiate();
        this.container = this.parentElement;
        remove(this);
        return false
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
    
    show () {
        if (!this.parentElement) { this.container.append(this) }
    }
    
    hide () {
        if (this.parentElement) { this.remove() }
    }
    
    toggle (shouldHide) {
        if (shouldHide === undefined) { shouldHide = this.offsetParent === undefined }
        this[shouldHide ? 'hide' : 'show']()
    }

}
window.customElements.define('komp-tooltip', Tooltip);