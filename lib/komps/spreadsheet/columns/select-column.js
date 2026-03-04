import Input from '../../input.js';
import Column from '../column';

/**
 * A {@link SpreadsheetColumn} that renders a select dropdown input.
 *
 * @class SelectColumn
 * @extends SpreadsheetColumn
 */
export default class SelectColumn extends Column {

    static inputAttributes = ['options']
    
    static assignableAttributes = {
        type: 'select'
    }
    
    constructor (options) {
        super(options)
        this.options = options.options
    }
    
    async input (record) {
        return Input.create(this.type, Object.assign({
            record: record,
            attribute: this.attribute,
            options: this.options,
            autofocus: true
        }, this.inputOptions))
    }
}