import Column from '../column.js';

export default class NumberColumn extends Column {

    static assignableAttributes = {
        type: 'number'
    }
    
    async paste (cell, value) {
        const v = parseFloat(value)
        if (!isNaN(v)) {
            return super.paste(cell, v)
        }
        return super.paste(cell, value)
    }
}