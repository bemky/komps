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

import { listenerElement } from 'dolla';
import { isFunction } from '../../../support.js';

export default function (proto) {
    this.assignableAttributes.collapseTo = 'auto'
    
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
            this.style.setProperty('--expandTo', this.expandedCell.scrollHeight + "px")
            this.expandedCell.showExpandToggle()
        }
    }
    
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
    
    const _renderCell = this.columnTypeRegistry.default.prototype.renderCell
    this.columnTypeRegistry.default.prototype.renderCell = async function (...args) {
        const cell = await _renderCell.call(this, ...args)
        this.table.collapseObserver.observe(cell)
        
        const _render = cell.render
        cell.render = function (...args) {
            _render.call(this, ...args)
            this.resize()
        }
        
        cell.resize = function () {
            const wasCollapsed = this.hasAttribute('collapsed')
            const nowCollapsed = this.toggleAttribute('collapsed', this.scrollHeight > this.clientHeight)
            if (nowCollapsed || this.row.expandedCell == this) {
                this.showExpandToggle()
            } else {
                this.hideExpandToggle()
            }
        }
        
        cell.renderExpandToggle = function () {
            return listenerElement('komp-table-cell-toggle', {
                type: 'button',
                content: 'Expand'
            }, e => {
                const was = cell.row.expandedCells.has(cell)
                if (was) {
                    cell.row.expandedCells.clear()
                    e.target.textContent = "Expand"
                } else {
                    cell.row.expandedCells.add(cell)
                    e.target.textContent = "Collapse"
                }
                cell.row.resetExpand()
            })
        }
        cell.showExpandToggle = function () {
            if (cell.toggleButton) {
                cell.toggleButton.style.setProperty('display', 'block')
                cell.toggleButton.textContent = cell.row.expandedCells.has(cell) ? 'Collapse' : 'Expand'
            } else {
                cell.toggleButton = cell.renderExpandToggle()
            }
            cell.append(cell.toggleButton)
            cell.style.setProperty('padding-bottom', cell.toggleButton.offsetHeight + "px")
        }
        cell.hideExpandToggle = function () {
            if (cell.toggleButton) {
                cell.toggleButton.style.setProperty('display', 'none')
                cell.style.removeProperty('padding-bottom')
            }
        }
        return cell
    }
    
    let styleWas = this.style
    if (isFunction(styleWas)) { styleWas = styleWas.call(this) }
    this.style = function () {
        return styleWas + `
            ${this.tagName} {
                --collapseTo: auto;
            }
            komp-table-row {
                max-height: var(--expandTo, var(--collapseTo));
            }
            komp-table-row > ${this.tagName}-cell,
            komp-spreadsheet-focus {
                overflow: hidden;
                max-height: var(--expandTo, var(--collapseTo));
            }
            komp-table-cell-toggle {
                display: block;
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                text-align: center;
                background: linear-gradient(rgba(255,255,255, 0), rgba(255,255,255, 0.7) 30%, white);
                cursor: pointer;
                text-transform: uppercase;
                font-size: 0.8em;
                padding-top: 0.5em;
                z-index: 2;
            }
            ${this.tagName}-cell:focus komp-table-cell-toggle,
            ${this.tagName}-cell:hover komp-table-cell-toggle {
                color: var(--select-color);
            }
        `
    }
}