import TableRow from './row.js';

export default class TableHeader extends TableRow {
    static tagName = 'komp-table-header'
    
    rowIndexChanged(was, now) {
        this.style.gridRow = now
    }
}
