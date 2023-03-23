import {content, append} from 'dolla';

export default class KompElement extends HTMLElement {
    
    static defaults = {}
    static style = ''
    
    constructor(attrs={}) {
        super()
        this.inititalAttributes = attrs;
        
        const style = new CSSStyleSheet();
        style.replaceSync(this.constructor.style)
        this.body = this.attachShadow({ mode: "open" });
        this.body.adoptedStyleSheets = [style]
    }
    
    connected () {}
    connectedCallback () {
        Object.keys(this.constructor.defaults).forEach(key => {
            const value = this.inititalAttributes[key] || this.getAttribute(key) || this.dataset[key] || this.constructor.defaults[key]
            
            if (key == "content") {
                append(this.body, value)
            } else {
                this[key] = value;
            }
        })
        this.connected()
    }
    
}