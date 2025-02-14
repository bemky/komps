import { createElement, insertAfter, css } from 'dolla';
import { placeCaretAtEnd } from '../../support';
import Input from '../input.js';
import TableCell from '../table/cell.js';

export default class SpreadsheetCell extends TableCell {
    static tagName = 'komp-spreadsheet-cell';
    
    constructor (...args) {
        super(...args)
        this.tabIndex = 0
        this.addEventListener('focusin', this.onFocusIn)
    }
    
    onFocusIn (e) {
        const outlineWidth = parseInt(css(this, 'outline-width'))
        const viewBox = {
            left: this.table.scrollLeft + this.table.frozenLeft,
            top: this.table.scrollTop + this.table.header.offsetHeight,
            right: this.table.scrollLeft + this.table.clientWidth,
            bottom: this.table.scrollTop + this.table.clientHeight
        }
        const cellBox = {
            left: this.offsetLeft - outlineWidth,
            top: this.offsetTop - outlineWidth,
            right: this.offsetLeft + this.offsetWidth + outlineWidth,
            bottom: this.offsetTop + this.offsetHeight + outlineWidth
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
    
    offsetCell(columnDelta, rowDelta, cellSplitDelta) {
        let cellSplitIndex
        // TODO update to account for more than 1 in cellSplitDelta
        if (cellSplitDelta != undefined && this.cellSplitIndex != undefined) {
            if (cellSplitDelta == -1 && this.cellSplitIndex == 1) {
                if (this.row.previousElementSibling && this.row.previousElementSibling.rowCount) {
                    cellSplitIndex = this.row.previousElementSibling.rowCount
                    rowDelta = -1
                }
            } else {
                cellSplitIndex = this.cellSplitIndex + cellSplitDelta
            }
        }
        return this.table.at(this.cellIndex + columnDelta, this.rowIndex + rowDelta, cellSplitIndex)
    }
    
    focusAdjacentCell (direction) {
        const target = this.offsetCell(...{
            right: [1, 0, 0],
            left: [-1, 0, 0],
            up: this.cellSplitIndex ? [0, 0, -1] : [0, -1, 0],
            down: this.cellSplitIndex && this.cellSplitIndex < this.row.rowCount ? [0, 0, 1] : [0, 1, 0]
        }[direction])
        
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
        insertAfter(this.parentElement.localName == this.localName ? this.parentElement : this, inputCell)
        this.tabIndex = -1
        inputCell.beforeRemove = () => {
            this.tabIndex = 0
            this.render()
        }
        
        const focusTarget = inputCell.querySelector('input, textarea, select, [contenteditable]')
        if (focusTarget) {
            const setFocus = () => {
                placeCaretAtEnd(focusTarget)
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
        inputCell.addEventListener('keydown', e => {
            if (e.key == "Enter" && [e.metaKey,e.ctrlKey,e.altKey,e.shiftKey].every(x => x == false)) {
                this.focusAdjacentCell('down')
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