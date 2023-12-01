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
new Input({
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
import KompElement from './element.js';

export default class ContentArea extends KompElement {
    static tagName = "komp-content-area"
    
    static assignableAttributes = ['onchange']
    static assignableMethods = ['load']
    
    constructor (attrs={}) {
        attrs = Object.assign({
            tabIndex: 0,
            contenteditable: true,
        }, attrs)
        
        const value = attrs.content
        delete attrs.content
        
        super(attrs)
        
        content(this, this.load(value || attrs.value))
        
        let valueWas = this.dump(this.innerText)
        this.addEventListener('focusout', e => {
            let value = this.dump(this.innerText)
            if (valueWas != value) {
                if (this.onchange) {
                    this.onchange(value, valueWas)
                }
                this.trigger('change', value, valueWas)
            }
        })
    }
    
    dump (v) {
        return v.trimEnd().replaceAll("<br>", "\n")
    }
    
    load (v) {
        if (typeof v == "string") {
            v = v.replaceAll("\n", "<br>")
        }
        return v
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