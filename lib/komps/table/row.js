import KompElement from '../element.js';
import Group from './group.js';

/**
 * A row in a {@link Table}, rendered as a CSS Grid subgrid.
 *
 * @class TableRow
 * @extends KompElement
 */
export default class TableRow extends KompElement {
    static tagName = 'komp-table-row'
    
    static assignableAttributes = {
        rowIndex: { type: 'number', default: null, null: true },
        table: { type: 'object', default: null, null: true },
        height: { type: 'string', default: null, null: true },
        record: { type: 'object', default: null, null: true }
    }
    
    #rowCount = 0;
    
    get cells () { return Array.from(this.querySelectorAll(this.table.cellSelector)) }
    get rowCount () { return this.#rowCount }
    set rowCount (v) {
        this.style.gridTemplateRows = `repeat(${v}, var(--row-size, auto))`
        this.#rowCount = v
    }
    
    constructor (...args) {
        super(...args)
        this.generatedGroupNames = new Map()
    }
    
    rowIndexChanged(was, now) {
        if (was != now) {
            this.style.gridRow = now
        }
    }
    
    heightChanged(v) {
        if (this.parentElement) {
            this.table.setTemplateRows()
        }
    }
    
    async renderColumn (column, record) {
        if (column.splitInto) {
            const placeholderCell = await column.renderCell(null, { readonly: true, disabled: true })
            this.append(placeholderCell)
            
            let subrecords = await (typeof column.splitInto == 'function' ? column.splitInto(record) : record[column.splitInto])
            if (subrecords == undefined || subrecords.length == 0) {
                placeholderCell.toggleAttribute('disabled', false)
                return placeholderCell
            }
            const cells = await Promise.all(await subrecords.map(async (subrecord, i) => {
                const cell = await column.renderCell(subrecord)
                cell.groupIndex = i + 1
                return cell
            }))
            let groupName = typeof column.splitInto == 'string' ? column.splitInto : column.splitInto.name
            if (groupName == 'splitInto') {
                groupName = this.generatedGroupNames.get(column.splitInto)
                if (!groupName) {
                    groupName = 'group-' + this.generatedGroupNames.size
                    this.generatedGroupNames.set(column.splitInto, groupName)
                }
            }
                
            let group = this.querySelector(Group.tagName + `[data-name=${groupName}]`)
            if (!group) {
                group = new Group({
                    data: { name: groupName }
                })
                this.append(group)
            }
            group.append(...cells)
            return cells
        } else {
            const cell = await column.renderCell(record)
            this.append(cell)
            return cell
        }
    }
}
