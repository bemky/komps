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
    <div class="rounded bg-white pad-h-1/4x">lorem</div>
    <div class="rounded bg-white pad-h-1/4x">Lorem ipsum dolor</div>
    <div class="rounded bg-white pad-h-1/4x">sit amet, consectetur adipisicing</div>
    <div class="rounded bg-white pad-h-1/4x">elit</div>
    <div class="rounded bg-white pad-h-1/4x">sed do</div>
    <div class="rounded bg-white pad-h-1/4x">eiusmod</div>
    <div class="rounded bg-white pad-h-1/4x">tempor incididunt ut labore et dolore</div>
    <div class="rounded bg-white pad-h-1/4x">magna aliqua. Ut enim</div>
    <div class="rounded bg-white pad-h-1/4x">ad minim</div>
    <div class="rounded bg-white pad-h-1/4x">veniam, quis nostrud</div>
    <div class="rounded bg-white pad-h-1/4x">exercitation</div>
    <div class="rounded bg-white pad-h-1/4x">ullamco laboris nisi ut aliquip ex ea</div>
    <div class="rounded bg-white pad-h-1/4x">1</div>
    <div class="rounded bg-white pad-h-1/4x">commodo consequat.</div>
    <div class="rounded bg-white pad-h-1/4x">Duis aute irure dolor</div>
</auto-grid>

Options
----
columnWidth:
    description: width of each column
    default: minmax(max-content, 1fr)

method:
    description: defines how to remove columnWidths to make columns fit
    default: pop
    options: pop, shift
*/

import KompElement from './element.js';
export default class AutoGrid extends KompElement {
    
    static observer = new ResizeObserver(entries => {
        entries.forEach(entry => entry.target.resize())
    })
    
    static assignableAttributes = {
        columnWidth: 'max-content',
        method: 'pop',
    }
    
    static assignableMethods = ['initialTemplate']
    
    connected () {
        this.enable()
    }
    
    disconnected () {
        this.disable()
    }
    
    cells (container) {
        return Array.from(container.children).map(child => {
            if (["grid", "inline-grid"].includes(getComputedStyle(child).display)) {
                return this.cells(child)
            } else if (child.dataset.autoGridIgnore) {
                return null
            } else {
                return child
            }
        }).flat().filter(x => x !== null)
    }
    
    disable () {
        this.constructor.observer.unobserve(this)
    }
    
    enable () {
        this.constructor.observer.observe(this)
    }
    
    initialTemplate (cells) {
        return cells.map(c => this.columnWidth).join(" ")
    }
    
    resize () {
        const style = getComputedStyle(this)
        const cells = this.cells(this)
        let template = this.initialTemplate(cells).split(/(?<!\,)\s+/)
        let isOverflow;
        do {
            this.style.setProperty('grid-template-columns', template.join(" "))
            isOverflow = cells.some(el => el.offsetLeft < (this.offsetLeft - parseFloat(style.paddingLeft)))
            isOverflow = isOverflow || cells.some(el => el.offsetLeft + el.offsetWidth > (this.offsetLeft + this.offsetWidth - parseFloat(style.paddingRight)))
            template[this.method]()
        } while (template.length >= 1 && isOverflow)
    }
    
    static style = `
        auto-grid {
            display: grid;
            grid-template-columns: auto;
        }
    `
}

window.customElements.define('auto-grid', AutoGrid)