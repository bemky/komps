/*

Description
----
An input with debounced search and results display via floater or inline list. Provide a `search` function that returns results, and optionally a `renderResult` function to customize how each result is displayed.

Syntax
----
```javascript
    new SearchField({
        placeholder: 'Search...',
        search: async (query) => {
            const response = await fetch(`/api/search?q=${query}`);
            return response.json();
        },
        result: (item) => item.name,
        select: (item, query) => console.log(item)
    })
```

HTML
```html
<komp-search-field placeholder="Search..."></komp-search-field>
```

Example
----
<div id="container" class="pad-2x" style="min-height: 350px">
<script>
document.addEventListener('DOMContentLoaded', () => {
    const notificationCenter = new NotificationCenter()
    document.body.append(notificationCenter)
    
    document.querySelector('#container').prepend(new SearchField({
        placeholder: 'Search Open Library...',
        class: 'inline-block',
        search: async (query) => {
            const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5`);
            const data = await response.json();
            return data.docs;
        },
        result: (doc) => {
            const author = doc.author_name ? doc.author_name[0] : 'Unknown';
            const year = doc.first_publish_year || '';
            return `<strong>${doc.title}</strong> <span style="opacity: 0.6">by ${author}${year ? ` (${year})` : ''}</span>`;
        },
        select: (doc) => {
            notificationCenter.add(`Selected: ${doc.title}`, {
                class: 'text-bold bg-blue bg-opacity-80 rounded border-blue-70 border text-white pad-h pad-v-1/2x bottom-0 right-0'
            })
            return true;
        }
    }));
});
</script>
</div>

Options
----
search:
    parameters: [query:String]
    return: Promise<Array>
    description: performs the search and returns results.
select:
    parameters: [result, query]
    return: boolean
    description: what to do with result, return false to prevent default behavior
result:
    parameters: [result]
    return: elements
    description: renders a single result label/content
placeholder:
    types: String
    default: 'Search'
    description: placeholder text for the input
inline:
    types: Boolean
    default: false
    description: if true, renders results inline instead of in a floater
minLength:
    types: Number
    default: 3
    description: minimum query length before searching
debounce:
    types: Number
    default: 300
    description: milliseconds to debounce search input
empty:
    types: String, HTMLElement, Function, false
    default: 'Nothing Found'
    description: content shown when no results found. Set to false to disable.
input:
    types: Function, HTMLInputElement
    default: (attrs) => createElement('input', attrs)
    description: custom input element or function that returns one
floater:
    types: Object
    default: {}
    description: options passed to Floater for the results floater

Assignable Methods
----
renderResult:
    parameters: [result:Any]
    return: String, HTMLElement
    description: renders a single result item as a button
renderResults:
    parameters: [results:Array]
    return: Array
    description: renders the full results list, including empty state

Events
----
select:
    arguments: [result, query, event]
    description: fired when a result is selected
search:
    arguments: [query]
    description: fired when a search is performed
results:
    arguments: [results, query]
    description: fired when results are rendered

*/

import { createElement, append, content, addEventListenerFor, insertAfter, trigger } from 'dolla';
import KompElement from './element.js';
import Floater from './floater.js';
import { debounce, result } from '../support.js';

export default class SearchField extends KompElement {

    static tagName = 'komp-search-field'
    static assignableMethods = ['renderResult', 'renderResults']
    static events = ['select', 'search', 'results']
    
    static assignableAttributes = {
        placeholder: 'Search',
        inline: false,
        minLength: 3,
        debounce: 300,
        empty: 'Nothing Found',
        input: (attrs) => createElement('input', attrs),
        search: (query) => [],
        select: (result, query) => null,
        result: (result) => JSON.stringify(result)
        // floater: {} read direct from options
    }

    query = ''
    results = []
    
    initialize (options={}) {
        super.initialize();
        
        this.input = result(this, 'input', {
            placeholder: this.placeholder
        })
        this.input.addEventListener('keyup', this._keyup.bind(this));
        this.input.addEventListener('keydown', this._keydown.bind(this));
        this.input.addEventListener('focus', this._inputFocus.bind(this));
        
        append(this, this.input);

        this.resultsList = createElement('div', {class: 'komp-search-field-results'});
        addEventListenerFor(this.resultsList, 'button', 'click', this._select.bind(this));
        this.resultsList.addEventListener('keydown', this._keydown.bind(this));
    
        this._search = debounce(this._search.bind(this), this.debounce);
        this._floaterOptions = options.floater
    }
    
    buttonResult (button, e) {
        this.trigger('select', { detail: [button?.result, this.query, e] });
        return button.result
    }
    
    /* ACTIONS */
    async _search (query) {
        if (query.length === 0) return;
        this.trigger('search', { detail: [query] });
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
    
    /* RENDERING */    
    renderResult (result) {
        const button = createElement('button', {
            type: 'button',
            content: this.result(result)
        });
        button.result = result;
        return button
    }

    renderResults (results = []) {
        if (this.query.length >= this.minLength && results.length === 0 && this.empty !== false) {
            return result(this, this.empty, this.query)
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
        .komp-search-field-results button {
            border: none;
            background: none;
            display: block;
            padding: 0;
        }
    `
}

window.customElements.define(SearchField.tagName, SearchField);
