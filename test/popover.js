import {Popover} from 'komps';
import * as assert from 'assert';

describe('popover', function () {
    it('shows content', function () {
        const popover = new Popover({
            content: 'Hello World'
        })
        
        assert.equal(popover.outerHTML, `<komp-popover>Hello World</komp-popover>`)
    })
})