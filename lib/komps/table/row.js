import KompElement from '../element.js';

export default class TableRow extends KompElement {
    static tagName = 'komp-table-row'
    
    static assignableAttributes = [
        'rowIndex', 'table'
    ];
    
    #rowCount = 0;
    
    get cells () { return Array.from(this.querySelectorAll(this.table.cellSelector)) }
    get rowCount () { return this.#rowCount }
    set rowCount (v) {
        this.style.gridTemplateRows = `repeat(${v}, auto)`
        this.#rowCount = v
    }
    
    rowIndexChanged(was, now) {
        this.style.gridRow = now
    }
    
    appendCell(...cells) {
        if (this.rowCount < cells.length) {
            this.rowCount = cells.length
        }
        this.append(...cells)
    }
}
window.customElements.define(TableRow.tagName, TableRow);