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
                            splitBy: r => r.bats || [{}]
                        }, {
                            attribute: 'POS',
                            type: 'select',
                            options: [
                                'C', '1B', '2B', '3B', 'SS', 'LF', 'RF', 'CF', 'P',
                            ]
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
import { isFunction } from '../../../support.js';

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
        this.expandedCell = null
        this.expandedCells = new Set()
    }
    
    this.Row.prototype.resetExpand = function () {
        this.style.removeProperty('--expandTo')
        this.expandedCell = Array.from(this.expandedCells.values()).sort((a, b) => b.scrollHeight - a.scrollHeight)[0]
        if (this.expandedCell) {
            this.expandedCell.style.setProperty('max-height', 'unset')
            this.style.setProperty('--expandTo', this.expandedCell.scrollHeight + "px")
            this.expandedCell.style.removeProperty('max-height')
        }
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
    
    this.Row.prototype.resize = function () {
        const wasCollapsed = this.hasAttribute('collapsed')
        const nowCollapsed = this.toggleAttribute('collapsed', this.scrollHeight > this.clientHeight)
        this.querySelectorAll('komp-table-cell-toggle').forEach(el => el.remove())
        this.querySelectorAll('[collapse-toggle]').forEach(el => el.removeAttribute('collapse-toggle'))
        if (nowCollapsed) {
            const overflowingCells = this.cells.filter(c => c.scrollHeight > this.clientHeight)
            overflowingCells.forEach(cell => this.renderCellToggle(cell))
        }
        if (this.expandedCell) {
            this.renderCellToggle(this.expandedCell, false)
        }
    }
    
    this.Row.prototype.renderCellToggle = function (cell, expand=true) {
        cell.setAttribute('collapse-toggle', expand ? "expand" : "collapse")
        this.prepend(createElement('komp-table-cell-toggle', {
            class: Array.from(cell.classList.values().filter(x => x.includes("frozen"))).join(" "),
            style: {
                'grid-column': cell.cellIndex,
            },
            content: listenerElement({
                type: 'button',
                content: expand ? 'Expand' : 'Collapse'
            }, e => {
                this.expandedCells[expand ? 'add' : 'delete'](cell)
                this.resetExpand()
            })
        }))
    }
    
    
    if (!Array.isArray(this.style)) {
        this.style = [this.style]
    }
    this.style.push(() => `
        ${this.tagName} {
            --collapseTo: auto;
        }
        komp-table-row,
        komp-table-cell-toggle,
        komp-table-row > ${this.tagName}-cell {
            max-height: var(--expandTo, var(--collapseTo));
        }
        ${this.tagName}-cell.splitCell[collapse-toggle],
        ${this.tagName}-cell[collapse-toggle] {
            padding-bottom: 1.5em;
        }
        komp-table-row,
        komp-table-cell-toggle {
            overflow: clip;
        }
        komp-table-cell-toggle {
            display: flex;
            flex-direction: column;
            justify-content: end;
            text-align: center;
            z-index: 2;
            grid-row: 1 / -1;
        }
        komp-table-cell-toggle.frozen { z-index: 101}
        komp-table-cell-toggle button {
            outline: none;
            appearance: none;
            border: none;
            padding: 0;
            margin: 0;
            text-decoration: none;
            color: inherit;
            
            background: linear-gradient(rgba(255,255,255, 0), rgba(255,255,255, 0.7) 30%, white);
            cursor: pointer;
            text-transform: uppercase;
            padding-top: 0.5em;
            font-size: 0.8em;
        }
        ${this.tagName}-cell:focus komp-table-cell-toggle,
        ${this.tagName}-cell:hover komp-table-cell-toggle {
            color: var(--select-color);
        }
    `)
}