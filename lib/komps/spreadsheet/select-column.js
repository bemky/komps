import Input from '../input.js';
import Column from './column';

export default class SelectColumn extends Column {
    
    static type = 'select'
    
    constructor (options) {
        super(options)
        this.options = options.options
    }
    
    input (record) {
        return Input.create(this.type, {
            record: record,
            attribute: this.attribute,
            options: this.options
        })
    }
}