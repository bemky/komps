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
</div>
<script>
document.addEventListener('DOMContentLoaded', () => {
    new Tooltip({
        anchor: document.getElementById('example'),
        class: 'animate bg-gray-90 bg-opacity-80 text-white pad-v-1/2x pad-h text-sm rounded shadow-lg shadow-opacity-30',
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
    })
});
</script>

Options
----
timeout:
    default: 300
    types: Number
    description: ms to wait until hiding after mouseout
scope:
    default: 'general'
    type: String
    description: showing a tooltip will hide all other tooltips of same scope
enabled:
    default: true
    type: boolean
    description: set starting state

*/

import { createElement, remove } from 'dolla';
import Floater from './floater.js'; 

export default class Tooltip extends Floater {
    static tagName = 'komp-tooltip'
    static watch = ['anchor']
    
    static assignableAttributes = {
        autoPlacement: { type: 'boolean', default: false, null: false },
        flip: { type: 'boolean', default: true, null: false },
        shift: { type: 'boolean', default: true, null: false },
        strategy: { type: 'string', default: 'absolute', null: false },
        placement: { type: 'string', default: 'top', null: false },
        arrow: { type: 'boolean', default: true, null: false },
        timeout: { type: 'number', default: 300, null: false },
        scope: { type: 'string', default: 'general', null: false }
    }
    
    constructor (options={}, ...args) {
        super(options, ...args)
        this.anchorChanged(this.anchor, this.anchor)
        if (options === undefined) {
            this.needsFirstRemoval = true
        }
        if (options.enabled != false) {
            this.enable()
        }
    }
    
    enable () {
        this.anchor.addEventListener('mouseenter', this.show)
        this.anchor.addEventListener('mouseleave', this.hide)
        this.addEventListener('mouseenter', this.show)
        this.addEventListener('mouseleave', this.hide)
    }
    
    disable () {
        this.anchor.removeEventListener('mouseenter', this.show)
        this.anchor.removeEventListener('mouseleave', this.hide)
        this.removeEventListener('mouseenter', this.show)
        this.removeEventListener('mouseleave', this.hide)
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
    
    async remove () {
        await super.remove()
        if (window.activeTooltips[this.scope] == this) {
            delete window.activeTooltips[this.scope]
        }
    }

}
window.customElements.define('komp-tooltip', Tooltip);