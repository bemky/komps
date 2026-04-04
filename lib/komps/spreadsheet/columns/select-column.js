import Column from '../column.js';
import Select from '../../select.js';

export default class SelectColumn extends Column {

    static inputAttributes = ['options']

    static assignableAttributes = {
        type: { type: 'string', default: 'select', null: false }
    }

    constructor (options) {
        super(options)
        this.options = options.options
    }

    input (record, cell, options) {
        const select = new Select(Object.assign({
            target: record,
            attribute: this.attribute,
            options: this.options
        }, this.inputOptions, options))
        select.addEventListener('afterConnect', () => {
            select.dropdown.show()
            select.button.focus()
        })
        select.addEventListener('change', () => {
            select.dropdown.hide()
        })
        return select
    }

    onEnter (e) {
        return e.type != 'keydown'
    }
    
    static style = `
        .komp-spreadsheet-input > label > komp-select > button {
            background: none;
            width: auto;
            min-height: 100%;
            min-width: 100%;
            outline: none;
            padding: var(--padding, unset);
            border: none;
        }
    `
}
