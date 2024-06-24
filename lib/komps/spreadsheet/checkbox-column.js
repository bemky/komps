import Column from './column';
import { createElement, trigger } from 'dolla';

export default class CheckboxColumn extends Column {
    
    static type = 'checkbox'
    
    async input (record, cell) {
        record = await this.resolveRecord(record)
        const input = cell.querySelector('input')
        input.checked = !input.checked
        trigger(input, 'change')
    }
    
    async render (record) {
        record = await this.resolveRecord(record)
        return createElement('label', {
            content: Input.create(this.type, {
                record: record,
                attribute: this.attribute,
                name: this.attribute
            })
        })
    }
    
    async paste (record, value) {
        record = await this.resolveRecord(record)
        record[this.attribute] = !!value
    }
}