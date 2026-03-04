import TableRow from './row.js';

/**
 * The header row for a {@link Table}. Sticky-positioned at the top.
 *
 * @class TableHeader
 * @extends TableRow
 */
export default class TableHeader extends TableRow {
    static tagName = 'komp-table-header'
    
    rowIndexChanged(was, now) {
        this.style.gridRow = now
    }
}
window.customElements.define(TableHeader.tagName, TableHeader);