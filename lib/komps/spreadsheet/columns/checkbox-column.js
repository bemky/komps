import Input from '../../input.js';
import Column from '../column';
import { createElement, trigger } from 'dolla';

export default class CheckboxColumn extends Column {
    
    static assignableAttributes = {
        type: 'checkbox'
    }
    
    input (record, cell) {
        const input = cell.querySelector('input')
        input.checked = !input.checked
        trigger(input, 'change')
    }
    
    render (record) {
        return createElement('label', {
            content: Input.create(this.type, Object.assign({
                record: record,
                attribute: this.attribute,
                name: this.attribute
            }, this.inputOptions))
        })
    }
    
    paste (cell, value) {
        cell.record[this.attribute] = !!value
    }
}