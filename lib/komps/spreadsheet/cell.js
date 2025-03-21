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
        const inputCell = await this.spawnInput(options)
        if (this.table.inputCell) {
            this.table.inputCell.beforeRemove()
            this.table.inputCell.remove()
            delete this.table.inputCell
        }
        this.table.inputCell = inputCell
        if (inputCell === undefined || inputCell === null || inputCell === false) { return }
        inputCell.style.setProperty('--remaining-width', this.table.offsetWidth - this.offsetLeft + "px")
        inputCell.style.setProperty('--remaining-height', this.table.offsetHeight - this.offsetTop + "px")
        insertAfter(this, inputCell)
        this.tabIndex = -1
        inputCell.beforeRemove = () => {
            this.tabIndex = 0
            this.render()
        }
        
        let focusTarget = inputCell.querySelector('[autofocus]');
        focusTarget = focusTarget || inputCell.querySelector('input, textarea, select, [contenteditable]')
        if (focusTarget) {
            const setFocus = () => {
                focusTarget.focus()
                if (focusTarget.showPicker) {
                    focusTarget.showPicker()
                }
            }
        
            if (focusTarget._loading && focusTarget._loading instanceof Promise) {
                focusTarget._loading.then(setFocus)
            } else {
                setFocus()
            }
        }
        
        inputCell.addEventListener('keyup', e => {
            if (e.key == "Escape") {
                inputCell.setAttribute('preventChange', true)
                this.focus()
                e.preventDefault()
            } else if (!this.table._enterDown && e.key == "Enter" && [e.metaKey,e.ctrlKey,e.altKey,e.shiftKey].every(x => x == false)) {
                const newCell = this.focusAdjacentCell('down')
                if (!newCell) {
                    this.focus()
                }
            }
        })
        inputCell.addEventListener('mousedown', e => {
            if (inputCell.contains(e.target)) {
                inputCell.clickedInside = true
                window.addEventListener('mouseup', e => {
                    delete inputCell.clickedInside
                    if (!inputCell.contains(e.target)) {
                        this.focus()
                    }
                }, {once: true})
            }
        })
        inputCell.addEventListener('focusout', e => {
            if (!inputCell.contains(e.relatedTarget) && !inputCell.clickedInside) {
                inputCell.beforeRemove()
                if (inputCell.checkValidity === undefined || inputCell.checkValidity()) {
                    inputCell.remove()
                }
            }
        })
        return inputCell
    }
    
    createInput (options) {
        return this.column.input(this.record, this, options)
    }
    
    async spawnInput (options) {
        const inputContent = await this.createInput(options)
        if (inputContent) {
            return createElement(`komp-spreadsheet-input`, {
                class: this.column.frozen ? "frozen" : "",
                style: {
                    'grid-column': this.cellIndex,
                    'grid-row': css(this, 'grid-row')
                },
                content: {
                    tag: 'label',
                    content: inputContent,
                    class: this.column.class,
                    style: {
                        '--padding': css(this, 'padding')
                    }
                }
            })
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