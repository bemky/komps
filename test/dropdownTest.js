import Dropdown from '../lib/komps/dropdown.js';
import { createElement, listenerElement } from 'dolla';
import * as assert from 'assert';

function wait(ms = 10) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Dropdown', function () {

    describe('Tab key handling', function () {
        it('does not close when Tab moves focus between fields inside the dropdown', async function () {
            const anchor = listenerElement('button', { content: 'Open' }, 'click', () => {});
            document.body.append(anchor);

            const first = createElement('input');
            const second = createElement('input');

            const dropdown = new Dropdown({
                anchor,
                content: createElement({ content: [first, second] })
            });
            dropdown.show();
            await wait();

            first.focus();
            dropdown.dispatchEvent(new window.KeyboardEvent('keydown', {
                key: 'Tab',
                bubbles: true,
                cancelable: true
            }));
            // Simulate the browser's native Tab focus-move landing on the next
            // field inside the dropdown, which happens before our deferred check.
            second.focus();
            await wait();

            assert.ok(dropdown.parentElement, 'dropdown should still be shown');
            anchor.remove();
            dropdown.remove();
        });

        it('closes and refocuses the anchor when Tab moves focus outside the dropdown', async function () {
            const anchor = listenerElement('button', { content: 'Open' }, 'click', () => {});
            const outside = createElement('button', { content: 'Outside' });
            document.body.append(anchor, outside);

            const only = createElement('input');

            const dropdown = new Dropdown({
                anchor,
                content: createElement({ content: [only] })
            });

            let hideCalled = false;
            dropdown.addEventListener('hide', () => { hideCalled = true });

            dropdown.show();
            await wait();

            only.focus();
            dropdown.dispatchEvent(new window.KeyboardEvent('keydown', {
                key: 'Tab',
                bubbles: true,
                cancelable: true
            }));
            // Simulate focus landing outside the dropdown entirely.
            outside.focus();
            await wait();

            assert.ok(hideCalled, 'dropdown should have started hiding');
            assert.strictEqual(document.activeElement, anchor, 'focus should return to the anchor');
            anchor.remove();
            outside.remove();
            dropdown.remove();
        });
    });
});
