import Tooltip from '../lib/komps/tooltip.js';
import { createElement } from 'dolla';
import * as assert from 'assert';

function wait(ms = 10) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function hover(el) {
    el.dispatchEvent(new window.MouseEvent('mouseover', { bubbles: true }));
}

function leave(el) {
    el.dispatchEvent(new window.MouseEvent('mouseleave'));
}

function anchorFor(title, attrs = {}) {
    return createElement('button', { content: title, 'data-tooltip': title, ...attrs });
}

describe('Tooltip', function () {

    describe('delegate', function () {
        let container, cleanup;

        beforeEach(function () {
            container = createElement('div');
            document.body.append(container);
        });

        afterEach(function () {
            cleanup?.();
            container.remove();
        });

        it('reuses one instance across anchors sharing the same options', async function () {
            const [a, b] = ['A', 'B'].map(x => anchorFor(x));
            container.append(a, b);
            cleanup = Tooltip.delegate(container);

            hover(a);
            await wait();
            const first = container.querySelector('komp-tooltip');
            assert.ok(first, 'tooltip should be showing');
            assert.equal(first.anchor, a);

            leave(a);
            hover(b);
            await wait();

            const tooltips = container.querySelectorAll('komp-tooltip');
            assert.equal(tooltips.length, 1, 'should not stack up instances');
            assert.equal(tooltips[0], first, 'should be the same element');
            assert.equal(first.anchor, b);
            assert.ok(first.textContent.includes('B'));
        });

        it('moves aria-describedby to the new anchor', async function () {
            const [a, b] = ['A', 'B'].map(x => anchorFor(x));
            container.append(a, b);
            cleanup = Tooltip.delegate(container);

            hover(a);
            await wait();
            const tooltip = container.querySelector('komp-tooltip');
            assert.equal(a.getAttribute('aria-describedby'), tooltip.id);

            leave(a);
            hover(b);
            await wait();

            assert.equal(a.hasAttribute('aria-describedby'), false);
            assert.equal(b.getAttribute('aria-describedby'), tooltip.id);
        });

        it('keeps the arrow locator through a re-anchor', async function () {
            const [a, b] = ['A', 'B'].map(x => anchorFor(x));
            container.append(a, b);
            cleanup = Tooltip.delegate(container);

            hover(a);
            await wait();
            const tooltip = container.querySelector('komp-tooltip');
            const locator = tooltip.querySelector('komp-floater-arrow-locator');
            assert.ok(locator, 'arrow locator should be rendered');

            leave(a);
            hover(b);
            await wait();

            assert.equal(tooltip.querySelector('komp-floater-arrow-locator'), locator);
        });

        it('builds a separate instance when data-tooltip options differ', async function () {
            const a = anchorFor('A');
            const b = anchorFor('B', { 'data-tooltip-placement': 'bottom' });
            container.append(a, b);
            cleanup = Tooltip.delegate(container);

            hover(a);
            await wait();
            const first = container.querySelector('komp-tooltip');
            assert.equal(first.placement, 'top');

            leave(a);
            hover(b);
            await wait();

            const second = Array.from(container.querySelectorAll('komp-tooltip'))
                .find(x => x !== first);
            assert.ok(second, 'a second instance should be built');
            assert.equal(second.placement, 'bottom');
            assert.equal(second.anchor, b);
        });

        it('drops the anchor listeners when re-anchored', async function () {
            const [a, b] = ['A', 'B'].map(x => anchorFor(x));
            container.append(a, b);
            cleanup = Tooltip.delegate(container);

            hover(a);
            await wait();
            const tooltip = container.querySelector('komp-tooltip');

            leave(a);
            hover(b);
            await wait();

            let hides = 0;
            tooltip.addEventListener('hide', () => hides++);

            // a is no longer the anchor — its mouseleave shouldn't reach the tooltip
            leave(a);
            await wait(tooltip.timeout + 10);
            assert.equal(hides, 0);

            leave(b);
            await wait(tooltip.timeout + 10);
            assert.equal(hides, 1);
        });

        it('fires a cancellable tooltip event on the target', async function () {
            const a = anchorFor('A');
            container.append(a);
            cleanup = Tooltip.delegate(container);

            let detail;
            a.addEventListener('tooltip', e => {
                detail = e.detail;
                e.preventDefault();
            });

            hover(a);
            await wait();

            assert.equal(detail?.content, 'A');
            assert.equal(detail?.sourceEvent?.type, 'mouseover');
            assert.deepEqual(detail?.options, {});
            assert.equal(container.querySelector('komp-tooltip'), null, 'should not render');
        });

        it('lets an ancestor cancel tooltips for its subtree', async function () {
            const a = anchorFor('A');
            container.append(a);
            cleanup = Tooltip.delegate(container);

            container.addEventListener('tooltip', e => e.preventDefault());

            hover(a);
            await wait();

            assert.equal(container.querySelector('komp-tooltip'), null);
        });

        it('leaves title in place when cancelled, strips it when not', async function () {
            const a = createElement('button', { content: 'A', title: 'A' });
            const b = createElement('button', { content: 'B', title: 'B' });
            container.append(a, b);
            cleanup = Tooltip.delegate(container);

            a.addEventListener('tooltip', e => e.preventDefault());

            hover(a);
            await wait();
            assert.equal(a.getAttribute('title'), 'A', 'native tooltip should survive');

            hover(b);
            await wait();
            assert.equal(b.hasAttribute('title'), false);
            assert.ok(container.querySelector('komp-tooltip').textContent.includes('B'));
        });

        it('keeps showing the existing tooltip when a later target cancels', async function () {
            const [a, b] = ['A', 'B'].map(x => anchorFor(x));
            container.append(a, b);
            cleanup = Tooltip.delegate(container);

            b.addEventListener('tooltip', e => e.preventDefault());

            hover(a);
            await wait();
            const tooltip = container.querySelector('komp-tooltip');
            assert.equal(tooltip.anchor, a);

            hover(b);
            await wait();
            assert.equal(tooltip.anchor, a, 'should not re-anchor to the cancelled target');
        });

        it('stops showing tooltips after cleanup', async function () {
            const a = anchorFor('A');
            container.append(a);
            const stop = Tooltip.delegate(container);
            cleanup = null;

            stop();
            hover(a);
            await wait();

            assert.equal(container.querySelector('komp-tooltip'), null);
        });
    });
});
