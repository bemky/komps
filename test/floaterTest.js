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

    describe('show', function () {
        it('forwards the source event to the show and shown events', async function () {
            const anchor = createElement('button', { content: 'Open' });
            document.body.append(anchor);

            const floater = new Floater({ anchor, content: 'hi' });
            const seen = {};
            floater.addEventListener('show', e => seen.show = e.detail);
            floater.addEventListener('shown', e => seen.shown = e.detail);

            const event = new window.MouseEvent('click');
            floater.show({ detail: { sourceEvent: event } });
            await wait();

            assert.equal(seen.show?.sourceEvent, event);
            assert.equal(seen.shown?.sourceEvent, event);

            anchor.remove();
        });

        it('keeps eventOptions intact when re-showing during a pending removal', async function () {
            const anchor = createElement('button', { content: 'Open' });
            document.body.append(anchor);

            const floater = new Floater({ anchor, content: 'hi' });
            floater.show();
            await wait();

            // Start hiding, then ask to show again while the removal is still
            // pending. show() used to queue `.then(this.show)`, which handed
            // the promise's resolved value (the element) to trigger() as the
            // CustomEvent init dict.
            floater.hide();
            await wait();
            assert.ok(floater._removing, 'removal should be pending');

            let detail;
            floater.addEventListener('show', e => detail = e.detail);

            const event = new window.MouseEvent('click');
            const reshown = floater.show({ detail: { sourceEvent: event } });

            // Settle the exit animation so the queued show runs.
            floater.dispatchEvent(new window.Event('animationend'));
            await reshown;
            await wait();

            assert.equal(detail?.sourceEvent, event);

            anchor.remove();
        });
    });
});
