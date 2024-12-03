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
<div class="pad-v-2x height-300-px flex justify-content-center align-start rounded-lg">
<button id="example" class="flex align-center gap-1/2x uniformButton">
    Click Me
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>
</button>
<script>
document.addEventListener('DOMContentLoaded', () => {
    const dropdown = new Dropdown({
        anchor: '#example',
        class: 'custom-transition-fade -away bg-white shadow-lg rounded-bottom-lg z-99',
        content: `
            <div class="uniformNav -vertical">
                <a>Home</a>
                <a>Players</a>
                <a>Teams</a>
                <a>Leagues</a>
            </div>
        `
    })
    dropdown.addEventListener('afterConnect', () => {
        dropdown.style.minWidth = dropdown.anchor.offsetWidth + "px"
    })
    document.body.append(dropdown)
})
</script>
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
    
    static assignableAttributes = {
        mouseevent: 'click',
        placement: 'bottom',
        arrow: false,
        removeOnBlur: true,
        timeout: 0
    }
    
    connected (...args) {
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
    
    clearHide () {
        if (this._hideTimeout) {
            clearTimeout(this._hideTimeout)
            delete this._hideTimeout
        }
    }

}
window.customElements.define('komp-dropdown', Dropdown);