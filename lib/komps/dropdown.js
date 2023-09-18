/*

Description
----
Assign a floater panel to a [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)

Syntax
----
```javascript
    new Dropdown({
        content: createElement({
            class: 'bg-white pad',
            content: 'Hello World'
        }),
        anchor: '#hi-button'
    })
```

HTML
```html
<komp-dropdown anchor="#hi-button">
    Hello World
</komp-dropdown>
```

Example
----
<div class="pad-v-2x height-300-px bg-purple-10 flex justify-content-center align-start rounded-lg">
<button id="example" class="flex align-center gap-1/2x uniformButton">
    Click Me
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>
</button>
<komp-dropdown anchor="#example" class="custom-transition-fade bg-white shadow-lg rounded-lg z-99">
    <div class="uniformNav -vertical">
        <a>Home</a>
        <a>Players</a>
        <a>Teams</a>
        <a>Leagues</a>
    </div>
</komp-dropdown>
</div>

Options
----
mouseevent:
    types: String
    default: 'click'
    description: MouseEvent that toggles floater

*/

import { createElement, remove } from 'dolla';
import Tooltip from './tooltip.js';

export default class Dropdown extends Tooltip {
    
    static assignableAttributes = [
        'mouseevent'
    ]
    
    placement = 'bottom'
    mouseevent = 'click'
    arrow = 10
    
    connected (...args) {
        this.addEventListenerFor(this.getRootNode(), 'focusin', this.checkFocus.bind(this))
        this.addEventListenerFor(this.getRootNode(), 'click', this.checkFocus.bind(this))
        this.addEventListenerFor(this.getRootNode(), 'keyup', this.checkEscape.bind(this))
        this.addEventListener('mouseenter', this.clearHide.bind(this))
        if (this.mouseevent == "mouseenter") {
            this.addEventListener('mouseleave', this.hide.bind(this))
        }
        return super.connected(...args);
    }
    
    show () {
        super.show()
        this.anchor.classList.add('-active')
    }
    
    hide () {
        super.hide()
        this.anchor.classList.remove('-active')
    }
    
    anchorChanged (was, now) {
        if (this.mouseevent == "mouseenter") {
            super.anchorChanged(was, now)
        } else {
            if (was && was instanceof HTMLElement) {
                was.removeEventListener(this.mouseevent, this.toggle.bind(this))
            }
            if (now && now instanceof HTMLElement) {
                now.addEventListener(this.mouseevent, this.toggle.bind(this))
            }
        }
    }
    
    checkFocus (e) {
        if (e.defaultPrevented) { return }
        if (e.target == this) { return }
        if (e.target == this.anchor) { return }
        if (this.contains(e.target)) { return }
        if (this.anchor.contains(e.target)) { return }
        this.hide()
    }
    
    checkEscape (e) {
        if (e.which != 27) return;
        this.hide();
    }
    
    clearHide () {
        if (this._hideTimeout) {
            clearTimeout(this._hideTimeout)
            delete this._hideTimeout
        }
    }

}
window.customElements.define('komp-dropdown', Dropdown);