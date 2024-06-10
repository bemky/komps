import Column from './column';
import { createElement, trigger } from 'dolla';

export default class CheckboxColumn extends Column {
    
    static type = 'checkbox'
    
    input (record, cell) {
        const input = cell.querySelector('input')
        input.checked = !input.checked
        trigger(input, 'change')
    }
    
    render (record) {
        return createElement('label', {
            content: Input.create(this.type, {
                record: record,
                attribute: this.attribute,
                name: this.attribute
            })
        })
    }
    
    paste (record, value) {
        record[this.attribute] = !!value
    }
}