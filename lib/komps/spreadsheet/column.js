import Input from '../input.js';

export default class Column {
    
    type = 'contentarea'
    
    constructor (options) {
        this.initialize(options)
    }
    initialize (options) {
        this.attribute = options.attribute
        if (options.type) { this.type = options.type }
    }
    resolveRecord (record) {
        return record
    }
    header () {
        return this.attribute
    }
    async render (record) {
        record = await this.resolveRecord(record)
        return record[this.attribute]
    }
    async copy (record) {
        record = await this.resolveRecord(record)
        return record[this.attribute]
    }
    async paste (record, value) {
        record = await this.resolveRecord(record)
        record[this.attribute] = value
    }
    async input (record) {
        record = await this.resolveRecord(record)
        return Input.create(this.type, {
            record: record,
            attribute: this.attribute
        })
    }
}