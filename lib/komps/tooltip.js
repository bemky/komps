/**
 * Assign a message to show on hover.
 *
 * @class Tooltip
 * @extends Floater
 *
 * @param {Object} [options={}]
 * @param {number} [options.timeout=300] - ms to wait until hiding after mouseout
 * @param {string} [options.scope="general"] - showing a tooltip will hide all other tooltips of same scope
 *
 * @example <caption>JS — delegate from a container</caption>
 * Tooltip.delegate(document.body, { placement: 'top' })
 *
 * @example <caption>HTML — markup picked up by delegate</caption>
 * <button data-tooltip="Save your work" data-tooltip-placement="bottom">Save</button>
 *
 * @example <caption>JS — single anchor (manual)</caption>
 * new Tooltip({
 *     anchor: document.querySelector('#hi-button'),
 *     content: "Hello World"
 * }).show()
 */

import { content as setContent } from 'dolla';

import Floater from './floater.js';
import { generateRefId, extractDatasetOptions } from '../support.js';

const TOOLTIP_PREFIX = 'tooltip';
const ACTIVE_KEY = Symbol('kompTooltip');

export default class Tooltip extends Floater {
    static tagName = 'komp-tooltip'

    static assignableAttributes = {
        autoPlacement: { type: 'boolean', default: false, null: false },
        flip: { type: 'boolean', default: true, null: false },
        shift: { type: 'boolean', default: true, null: false },
        strategy: { type: 'string', default: 'absolute', null: false },
        placement: { type: 'string', default: 'top', null: false },
        arrow: { type: 'boolean', default: true, null: false },
        timeout: { type: 'number', default: 300, null: false },
        scope: { type: 'string', default: 'general', null: false }
    }

    connected () {
        super.connected();
        this.setAttribute('role', 'tooltip');
        if (!this.id) {
            this.id = generateRefId('komp-tooltip');
        }
        if (this.anchor instanceof HTMLElement) {
            this.anchor.setAttribute('aria-describedby', this.id);
        }
    }

    remove (...args) {
        if (this.anchor instanceof HTMLElement) {
            this.anchor.removeAttribute('aria-describedby');
        }
        return super.remove(...args)
    }

    anchorChanged (was, now) {
        super.anchorChanged(was, now);
        if (was instanceof HTMLElement) {
            was.removeAttribute('aria-describedby');
        }
        if (this.isConnected && this.id && now instanceof HTMLElement) {
            now.setAttribute('aria-describedby', this.id);
        }
    }

    /**
     * Point this tooltip at a different anchor and content, reusing the element
     * — and with it the injected styles, the arrow locator and the floating-ui
     * middleware built in `initialize()` — instead of building a new one. A
     * showing tooltip moves to the new anchor in place; it doesn't animate out
     * and back in, and no hide/show events fire, since this is a re-target
     * rather than a dismissal.
     *
     * Options that are only read while the element initializes (`arrow`,
     * `flip`, `shift`, `autoPlacement`, `timeout`…) keep their original values;
     * re-anchor only between anchors that want the same ones.
     *
     * @param {HTMLElement} anchor - element to anchor to
     * @param {string|HTMLElement} content - content to render
     * @returns {Tooltip} this
     */
    reanchor (anchor, content) {
        this.anchor = anchor;

        const arrow = this.querySelector('komp-floater-arrow-locator');
        setContent(this, content);
        if (arrow) this.prepend(arrow);

        return this;
    }

    /**
     * Delegate tooltip behavior from a container element. A single set of
     * listeners is attached to `container`; any descendant with a
     * `data-tooltip` attribute (or `title`, which is stripped to suppress
     * the browser's native tooltip) will show a Tooltip on mouseover/focus.
     *
     * Per-element options are read from `data-tooltip-*` attributes
     * (e.g. `data-tooltip-placement="bottom"`).
     *
     * One Tooltip instance is created and then re-anchored from element to
     * element (see {@link Tooltip#reanchor}), so hovering across a large
     * container doesn't churn out a custom element, an arrow and a fresh set
     * of floating-ui middleware per anchor. Elements carrying different
     * `data-tooltip-*` options get their own instance, since those options are
     * baked in when the element initializes.
     *
     * @param {HTMLElement} container - element to delegate from
     * @param {Object} [defaults={}] - default options merged into each tooltip
     * @returns {function} cleanup function that removes the delegation listeners
     */
    static delegate (container, defaults = {}) {
        let tooltip = null;
        let signature = null;
        let anchor = null;
        let destroyed = false;

        const hide = (ev) => tooltip?.hide({detail: {sourceEvent: ev}});
        const onKeydown = (ev) => {
            if (ev.key === 'Escape' && tooltip?.showing) {
                ev.preventDefault();
                tooltip.hide({detail: {sourceEvent: ev}});
            }
        };

        const detach = () => {
            if (!anchor) return;
            anchor.removeEventListener('mouseleave', hide);
            anchor.removeEventListener('blur', hide);
            anchor.removeEventListener('keydown', onKeydown);
            anchor = null;
        };

        const attach = (el) => {
            detach();
            anchor = el;
            el.addEventListener('mouseleave', hide);
            el.addEventListener('blur', hide);
            el.addEventListener('keydown', onKeydown);
        };

        const build = (options) => {
            const instance = new Tooltip(options);
            instance.addEventListener('mouseenter', (ev) => instance.show({detail: {sourceEvent: ev}}));
            instance.addEventListener('mouseleave', (ev) => instance.hide({detail: {sourceEvent: ev}}));
            instance.addEventListener('hidden', () => { if (tooltip === instance) detach() });
            return instance;
        };

        const handleEnter = (e) => {
            const el = e.target.closest && e.target.closest('[data-tooltip], [title]');
            if (!el || !container.contains(el)) return;
            if (el == Floater.activeFloater('tooltip')?.anchor) return;

            let content = el.getAttribute('data-tooltip');
            if (!content && el.hasAttribute('title')) {
                content = el.getAttribute('title');
                el.removeAttribute('title');
            }
            if (!content) return;

            const datasetOptions = extractDatasetOptions(el, TOOLTIP_PREFIX);
            const elSignature = JSON.stringify(Object.entries(datasetOptions).sort());

            const showOn = (instance) => {
                tooltip = instance;
                attach(el);
                instance.show({detail: {sourceEvent: e}});
            };

            if (tooltip && signature === elSignature) {
                const instance = tooltip;
                const removing = instance._removing;
                if (removing) {
                    // Mid fade-out — let it settle so its own bookkeeping
                    // (showing, activeFloaters) lands before re-anchoring.
                    removing.then(() => {
                        if (destroyed || tooltip !== instance) return;
                        showOn(instance.reanchor(el, content));
                    });
                } else {
                    showOn(instance.reanchor(el, content));
                }
                return;
            }

            detach();
            signature = elSignature;
            showOn(build({
                container,
                ...defaults,
                ...datasetOptions,
                anchor: el,
                scope: 'tooltip',
                content
            }));
        };

        container.addEventListener('mouseover', handleEnter);
        container.addEventListener('focusin', handleEnter);

        return () => {
            destroyed = true;
            container.removeEventListener('mouseover', handleEnter);
            container.removeEventListener('focusin', handleEnter);
            detach();
            tooltip?.hideNow();
            tooltip = null;
            signature = null;
        };
    }

    static { this.define() }
}
