import KompElement from '../element.js';

export default class TableRow extends KompElement {
    static tagName = 'komp-table-row'
    
    static assignableAttributes = [
        'rowIndex', 'table', 'height'
    ];
    
    #rowCount = 0;
    
    get cells () { return Array.from(this.children) }
    get rowCount () { return this.#rowCount }
    set rowCount (v) {
        this.style.gridTemplateRows = `repeat(${v}, var(--row-size, auto))`
        this.#rowCount = v
    }
    
    rowIndexChanged(was, now) {
        this.style.gridRow = now
    }
    
    heightChanged(v) {
        if (this.parentElement) {
            this.table.setTemplateRows()
        }
    }
}
window.customElements.define(TableRow.tagName, TableRow);