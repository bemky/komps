import Floater from '../lib/komps/floater.js';
import { createElement } from 'dolla';
import * as assert from 'assert';

function wait(ms = 10) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function escape() {
    return new window.KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true
    });
}

// Floater.remove() waits for an animationend when animation-name isn't "none".
// jsdom's getComputedStyle returns "" rather than "none", so removal never
// settles here — these assert on the hide/remove events instead of the DOM.
async function openFloater() {
    const anchor = createElement('button', { content: 'Open' });
    document.body.append(anchor);

    const floater = new Floater({ anchor, removeOnBlur: true, content: 'hi' });
    floater.show();
    await wait();
    return { anchor, floater };
}

describe('Floater', function () {

    describe('Escape handling', function () {
        it('forwards the source event to the hide event and starts removing', async function () {
            const { anchor, floater } = await openFloater();

            let detail;
            floater.addEventListener('hide', e => detail = e.detail);

            const event = escape();
            document.body.dispatchEvent(event);
            await wait();

            assert.equal(detail?.sourceEvent, event);
            // remove() has begun its exit animation (it settles on animationend)
            assert.ok(floater.classList.contains('-out'));

            anchor.remove();
        });

        it('does not hide while hold-open is set', async function () {
            const { anchor, floater } = await openFloater();

            let hides = 0;
            floater.addEventListener('hide', () => hides++);

            floater.holdOpen();
            document.body.dispatchEvent(escape());
            await wait();
            assert.equal(hides, 0);

            floater.releaseHoldOpen();
            document.body.dispatchEvent(escape());
            await wait();
            assert.equal(hides, 1);

            anchor.remove();
        });
    });
});
