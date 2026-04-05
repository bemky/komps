/**
 * Starts with max number of columns given content, and reduces column count until no cells overflow
 *
 * @class AutoGrid
 * @extends KompElement
 *
 * @param {Object} [options={}]
 * @param {string} [options.columnWidth="max-content"] - width of each column
 * @param {string} [options.method="pop"] - defines how to remove columnWidths to make columns fit (`pop` or `shift`)
 *
 * @example <caption>HTML</caption>
 * <auto-grid>
 *     <div>1</div>
 *     <div>2</div>
 *     <div>3</div>
 * </auto-grid>
 */

import KompElement from './element.js';
export default class AutoGrid extends KompElement {
    
    static observer = new ResizeObserver(entries => {
        entries.forEach(entry => entry.target.resize())
    })
    
    static assignableAttributes = {
        columnWidth: { type: 'string', default: 'max-content', null: false },
        method: { type: 'string', default: 'pop', null: false },
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

