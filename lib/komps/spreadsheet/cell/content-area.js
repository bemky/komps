import SpreadsheetCell from '../cell.js';
import Input from '../../input.js';

export default class ContentAreaCell extends SpreadsheetCell {
    
    render () {
        const value = this.value()
        return value ? value.replaceAll("\n", "<br>") : value
    }
    
    input () {
        return new Input({
            type: 'contentarea',
            record: this.record,
            attribute: this.attribute
        })
    }
}