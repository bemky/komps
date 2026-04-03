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

    input (record, cell) {
        const select = new Select({
            target: record,
            attribute: this.attribute,
            options: this.options
        })
        select.addEventListener('change', () => {
            const floater = select.closest('komp-floater')
            if (floater) floater.hide()
            cell.focusAdjacentCell('down')
        })
        return select
    }

    inputOffset () {
        return { mainAxis: 0 }
    }

    onEnter () {
        return false
    }
}
