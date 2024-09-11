import Column from './column';

export default class NumberColumn extends Column {

    static assignableAttributes = {
        type: 'number'
    }
    
    async paste (record, value) {
        value = parseFloat(value)
        if (!isNaN(value)) {
            record[this.attribute] = value
        }
    }
}