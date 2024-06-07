/*
Description
----
DataGrid with editable cells

Syntax
----
```javascript
new Spreadsheet({
    data: [{
        name: "Corey Seager",
        team: "Texas Rangers",
        ops: 1.023,
        avg: 0.311,
        positions: ["SS"]
    }, {
        name: "Marcus Semien",
        team: "Texas Rangers",
        ops: 0.823,
        avg: 0.283,
        positions: ["2B"]
    }],
    columns: [{
        render: r => r.name,
        header: 'Name'
    }, {
        render: r => r.team,
        header: 'Team',
    }, {
        render: r => r => r.ops.toLocaleString().replace(/^0/, ''),
        header: 'OPS',
        width: '10%'
    }]
})
```

Example
----
<div class="pad-2x min-height-500-px"></div>
<script type="application/json" src="/texas-rangers-roster.json" id="texas-rangers-roster"></script>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        
        fetch("/texas-rangers-roster.json").then(response => {
            response.json().then(data => {
                document.querySelector('div').append(new Spreadsheet({
                    defaultRowSize: 'calc(1lh + 1em)',
                    class: 'height-90-vh',
                    data: data,
                    columns: [{
                            attribute: 'Name',
                            type: 'string'
                        }, {
                            attribute: 'TEAM',
                            type: 'string'
                        }, {
                            attribute: 'POS',
                            type: 'select',
                            options: [
                                'C', '1B', '2B', '3B', 'SS', 'LF', 'RF', 'CF', 'P',
                            ]
                        },{
                            attribute: "RBI",
                            type: 'number',
                        },{
                            attribute: "AVG",
                            type: 'number',
                        },{
                            attribute: "OPS",
                            type: 'number',
                        },{
                            attribute: "WAR",
                            type: 'number',
                        },{
                            attribute: "TB",
                            type: 'number',
                        },{
                            attribute: "BB",
                            type: 'number',
                        },{
                            attribute: "SO",
                            type: 'number',
                        },{
                            attribute: "SB",
                            type: 'number',
                        },{
                            attribute: "OBP",
                            type: 'number',
                        },{
                            attribute: "SLG",
                            type: 'number',
                        }
                    ]
                }))
            })
        })
        
    });
</script>


Options
----
reorder:
    types: Boolean, String
    description: Enable ability to reoder rows and columns. Pass "rows" or "columns" to reorder just one axis.
    default: true
resize:
    types: Boolean, String
    description: Enable ability to resize rows and columns. Pass "rows" or "columns" to reorder just one axis.
    default: true

Column Options
----
Columns are modeled by an Object that provides a key for each column and it's options.

```javascript
{
    render: player => player.height,
    header: 'Player Height',
    frozen: true
}
```

frozen:
    types: Boolean
    description: freeze this column to the side


Events
----
rowResize:
    description: fired when a row is resized
    arguments: rowID:String, newSize:Integer, rowSizes:Array
colResize:
    description: fired when a column is resized
    arguments: columnID:String, newSize:Integer
rowReorder:
    description: fired when a row is moved
    arguments: newIndex:Integer, oldIndex:Integer
colReorder:
    description: fired when a column is moved
    arguments: newIndex:Integer, oldIndex:Integer
headerChange:
    description: fired when header is changed via default input for header
    arguments: columnID:String, newValue:String


TODO
----
- [x] Resize
- [x] Reorder
- [ ] Input
- [ ] ContextMenu
- [ ] Cell Navigation (Arrows, Tab, Enter)
- [ ] Cell Selection
- [ ] Copy/Paste


BUGS
----
- [ ] Dragging column over frozen column does not scroll panel
- [ ] Grab reorder handle, and scroll opposite direction, and column shadow will cut off with scroll

*/

import { includeModule } from '../support.js';
import EditableDataGrid from './data-grid/editable.js';
// import KompElement from './element.js';
// import Floater from './floater.js';
// import ContentArea from './content-area.js';

export default class Spreadsheet extends EditableDataGrid {
    static tagName = 'komp-spreadsheet'
    
    static assignableAttributes = {
        reorder: ['columns', 'rows'],
        resize: ['columns', 'rows']
    }
    
    constructor (options, ...args) {
        super(options, ...args)
        this.columns = this.columns.map(column => Object.assign({
            render: r => r[column.attribute],
            header: column.attribute
        }, column))
    }
    
    renderHeader () {
        const row = super.renderHeader()
        row.row = 1
        return row
    }
    
    renderHeaderCell (column, index) {
        const cell = super.renderHeaderCell(column, index)
        cell.classList.add(`column-${index}`, `row-1`)
        cell.row = 1
        cell.column = index
        return cell
    }
    
    renderRow (item, index) {
        const row = super.renderRow(item, index)
        row.classList.add(`row-${index}`)
        row.row = index
        return row
    }
    
    renderCell (item, column, colIndex, rowIndex) {
        const cell = super.renderCell(item, column, colIndex, rowIndex)
        if (column.frozen) {
            cell.classList.add('frozen')
        }
        cell.classList.add(`column-${colIndex}`, `row-${rowIndex}`)
        cell.column = colIndex
        cell.row = rowIndex
        return cell
    }
    
    
    /* ----------------------
        Input
    ----------------------- */
    activateInputFor(cell) {
        
    }


    static style = `
        komp-spreadsheet {
            --select-color: #1a73e8;
            --handle-size: 10px;
            position: relative;
            overflow: scroll;
            scroll-snap-type: both mandatory;
        }

        komp-spreadsheet-cell {
            user-select: none;
            scroll-snap-stop: always;
            scroll-snap-align: start;
        }
        
        komp-spreadsheet-cell.frozen {
            position: sticky;
            left: 0;
        }
        
        komp-spreadsheet-header > * {
            position: sticky;
            top: 0;
        }
        
        komp-spreadsheet-resize-handle { z-index: 31; }
    `
}

window.customElements.define(Spreadsheet.tagName, Spreadsheet);