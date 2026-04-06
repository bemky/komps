/**
 * An input with debounced search and results display via floater or inline list.
 * Provide a `search` function that returns results, and optionally a `renderResult`
 * function to customize how each result is displayed.
 *
 * @class SearchField
 * @extends KompElement
 *
 * @param {Object} [options={}]
 * @param {function} [options.search] - performs the search and returns results. Receives `(query:string)`, returns `Promise<Array>`
 * @param {function} [options.select] - what to do with result, return false to prevent default behavior. Receives `(result, query)`
 * @param {function} [options.result] - renders a single result label/content. Receives `(result)`
 * @param {string} [options.placeholder="Search"] - placeholder text for the input
 * @param {boolean} [options.inline=false] - if true, renders results inline instead of in a floater
 * @param {number} [options.minLength=3] - minimum query length before searching
 * @param {number} [options.debounce=300] - milliseconds to debounce search input
 * @param {string|HTMLElement|function|false} [options.empty="Nothing Found"] - content shown when no results found. Set to false to disable.
 * @param {string|HTMLElement|function} [options.loader] - content shown in results list while search is loading. Defaults to an animated SVG spinner.
 * @param {function|HTMLInputElement|Object} [options.input] - custom input element, function that returns one, or options to pass to dolla.createElement
 * @param {Object} [options.floater={}] - options passed to {@link Floater} for the results floater
 *
 * @fires SearchField#select
 * @fires SearchField#search
 * @fires SearchField#results
 *
 * @example <caption>JS</caption>
 * new SearchField({
 *     placeholder: 'Search...',
 *     search: async (query) => {
 *         const response = await fetch(`/api/search?q=${query}`);
 *         return response.json();
 *     },
 *     result: (item) => item.name,
 *     select: (item, query) => console.log(item)
 * })
 *
 * @example <caption>HTML</caption>
 * <komp-search-field placeholder="Search..."></komp-search-field>
 */

/**
 * Fired when a result is selected
 * @event SearchField#select
 * @type {Object}
 * @property {*} result - the selected result
 * @property {string} query - the search query
 * @property {Event} event - the originating event
 */

/**
 * Fired when a search is performed
 * @event SearchField#search
 * @type {string}
 */

/**
 * Fired when results are rendered
 * @event SearchField#results
 * @type {Object}
 * @property {Array} results - the search results
 * @property {string} query - the search query
 */

import { createElement, append, content, addEventListenerFor, insertAfter, trigger } from 'dolla';
import KompElement from './element.js';
import Floater from './floater.js';
import { debounce, result } from '../support.js';

export default class SearchField extends KompElement {

    static tagName = 'komp-search-field'
    static composes = [Floater]
    static { this.define() }
    static assignableMethods = ['renderResult', 'renderResults']
    static events = ['select', 'search', 'results']
    
    static assignableAttributes = {
        placeholder: { type: 'string', default: 'Search', null: false },
        inline: { type: 'boolean', default: false, null: false },
        minLength: { type: 'number', default: 3, null: false },
        debounce: { type: 'number', default: 300, null: false },
        empty: { type: ['string', 'HTMLElement', 'function', 'boolean'], default: '<div class="komp-search-field-empty">Nothing Found</div>', null: false },
        input: { type: ['function', 'HTMLInputElement', 'Object'], default: (attrs) => createElement('input', attrs), null: false },
        loader: { type: ['string', 'HTMLElement', 'function'], default: `<div class="komp-search-field-loading"><svg viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="30" height="7"><circle cx="15" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"/><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"/></circle><circle cx="60" cy="15" r="9" fill-opacity="0.3"><animate attributeName="r" from="9" to="9" begin="0s" dur="0.8s" values="9;15;9" calcMode="linear" repeatCount="indefinite"/><animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite"/></circle><circle cx="105" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"/><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"/></circle></svg></div>`, null: true },
        search: { type: 'function', default: (query) => [], null: false },
        select: { type: 'function', default: (result, query) => null, null: false },
        result: { type: 'function', default: (result) => JSON.stringify(result), null: false }
        // floater: {} read direct from options
    }

    query = ''
    results = []
    
    constructor (options, ...args) {
        super(options, ...args)
        this._floaterOptions = options.floater
    }
    
