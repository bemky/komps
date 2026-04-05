import TableRow from './row.js';

export default class TableHeader extends TableRow {
    static tagName = 'komp-table-header'

    connected () {
        super.connected();
        this.setAttribute('role', 'row');
    }

    rowIndexChanged(was, now) {
        this.style.gridRow = now
    }
}
window.customElements.define(TableHeader.tagName, TableHeader);