import TableColumn from '../column.js';

export default class ReadonlyColumn extends TableColumn {
    paste = undefined;
    
    renderCell (record, options={}) {
        options.disabled = true;
        return super.renderCell(record, options)
    }
}