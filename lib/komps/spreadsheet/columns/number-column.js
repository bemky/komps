import Column from '../column';

export default class NumberColumn extends Column {

    static assignableAttributes = {
        type: 'number'
    }
    
    async paste (cell, value) {
        value = parseFloat(value)
        if (!isNaN(value)) {
            cell.record[this.attribute] = value
        }
    }
}