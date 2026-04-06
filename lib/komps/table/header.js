import TableRow from './row.js';

export default class TableHeader extends TableRow {
    static tagName = 'komp-table-header'
    static { this.define() }

    connected () {
        super.connected();
        this.setAttribute('role', 'row');
    }

    rowIndexChanged(was, now) {
        this.style.gridRow = now
    }
}
