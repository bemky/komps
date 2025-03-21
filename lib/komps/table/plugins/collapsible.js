/*

Description
----
A plugin to make [Table's](/table) rows collapsible

Syntax
----
```javascript
import { collapsible } from 'komps/plugins'
Table.include(collapsible)
new Table({
    collapseTo: "50px"
    data: [...],
    columns: [...]
})
```

Example
----
<div class="flex pad-2x width-100-vw overflow-hidden">
    <div class="spreadsheet-container width-full"></div>
</div>
<script type="application/json" src="/texas-rangers-roster.json" id="texas-rangers-roster"></script>
<script>
    Spreadsheet.include(window.plugins.collapsible)
    document.addEventListener('DOMContentLoaded', () => {
        fetch("/texas-rangers-roster.json").then(response => {
            response.json().then(data => {
                document.querySelector('.spreadsheet-container').append(new Spreadsheet({
                    class: 'height-full width-full',
                    data: data,
                    collapseTo: '100px',
                    columns: [{
                            attribute: 'Name',
                            resize: false,
                            reorder: false,
                            frozen: true
                        }, {
                            attribute: 'TEAM',
                            frozen: true
                        }, {
                            attribute: 'Team MVP',
                            type: 'radio',
                            frozen: true
                        }, {
                            attribute: 'CAPTAIN',
                            type: 'checkbox'
                        }, {
                            header: "Bat Weight",
                            attribute: "weight",
                            splitInto: "bats"
                        }, {
                            header: "Bat Type",
                            attribute: "type",
                            splitInto: "bats"
                        }, {
                            attribute: 'POS',
                            type: 'select',
                            options: [
                                'C', '1B', '2B', '3B', 'SS', 'LF', 'RF', 'CF', 'P',
                            ]
                        }, {
                            header: "Glove BRAND",
                            attribute: "brand",
                            splitInto: "gloves"
                        }, {
                            header: "Glove POS",
                            attribute: "position",
                            splitInto: "gloves"
                        }, {
                            attribute: "BIO",
                            width: "350px"
                        }, {
                            attribute: "CAREER",
                            width: "350px"
                        }
                    ]
                }))
            })
        })
        
    });
</script>

Options
----
collapseTo:
    types: String
    description: Valid CSS Size for height
    default: null

*/

import { listenerElement, createElement } from 'dolla';
import { isFunction, uniq } from '../../../support.js';
import Group from '../group';
import Element from '../../element';

class TableToggle extends Element {
    static tagName = 'komp-table-toggle'
    static assignableAttributes = ['column', 'cellIndex']
    cellIndexChanged (was, now) {
        this.style.gridColumn = now
    }
    connected () {
        this.column.toggles.add(this)
    }
    disconected () {
        this.column.toggles.delete(this)
    }
}
window.customElements.define(TableToggle.tagName, TableToggle);

