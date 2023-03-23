import KompElement from './element';
import { offsetTo, outerWidth, outerHeight } from 'dolla';

/*

Description
----
Render content on a layer above an anchored element. 

Syntax
----
    new Popover({
        content: "Hello World",
        anchor: '#hi-button'
    })

Example
----
<button id="example">
    This Does something
</button>
<komp-popover anchor="#example">
    <div class="bg-white pad shadow rounded shadow">
        This popover explains it
    </div>
</komp-popover>

Options
----
### `content`
A String, HTMLElement, Array, or Object accepted by [dolla](https://dollajs.com/#append)

### `anchor`
A String (used a selector query of this.getRootNode(), commonly body), or an HTMLElement

### `align`
How the popover is positioned to anchor, `[left|right|center|#px] [top|center|bottom|#px]` (default: `center bottom`)

### `offset`
How much margin/offset to build around the popover, can be a number or Object({left: #, top: #})
*/

export default class Popover extends KompElement {
    
    static defaults = {
        content: null,
        anchor: null,
        align: 'center bottom',
        offset: {}
    }
    
    connectedCallback () {
        if (!this.inititalAttributes.content && !this.getAttribute('content')) {
            this.inititalAttributes.content = this.innerHTML
        }
        if (typeof this.offset == "string") {
            if (this.offset.includes("{")) {
                this.offset = JSON.parse(this.offset)
            } else {
                this.offset = {
                    left: parseInt(this.offset),
                    top: parseInt(this.offset)
                }
            }
        }
        super.connectedCallback()
    }
    connected () {
        if (typeof this.anchor == "string") {
            const root = this.getRootNode() || document.body
            this.anchor = root.querySelector(this.anchor)
        }
    }
    
    setPosition() {
        var [leftAlign, topAlign] = this.align.split(" ");
        leftAlign = leftAlign || "bottom";
        
        let anchorOffset = {left: 0, top: 0}
        if (this.anchor.offsetParent != this.offsetParent) {
            anchorOffset = offsetTo(this.anchor, this);
        }
        
        var position = {};
        if(leftAlign == 'left'){
            position.right = outerWidth(this.offsetParent) - anchorOffset.left;
        } else if (leftAlign == 'center'){
            position.left = anchorOffset.left + outerWidth(this.anchor) / 2;
            position.transform = "translateX(-50%)";
        } else if (leftAlign == 'right'){
            position.left = anchorOffset.left + outerWidth(this.anchor);
        } else if (leftAlign.includes("px")){
            position.left = anchorOffset.left + parseInt(leftAlign);
        }
        
        if(topAlign == 'top'){
            let height = outerHeight(this.offsetParent);
            if(this.offsetParent == document.body && getComputedStyle(this.offsetParent)['position'] == "static"){
                height = window.innerHeight;
            } else if (this.offsetParent == document.body) {
                height = Math.max(height, document.body.clientHeight);
            }
            position.bottom = height - anchorOffset.top;
        } else if(topAlign == 'center'){
            position.top = anchorOffset.top + outerHeight(this.anchor) / 2;
            position.transform = "translateY(-50%)";
        } else if (topAlign == 'bottom'){
            position.top = anchorOffset.top + outerHeight(this.anchor);
        } else if (topAlign.includes("px")){
            position.top = anchorOffset.top + parseInt(topAlign);
        }
        
        if (this.offset.left) position.left += parseInt(this.offset.left);
        if (this.offset.left) position.right -= parseInt(this.offset.left);
        if (this.offset.top) position.top += parseInt(this.offset.top);
        if (this.offset.top) position.bottom -= parseInt(this.offset.top);
        
        this.style.left = null;
        this.style.right = null;
        this.style.top = null;
        this.style.bottom = null;
        this.style.transform = null;
        Object.keys(position).forEach(function(key){
            this.style[key] = position[key] + (key != "transform" ? "px" : "");
        }, this);
    }
}
customElements.define("komp-popover", Popover);