    initialize (options={}) {
        super.initialize();
        
        if (typeof this.input == 'function') {
            this.input = this.input({placeholder: this.placeholder})
        } else if (!(this.input instanceof HTMLInputElement)) {
            this.input = createElement('input', Object.assign({
                placeholder: this.placeholder
            }, this.input))
        }
        this.input.addEventListener('keyup', this._keyup.bind(this));
        this.input.addEventListener('keydown', this._keydown.bind(this));
        this.input.addEventListener('focus', this._inputFocus.bind(this));
        
        append(this, this.input);

        this.resultsList = createElement('div', {class: 'komp-search-field-results'});
        addEventListenerFor(this.resultsList, 'button', 'click', this._select.bind(this));
        this.resultsList.addEventListener('keydown', this._keydown.bind(this));
    
        this._search = debounce(this._search.bind(this), this.debounce);
    }
    
    buttonResult (button, e) {
        this.trigger('select', { detail: [button?.result, this.query, e] });
        return button.result
    }
    
    /* ACTIONS */
    async _search (query) {
        if (query.length === 0) return;
        this.trigger('search', { detail: [query] });
        if (this.loader) {
            content(this.resultsList, result(this, 'loader', query))
            this.showResults();
        }
        this.results = await this.search(query)
        this.showResults();
        content(this.resultsList, this.renderResults(this.results))
    }
    
    async _select (e, selected) {
        const result = this.buttonResult(selected || e.delegateTarget, e)
        if (result && this.select(result, this.query) != false) {
            e.preventDefault();
            e.stopPropagation();
            this.clearSearch();
            this.clearResults();
            this.input.focus();
        }
    }
    
    /**
     * Render a single result item as a button. Assignable via constructor options.
     * @param {*} result - a single result from the search
     * @returns {HTMLButtonElement}
     */
    renderResult (result) {
        const button = createElement('button', {
            type: 'button',
            content: this.result(result)
        });
        button.result = result;
        return button
    }

    /**
     * Render the full results list, including empty state. Assignable via constructor options.
     * @param {Array} results - array of search results
     * @returns {Array|*} content to render
     */
    renderResults (results = []) {
        if (this.query.length >= this.minLength && results.length === 0 && this.empty !== false) {
            return result(this, 'empty', this.query)
        } else {
            return results.map(this.renderResult, this)
        }
    }

    showResults () {
        if (this.inline) {
            insertAfter(this.input, this.resultsList);
        } else {
            if (!this.floater) {
                this.floater = new Floater(Object.assign({
                    content: this.resultsList,
                    placement: 'bottom-start',
                    autoPlacement: {
                        allowedPlacements: ['bottom-start', 'top-start']
                    },
                    anchor: this,
                    removeOnBlur: true
                }, this._floaterOptions))
                this.floater.show();
            } else {
                this.floater.show();
            }
            this.floater.style.minWidth = this.input.offsetWidth + "px"
        }
    }

    hideResults () {
        if (this.inline) {
            this.resultsList.remove();
        } else if (this.floater) {
            this.floater.hide();
        }
    }

    clearSearch () {
        this.query = '';
        this.input.value = '';
    }
    
    clearResults () {
        this.resultsList.innerHTML = '';
    }
    
    /* EVENTS */
    _keyup (e) {
        const query = this.input.value;

        if (e.key === 'Enter' && query.length >= this.minLength) {
            let target = this.resultsList.querySelector('button:focus, button.focus');
            target = target || this.resultsList.querySelector('button');
            if (target) {
                e.preventDefault();
                return trigger(target, 'click');
            }
        }

        if (query === this.query) return;
        this.query = query;

        if (query.length >= this.minLength) {
            this._search(query);
        } else {
            this.clearResults();
        }
    }

    _keydown (e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            e.stopPropagation();
            const current = this.resultsList.querySelector('button:focus, button.focus');

            if (current) {
                const sibling = e.key === 'ArrowUp' ? 'previousElementSibling' : 'nextElementSibling';
                const target = current[sibling];
                if (target?.tagName === 'BUTTON') {
                    target.focus();
                } else if (e.key === 'ArrowUp') {
                    this.input.focus();
                }
            } else if (e.key === 'ArrowDown') {
                this.resultsList.querySelector('button')?.focus();
            }
        } else if (e.key === 'Enter' && e.target === this.input) {
            e.preventDefault();
        }
    }

    _inputFocus () {
        if (this.query.length >= this.minLength && this.results.length > 0) {
            this.showResults();
        }
    }
    
    static style = `
        komp-search-field {
            display: inline-block;
            position: relative;
        }
        .komp-search-field-results {
            background: white;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        }
        .komp-search-field-results button svg {
            width: 2em;
            height: auto;
            padding: 0.5em;
        }
        .komp-search-field-results button {
            border: none;
            background: none;
            display: block;
            padding: 0;
        }
        .komp-search-field-empty {
            padding: 0.5em;
        }
        .komp-search-field-loading {
            padding: 0.5em;
            display: flex;
            justify-content: center;
        }
    `
}

