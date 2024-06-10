import Input from '../input.js';

export default class Column {
    
    type = 'contentarea'
    
    constructor (options) {
        this.attribute = options.attribute
        if (options.type) { this.type = options.type }
    }
    
    header () {
        return this.attribute
    }
    render (record) {
        return record[this.attribute]
    }
    copy (record) {
        return record[this.attribute]
    }
    paste (record, value) {
        record[this.attribute] = value
    }
    input (record) {
        return Input.create(this.type, {
            record: record,
            attribute: this.attribute
        })
    }
}