/*
Description
----
Starts with max number of columns given content, and reduces column count until no cells overflow

Syntax
----
    <auto-grid>
        <div>1</div>
        <div>2</div>
        <div>3</div>
    </auto-grid>

Example
----
<auto-grid class="pad-2x gap-xl">
    <div class="rounded bg-white bg-opacity-30">lorem</div>
    <div class="rounded bg-white bg-opacity-30">Lorem ipsum dolor</div>
    <div class="rounded bg-white bg-opacity-30">sit amet, consectetur adipisicing</div>
    <div class="rounded bg-white bg-opacity-30">elit</div>
    <div class="rounded bg-white bg-opacity-30">sed do</div>
    <div class="rounded bg-white bg-opacity-30">eiusmod</div>
    <div class="rounded bg-white bg-opacity-30">tempor incididunt ut labore et dolore</div>
    <div class="rounded bg-white bg-opacity-30">magna aliqua. Ut enim</div>
    <div class="rounded bg-white bg-opacity-30">ad minim</div>
    <div class="rounded bg-white bg-opacity-30">veniam, quis nostrud</div>
    <div class="rounded bg-white bg-opacity-30">exercitation</div>
    <div class="rounded bg-white bg-opacity-30">ullamco laboris nisi ut aliquip ex ea</div>
    <div class="rounded bg-white bg-opacity-30">1</div>
    <div class="rounded bg-white bg-opacity-30">commodo consequat.</div>
    <div class="rounded bg-white bg-opacity-30">Duis aute irure dolor</div>
</auto-grid>

Options
----
columnWidth:
    description: width of each column
    default: minmax(max-content, 1fr)
*/

import KompElement from './element.js';
export default class AutoGrid extends KompElement {
    
    static observer = new ResizeObserver(entries => {
        entries.forEach(entry => entry.target.resize())
    })
    
    static assignableAttributes = {
        columnWidth: 'max-content'
    }
    
    connected () {
        this.constructor.observer.observe(this)
        this.resize()
    }
    
    disconnected () {
        this.constructor.observer.unobserve(this)
    }
    
    resize () {
        const style = getComputedStyle(this)
        const children = Array.from(this.children)
        
        let columns = children.length + 1
        let isOverflow;
        do {
            columns -= 1
            this.style.setProperty('grid-template-columns', new Array(columns).fill(this.columnWidth).join(" "))
            isOverflow = children.some(el => el.offsetLeft < (this.offsetLeft - parseFloat(style.paddingLeft)))
            isOverflow = isOverflow || children.some(el => el.offsetLeft + el.offsetWidth > (this.offsetLeft + this.offsetWidth - parseFloat(style.paddingRight)))
        } while (columns > 1 && isOverflow)
    }
    
    static style = `
        auto-grid {
            display: grid;
        }
    `
}

window.customElements.define('auto-grid', AutoGrid)