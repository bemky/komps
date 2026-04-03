import Column from '../column.js';
import { createElement } from 'dolla';
import { result } from '../../support.js';

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
        const currentValue = result(record, this.attribute)
        const buttons = this.options.map(option => {
            const value = Array.isArray(option) ? option[0] : option
            const label = Array.isArray(option) ? option[1] : option
            return createElement('button', {
                type: 'button',
                content: label,
                class: value == currentValue ? '-active' : undefined,
                eventListeners: {
                    click: e => {
                        record[this.attribute] = value
                        const floater = e.target.closest('komp-floater')
                        if (floater) floater.hide()
                        cell.focusAdjacentCell('down')
                    }
                }
            })
        })
        return createElement('div', {
            class: 'komp-select-options',
            content: buttons
        })
    }

    inputOffset () {
        return { mainAxis: 0 }
    }

    onEnter () {
        return false
    }
}
