import Input from '../../input.js';
import Column from '../column.js';

export default class SelectColumn extends Column {

    static inputAttributes = ['options']
    
    static assignableAttributes = {
        type: { type: 'string', default: 'select', null: false }
    }
    
    constructor (options) {
        super(options)
        this.options = options.options
    }
    
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
    }
}