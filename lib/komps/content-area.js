/*
Description
----
A responsive input that resizes to it's content, and adheres to explicit sizing. 

Example
----
<div class="pad-2x">
</div>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelector('div').append(new ContentArea({
            value: "Initial Value"
        }))
    })
</script>

Syntax
----
```javascript
new ContentArea({
    value: "Initial Value"
})
```

Options
----
value:
    description: similar to input.value
dump:
    types: Function
    arguments: value
    description: transform textContent to value on change
load:
    types: Function
    arguments: value
    description: transform value for input's content
onchange:
    types: Function
    arguments: value, valueWas
    description: callback called when change event is fired

Events
----
change:
    description: fired on focusout when value has changed
    arguments: newValue, oldValue

*/

import { content } from 'dolla';
import { placeCaretAtEnd } from '../support';
import KompElement from './element.js';

export default class ContentArea extends KompElement {
    static tagName = "komp-content-area"
    
    static assignableAttributes = ['onchange']
    static assignableMethods = ['load']
    
    get value () {
        return this.dump(this.innerHTML.replaceAll("<br>", "\n").replaceAll(/<[^\>]+>/g, ''))
    }
    
    set value (v) {
        content(this, this.load(v))
    }
    
    constructor (attrs={}) {
        attrs = Object.assign({
            tabIndex: 0,
            contenteditable: true,
        }, attrs)
        
        const value = attrs.content
        delete attrs.content
        
        super(attrs)
        this.value = value || attrs.value
        this.valueWas = this.value
        this.addEventListener('focusout', this.onFocusOut)
        this.addEventListener('focusin', this.onFocusIn)
    }
    
    onFocusIn () {
        this.valueWas = this.value
        placeCaretAtEnd(this)
    }
    
    onFocusOut () {
        const v = this.value
        if (this.valueWas != v) {
            if (this.onchange) {
                this.onchange(v, this.valueWas)
            }
            this.trigger('change', v, this.valueWas)
            this.valueWas = v
        }
    }
    
    dump (v) {
        return v.trimEnd()
    }
    
    load (v) {
        if (typeof v == "string") {
            v = v.replaceAll("\n", "<br>")
        }
        return v
    }
    
    select () {
        const range = document.createRange();
        range.selectNodeContents(this);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
    
    static style = `
        komp-content-area {
            appearance: textfield;
            background-color: white;
            border-width: 1px;
            padding: 0.22em;
            display: inline-block;
            min-width: 4ch;
        }
    `
}
window.customElements.define(ContentArea.tagName, ContentArea);