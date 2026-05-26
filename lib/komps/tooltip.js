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

import Floater from './floater.js';
import { generateRefId, extractDatasetOptions } from '../support.js';

const TOOLTIP_PREFIX = 'tooltip';
const ACTIVE_KEY = Symbol('kompTooltip');

export default class Tooltip extends Floater {
    static tagName = 'komp-tooltip'
    static { this.define() }

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

    remove () {
        if (this.anchor instanceof HTMLElement) {
            this.anchor.removeAttribute('aria-describedby');
        }
        return super.remove()
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
     * @param {HTMLElement} container - element to delegate from
     * @param {Object} [defaults={}] - default options merged into each tooltip
     * @returns {function} cleanup function that removes the delegation listeners
     */
    static delegate (container, defaults = {}) {
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

            const options = {
                container,
                ...defaults,
                ...extractDatasetOptions(el, TOOLTIP_PREFIX),
                anchor: el,
                scope: 'tooltip',
                content
            };

            const tooltip = new Tooltip(options);

            const hide = () => tooltip.hide();
            const keepOpen = () => tooltip.show();
            const onKeydown = (ev) => {
                if (ev.key === 'Escape' && tooltip.showing) {
                    ev.preventDefault();
                    tooltip.hide();
                }
            };

            el.addEventListener('mouseleave', hide);
            el.addEventListener('blur', hide);
            el.addEventListener('keydown', onKeydown);
            tooltip.addEventListener('mouseenter', keepOpen);
            tooltip.addEventListener('mouseleave', hide);

            tooltip.addEventListener('disconnected', () => {
                tooltip.removeEventListener('mouseenter', keepOpen);
                tooltip.removeEventListener('mouseleave', hide);
                el.removeEventListener('mouseleave', hide);
                el.removeEventListener('blur', hide);
                el.removeEventListener('keydown', onKeydown);
            }, { once: true });

            tooltip.show();
        };

        container.addEventListener('mouseover', handleEnter);
        container.addEventListener('focusin', handleEnter);

        return () => {
            container.removeEventListener('mouseover', handleEnter);
            container.removeEventListener('focusin', handleEnter);
        };
    }

}
