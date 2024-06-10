import Column from './column';

export default class NumberColumn extends Column {
    
    static type = 'number'
    
    paste (record, value) {
        value = parseFloat(value)
        if (!isNaN(value)) {
            record[this.attribute] = value
        }
    }
}