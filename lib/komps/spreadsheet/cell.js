/*

Description
----
The cell for [Spreadsheet](/spreadsheet)

Syntax
----
```javascript
new Cell({
    record: {
        name: 'Corey Seager',
        position: 'SS',
        bats: 'L'
    },
    column: new Column({
        render: record => record.name
    })
})
```


Options
----
readonly:
    types: Boolean
    default: false
    description: make the cell present, but inactive (won't generate input)
*/

import { createElement, insertAfter, css } from 'dolla';
import { placeCaretAtEnd } from '../../support';
import Input from '../input.js';
import Floater from '../floater.js';
import TableCell from '../table/cell.js';

export default class SpreadsheetCell extends TableCell {
    static tagName = 'komp-spreadsheet-cell';
    
    static assignableAttributes = {
        readonly: false
    }
    
    constructor (options, ...args) {
        super(options, ...args)
        this.tabIndex = 0
        this.addEventListener('focusin', this.onFocusIn)
        this.addEventListener('focusout', this.onFocusOut)
        if (options.disabled != undefined) {
            this.toggleAttribute('disabled', options.disabled)
        }
    }
    
    onFocusIn (e) {
        this.focusCell = createElement(this.table.tagName + "-focus")
        this.focusCell.classList.toggle('frozen', this.classList.contains('frozen'))
        this.focusCell.classList.toggle('readonly', this.readonly)
        this.focusCell.style.setProperty('grid-column', this.cellIndex)
        if (this.groupIndex) {
            this.focusCell.style.setProperty('grid-row', this.groupIndex)
        }
        this.parentElement.append(this.focusCell)
        const outlineWidth = parseInt(css(this.focusCell, 'outline-width'))
        const viewBox = {
            left: this.table.scrollLeft + this.table.frozenLeft,
            top: this.table.scrollTop + this.table.header.offsetHeight,
            right: this.table.scrollLeft + this.table.clientWidth,
            bottom: this.table.scrollTop + this.table.clientHeight
        }
        const cellBox = {
            left: this.focusCell.offsetLeft - outlineWidth,
            top: this.focusCell.offsetTop - outlineWidth,
            right: this.focusCell.offsetLeft + this.focusCell.offsetWidth + outlineWidth,
            bottom: this.focusCell.offsetTop + this.focusCell.offsetHeight + outlineWidth
        }
        
        const scrollDelta = { left: 0, top: 0 }
        if (cellBox.left < viewBox.left) {
            scrollDelta.left = cellBox.left - viewBox.left
        } else if (cellBox.right > viewBox.right) {
            scrollDelta.left = cellBox.right - viewBox.right
        }
        
        if (cellBox.top < viewBox.top) {
            scrollDelta.top = cellBox.top - viewBox.top
        } else if (cellBox.bottom > viewBox.bottom) {
            scrollDelta.top = cellBox.bottom - viewBox.bottom
        }
        this.table.scrollBy(scrollDelta)
    }
    
    onFocusOut (e) {
        this.focusCell.remove()
        delete this.focusCell
    }
    
    focusAdjacentCell (direction) {
        let columnIndex = this.cellIndex
        let rowIndex = this.rowIndex
        let groupIndex = this.groupIndex
        
        if (direction == "up" || direction == "down") {
            rowIndex += direction == "up" ? -1 : 1
        } else {
            columnIndex += direction == "left" ? -1 : 1
        }
        if (groupIndex) {
            if (direction == "up") {
                if (groupIndex == 1) {
                    groupIndex = -1
                } else {
                    groupIndex--
                    rowIndex = this.rowIndex
                }
            } else if (direction == "down") {
                if (groupIndex == this.parentElement.rowCount) {
                    groupIndex = 1
                } else {
                    groupIndex++
                    rowIndex = this.rowIndex
                }
            }
        }
        
        let target = this.table.at(columnIndex, rowIndex, groupIndex)
        
        if (target) {
            this.table.style.setProperty('scroll-snap-type', 'unset')
            const bb = target.getBoundingClientRect()
            const tableBB = this.table.getBoundingClientRect()
            const point = ['left', 'up'].includes(direction) ? [bb.x + 1, bb.y + 1] : [bb.x + bb.width - 1, bb.y + bb.height - 1]
            const topEl = document.elementFromPoint(...point)
            target.focus({preventScroll: true})
            this.table.style.removeProperty('scroll-snap-type')
        }
        return target
    }
    
