import Column from '../column.js';
import { result } from '../../../support.js';

export default class NumberColumn extends Column {

    static assignableAttributes = {
        type: { type: 'string', default: 'number', null: false }
    }

    render (record) {
        const value = result(record, this.attribute)
        if (value != null && typeof value == 'number') {
            return value.toLocaleString()
        }
        return value
    }

    async paste (cell, value) {
        const v = parseFloat(value)
        if (!isNaN(v)) {
            return super.paste(cell, v)
        }
        return super.paste(cell, value)
    }
}