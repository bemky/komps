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
            autofocus: true,
            target: record,
            attribute: this.attribute,
            options: this.options
        }, this.inputOptions, options))
        select.addEventListener('connected', () => select.dropdown.show())
        return select
    }

    // Diverges from the default Enter navigation: a dropdown option is chosen
    // via its native Enter->click, and selecting it already closes the floater,
    // so this only wires the close-on-change and Escape-to-cancel behavior.
    cellActivated (cell, floater) {
        const select = floater.querySelector('komp-select')
        select.addEventListener('change', () => {
            select.dropdown.hide()
            floater.hide()
            cell.focus()
        })
        floater.addEventListener('keyup', e => {
            if (e.key == "Escape") {
                floater.setAttribute('preventChange', true)
                cell.focus()
                e.preventDefault()
            }
        })
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