    async activate (options={}) {
        if (this.readonly) return
        if (this.spawnInput === undefined || this.spawnInput === null) { return }
        const inputFloater = await this.spawnInput(options)
        if (inputFloater === undefined || inputFloater === null || inputFloater === false) { return }

        this.tabIndex = -1
        inputFloater.addEventListener('hidden', () => {
            this.tabIndex = 0
            this.render()
        })
        let focusTarget = inputFloater.querySelector('[autofocus]');
        focusTarget = focusTarget || inputFloater.querySelector('input, textarea, select, [contenteditable]')
        if (focusTarget) {
            const setFocus = () => {
                focusTarget.focus()
                if (focusTarget.showPicker) focusTarget.showPicker()
            }
            if (focusTarget._loading && focusTarget._loading instanceof Promise) {
                focusTarget._loading.then(() => setTimeout(setFocus, 50))
            } else {
                // delay setting focus to give floater a moment to get positioned, or else scroll goes to 0,0
                setTimeout(setFocus, 50)
            }
        }
        inputFloater.addEventListener('keyup', e => {
            if (e.key == "Escape") {
                inputFloater.setAttribute('preventChange', true)
                this.focus()
                e.preventDefault()
            } else if (!this.table._enterDown && e.key == "Enter" && [e.metaKey,e.ctrlKey,e.altKey,e.shiftKey].every(x => x == false)) {
                if (this.column.onEnter(e) !== false)
                e.preventDefault()
                const newCell = this.focusAdjacentCell('down')
                if (!newCell) {
                    this.focus()
                    inputFloater.hide()
                }
            }
        })
        inputFloater.addEventListener('keydown', e => {
            if (e.key == "Enter" && [e.metaKey,e.ctrlKey,e.altKey,e.shiftKey].every(x => x == false)) {
                e.preventDefault()
            }
        })
        return inputFloater
    }
    
    createInput (options) {
        return this.column.input(this.record, this, options)
    }
    
    async spawnInput (options) {
        const inputContent = await this.createInput(options)
        if (inputContent) {
            const floater = new Floater({
                class: 'komp-spreadsheet-input',
                anchor: this,
                style: {
                    '--padding': css(this, 'padding'),
                    '--cell-width': this.offsetWidth + 'px',
                    '--cell-height': this.offsetHeight + 'px',
                    '--remaining-width': this.table.offsetWidth - this.offsetLeft + "px",
                    '--remaining-height': this.table.offsetHeight - this.offsetTop + "px"
                },
                content: {
                    tag: 'label',
                    content: inputContent,
                    class: this.column.class
                },
                placement: 'bottom-start',
                autoPlacement: {
                    alignment: 'start',
                    allowedPlacements: ['top', 'bottom']
                },
                removeOnBlur: true,
                offset: ({rects}) => ({
                    mainAxis: -rects.reference.height,
                })
            })
            insertAfter(this, floater)
            return floater.show()
        } else {
            return inputContent
        }
    }
    
    canCopy () {
        return !!this.column.copy
    }
    copy () {
        return this.column.copy(this)
    }
    
    canPaste () {
        return !!this.column.paste
    }
    paste (v) {
        return this.column.paste(this, v)
    }
    
    clear () {
        this.column.clear(this)
        this.render()
    }
    
    contextMenu (menu) {
        return this.column?.contextMenu(menu, this, this.column)
    }
}
window.customElements.define(SpreadsheetCell.tagName, SpreadsheetCell);