export default function (proto) {
    this.assignableAttributes.collapseTo = 'auto'

    const _initialize = proto.initialize;
    proto.initialize = function (...args) {
        this.collapseObserver = new ResizeObserver(entries => {
            entries.forEach(entry => entry.target.resize())
        })
        return _initialize.call(this, ...args)
    }
    
    proto.collapseToChanged = function (was, now) {
        this.style.setProperty('--collapseTo', now)
    }
    
    const _remove = proto.remove
    proto.remove = function (...args) {
        proto.collapseObserver.disconnect()
        return _remove.call(this, ...args)
    }
    
    const _rowInitialize = this.Row.prototype.initialize
    this.Row.prototype.initialize = function (...args) {
        _rowInitialize.call(this, ...args)
        this.expandedTarget = null
        this.expandedTargets = new Set()
    }
    
    const _rowConnected = this.Row.prototype.connected
    this.Row.prototype.connected = function (...args) {
        _rowConnected.call(this, ...args)
        this.table.collapseObserver.observe(this)
    }
    
    const _rowDisconnected = this.Row.prototype.disconected
    this.Row.prototype.disconected = function (...args) {
        _rowDisconnected.call(this, ...args)
        this.table.collapseObserver.unobserve(this)
    }

    
    this.Row.prototype.resetExpand = function () {
        this.style.removeProperty('--expandTo')
        this.expandedTarget = Array.from(this.expandedTargets.values()).sort((a, b) => b.scrollHeight - a.scrollHeight)[0]
        if (this.expandedTarget) {
            this.expandedTarget.style.setProperty('max-height', 'unset')
            this.style.setProperty('--expandTo', this.expandedTarget.scrollHeight + "px")
            this.expandedTarget.style.removeProperty('max-height')
        }
    }
    
    this.Row.prototype.resize = function () {
        const wasCollapsed = this.hasAttribute('collapsed')
        const nowCollapsed = this.toggleAttribute('collapsed', this.scrollHeight > this.clientHeight)
        this.querySelectorAll('komp-table-toggle').forEach(el => el.remove())
        this.querySelectorAll('[collapse-toggle]').forEach(el => el.removeAttribute('collapse-toggle'))
        if (nowCollapsed) {
            const targets = this.cells.concat(Array.from(this.querySelectorAll(Group.tagName)))
            const overflowingTargets = targets.filter(c => c.scrollHeight > this.clientHeight)
            overflowingTargets.forEach(target => {
                this.renderTargetToggles(target)
            })
        }
        if (this.expandedTarget) {
            this.renderTargetToggles(this.expandedTarget, false)
        }
    }
    
    this.Row.prototype.renderTargetToggles = function (target, expanded) {
        if (target instanceof Group) {
            uniq(target.cells.map(c => c.column)).forEach(column => {
                this.renderToggle(column, target, expanded)
            })
        } else {
            this.renderToggle(target.column, target, expanded)
        }
    }
    
    this.Row.prototype.renderToggle = function (column, target, expand=true) {
        target.setAttribute('collapse-toggle', expand ? "expand" : "collapse")
        this.prepend(new TableToggle({
            class: target.classList.contains('frozen') ? ' frozen' : '',
            column: column,
            cellIndex: column.index,
            content: listenerElement({
                type: 'button',
                content: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${expand ? 'expand' : 'collapse'}"><polyline points="1 1 7 7 13 1"></polyline></svg>`
            }, e => {
                if (expand) {
                    this.expandedTargets.add(target)
                } else {
                    this.expandedTargets.clear()
                }
                this.resetExpand()
            })
        }))
    }
    
    const _indexChanged = this.columnTypeRegistry.default.prototype.indexChanged
    this.columnTypeRegistry.default.prototype.indexChanged = function (was, now) {
        _indexChanged.call(this, was, now)
        if (this.toggles) this.toggles.forEach(t => t.cellIndex = now)
    }
    
    
    if (!Array.isArray(this.style)) {
        this.style = [this.style]
    }
    this.style.push(() => `
        ${this.tagName} {
            --collapseTo: auto;
        }
        komp-table-row,
        komp-table-toggle,
        komp-table-group,
        komp-table-row > komp-table-cell,
        komp-table-row > komp-spreadsheet-cell {
            max-height: var(--expandTo, var(--collapseTo));
        }
        komp-table-group[collapse-toggle],
        komp-table-cell[collapse-toggle],
        komp-spreadsheet-cell[collapse-toggle] {
            padding-bottom: 16px;
        }
        komp-table-row {
            overflow: clip;
        }
        komp-table-toggle {
            display: flex;
            flex-direction: column;
            justify-content: end;
            text-align: center;
            z-index: 2;
            grid-row: 1 / -1;
            pointer-events: none;
        }
        komp-table-toggle:hover {
            color: var(--select-color);
        }
        komp-table-toggle:hover svg {
            opacity: 1;
        }
        komp-table-toggle.frozen { z-index: 101}
        komp-table-toggle button {
            outline: none;
            appearance: none;
            border: none;
            padding: 0;
            margin: 0;
            text-decoration: none;
            color: inherit;
            pointer-events: auto;
            
            background: linear-gradient(rgba(255,255,255, 0), rgba(255,255,255, 0.7) 30%, white);
            cursor: pointer;
            font-size: 0.8em;
            
            padding: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        komp-table-toggle svg {
            display: inline-block;
            opacity: 0.5;
        }
        komp-table-toggle svg.collapse {
            transform: rotate(180deg)
        }
    `)
}