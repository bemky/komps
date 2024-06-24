import Column from './column';

export default class NumberColumn extends Column {
    
    static type = 'number'
    
    async paste (record, value) {
        record = await this.resolveRecord(record)
        value = parseFloat(value)
        if (!isNaN(value)) {
            record[this.attribute] = value
        }
    }
}