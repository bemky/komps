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
 *
 * @example <caption>JS — suppress a delegated tooltip</caption>
 * button.addEventListener('tooltip', e => {
 *     if (button.disabled) e.preventDefault()
 * })
 */

/**
 * Fired on the target element by {@link Tooltip.delegate} before a delegated
 * tooltip is built or re-anchored. Bubbles and is cancellable — calling
 * `preventDefault()` suppresses the tooltip for that interaction, so a target
 * (or any ancestor) can opt out without giving up its `data-tooltip` markup.
 * A cancelled target also keeps its `title` attribute, leaving the browser's
 * native tooltip in place.
 *
 * `event.detail` carries the resolved `content`, the `data-tooltip-*`
 * `options`, and the `sourceEvent` (the mouseover/focusin) behind it.
 *
 * @event Tooltip#tooltip
 */

import { trigger } from 'dolla';

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
     * Delegate tooltip behavior from a container element. A single set of
     * listeners is attached to `container`; any descendant with a
     * `data-tooltip` attribute (or `title`, which is stripped to suppress
     * the browser's native tooltip) will show a Tooltip on mouseover/focus.
     *
     * Per-element options are read from `data-tooltip-*` attributes
     * (e.g. `data-tooltip-placement="bottom"`).
     *
     * Before anything is rendered, a cancellable {@link Tooltip#event:tooltip}
     * event is fired on the target; cancelling it suppresses the tooltip.
     *
     * One Tooltip instance is created and then re-pointed from element to
     * element — reassigning `anchor` and calling {@link Floater#setContent} —
     * so hovering across a large container doesn't churn out a custom element,
     * an arrow and a fresh set of floating-ui middleware per anchor. A showing
     * tooltip moves in place: no exit/enter animation, and no hide/show events,
     * since a re-target isn't a dismissal.
     *
     * Elements carrying different `data-tooltip-*` options get their own
     * instance, since options like `arrow`, `flip` and `timeout` are only read
     * while the element initializes.
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

            const fromTitle = !el.getAttribute('data-tooltip') && el.hasAttribute('title');
            const content = fromTitle ? el.getAttribute('title') : el.getAttribute('data-tooltip');
            if (!content) return;

            const datasetOptions = extractDatasetOptions(el, TOOLTIP_PREFIX);

            // Cancellable — a target (or any ancestor, it bubbles) can call
            // preventDefault() to suppress its tooltip for this interaction.
            if (!trigger(el, 'tooltip', {detail: {content, options: datasetOptions, sourceEvent: e}})) return;

            if (fromTitle) {
                el.removeAttribute('title');
            }

            const elSignature = JSON.stringify(Object.entries(datasetOptions).sort());

            const showOn = (instance) => {
                tooltip = instance;
                attach(el);
                instance.show({detail: {sourceEvent: e}});
            };

            // A showing tooltip follows its anchor, so re-pointing it is enough
            // — no teardown, no exit/enter animation.
            const reanchor = (instance) => {
                instance.anchor = el;
                instance.setContent(content);
                showOn(instance);
            };

            if (tooltip && signature === elSignature) {
                const instance = tooltip;
                const removing = instance._removing;
                if (removing) {
                    // Mid fade-out — let it settle so its own bookkeeping
                    // (showing, activeFloaters) lands before re-anchoring.
                    removing.then(() => {
                        if (destroyed || tooltip !== instance) return;
                        reanchor(instance);
                    });
                } else {
                    reanchor(instance);
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
