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
<<<<<<< HEAD
    
    async input (record, cell) {
        const input = await Input.create(this.type, Object.assign({
            target: record,
            attribute: this.attribute,
            options: this.options,
            autofocus: true
        }, this.inputOptions))

        const select = input.input
        let direction = 'down'

        select.addEventListener('keydown', e => {
            if (e.key === 'Tab') {
                direction = e.shiftKey ? 'left' : 'right'
            } else if (e.key === 'Enter') {
                direction = 'down'
            }
        })

        select.addEventListener('change', () => {
            const floater = select.closest('komp-floater')
            if (floater) floater.hide()
            cell.focusAdjacentCell(direction)
        })

        return input
    }

    onEnter () {
        return false
=======

    input (record, cell) {
        const select = new Select({
            target: record,
            attribute: this.attribute,
            options: this.options
        })
        select.addEventListener('afterConnect', () => {
            select.dropdown.show()
            select.button.focus()
        })
        select.addEventListener('change', () => {
            select.dropdown.hide()
        })
        return select
>>>>>>> main
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
