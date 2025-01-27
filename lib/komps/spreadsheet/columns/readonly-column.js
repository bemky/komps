import TableColumn from '../column.js';

export default class ReadonlyColumn extends TableColumn {
    paste = undefined;
    
    input (record, cell, options) {
        return false
    }
}