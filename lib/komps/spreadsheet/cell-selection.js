import DataTable from './data-table.js';

export default class CellSelectionDataTable extends DataTable {
    
    constructor (...args) {
        super(...args)
        this.addEventListenerFor(this.cellTag, 'keydown', e => {
            if (e.delegateTarget.localName == this.inputTag) {
                if (e.key == "Escape") {
                    e.delegateTarget.remove()
                    e.delegateTarget.originalCell.focus()
                }
                this.deselectCells({copySelection: true})
                return
            }
            
            if (["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) {
                e.preventDefault()
                this.changeFocusByDirection(e.key, e.delegateTarget, e)
            }
        })
        this.addEventListenerFor(this.cellTag, 'mousedown', e => {
            if (e.button == 2) {
                if (e.delegateTarget.classList.contains('selected')) {
                    e.preventDefault() 
                } else {
                    this.deselectCells()
                }
                return 
            }
            if (!e.metaKey && !e.shiftKey) {
                this.deselectCells();
            }
            this.initializeCellSelection(e.delegateTarget, e)
        })
    }
    
    changeFocusByDirection(direction, currentCell, e) {
        currentCell = currentCell || this.querySelector(`${this.cellTag}:focus, ${this.cellTag}:focus-within`)
        if (currentCell) {
            let targetCell;
            let rowIndex = currentCell.rowIndex;
            if (rowIndex == "header") { rowIndex = 0 }
            switch (direction) {
                case 'ArrowDown': targetCell = this.querySelector(`.row-${rowIndex + 1}.col-${currentCell.colIndex}`); break;
                case 'ArrowUp': targetCell = this.querySelector(`.row-${rowIndex - 1}.col-${currentCell.colIndex}`); break;
                case 'ArrowLeft': targetCell = this.querySelector(`.row-${rowIndex}.col-${currentCell.colIndex - 1}`); break;
                case 'ArrowRight': targetCell = this.querySelector(`.row-${rowIndex}.col-${currentCell.colIndex + 1}`); break;
            }
            if (targetCell) {
                targetCell.focus()
            
                let thisBB = this.getBoundingClientRect();
                const frozenRow = this.querySelector(`${this.cellTag}.frozen-row`)
                const frozenCol = this.querySelector(`${this.cellTag}.frozen-col`)
                if (frozenRow) {
                    thisBB.y = thisBB.top + frozenRow.offsetHeight
                    thisBB.height = thisBB.height - frozenRow.offsetHeight
                }
                if (frozenCol) {
                    thisBB.x = thisBB.left + frozenCol.offsetWidth
                    thisBB.width = thisBB.width - frozenCol.offsetWidth
                }

                let cellBB = targetCell.getBoundingClientRect();
                this.classList.add('unfreeze')
                if (cellBB.top < thisBB.top) {
                    this.scrollBy({left: 0, top: cellBB.top - thisBB.top, behavior: 'instant'})
                }
                if (cellBB.bottom > thisBB.bottom) {
                    let delta = cellBB.bottom - thisBB.bottom
                    while (cellBB.bottom > thisBB.bottom && delta < this.offsetHeight) {
                        this.scrollBy({left: 0, top: delta, behavior: 'instant'})
                        delta += 5
                        cellBB = targetCell.getBoundingClientRect();
                    }
                }
                if (cellBB.left < thisBB.left) {
                    this.scrollBy({left: cellBB.left - thisBB.left, top: 0, behavior: 'instant'})
                }
                if (cellBB.right > thisBB.right) {
                    let delta = cellBB.right - thisBB.right
                    while (cellBB.right > thisBB.right && delta < this.offsetWidth) {
                        this.scrollBy({left: delta, top: 0, behavior: 'instant'})
                        delta += 5
                        cellBB = targetCell.getBoundingClientRect();
                    }
                }
                this.classList.remove('unfreeze')
                
                if (e && e.shiftKey) {
                    let start = this.querySelector('.selection-start')
                    if (!start) {
                        currentCell.classList.add('selection-start')
                        start = currentCell
                    }
                    this.deselectCells({selectionStart: false})
                    this.selectCells(start, targetCell)
                } else {
                    this.deselectCells({selectionStart: true})
                }
            }
        }
    }
    
    initializeCellSelection (startCell, e) {
        if (!this.getRootNode()) { return }

        if (e.shiftKey) {
            this.deselectCells()
            startCell = this.querySelector(`${this.cellTag}:focus`)
            e.preventDefault()
        }

        const mouseOver = e => {
            const overCell = closest(e.target, this.cellTag)
            if (overCell) {
                this.querySelectorAll(`${this.cellTag}.selecting`).forEach(el => el.classList.remove('selecting'))
                const colsMinMax = [startCell.colIndex, overCell.colIndex]
                if (startCell.classList.contains('header')) {
                    for (let colIndex = Math.min(...colsMinMax); colIndex <= Math.max(...colsMinMax); colIndex++) {
                        this.querySelectorAll(`.col-${colIndex}`).forEach(el => el.classList.add('selecting'))
                    }
                } else {
                    const rowsMinMax = [startCell.rowIndex, overCell.rowIndex]
                    for (let rowIndex = Math.min(...rowsMinMax); rowIndex <= Math.max(...rowsMinMax); rowIndex++) {
                        for (let colIndex = Math.min(...colsMinMax); colIndex <= Math.max(...colsMinMax); colIndex++) {
                            const target = this.querySelector(`.row-${rowIndex}.col-${colIndex}`)
                            if (target) {
                                target.classList.add('selecting')
                            }
                        }
                    }
                }
            }
        }


        if (e.shiftKey) {
            mouseOver(e)
        }
        if (startCell.classList.contains('header')) {
            mouseOver(e)
        }

        const mouseUp = e => {
            const endCell = closest(e.target, this.cellTag)
            if (startCell.classList.contains('header') || (endCell && endCell != startCell)) {
                const selectingCells = this.querySelectorAll(`${this.cellTag}.selecting`)
                selectingCells.forEach(el => el.classList.remove('selecting'))
                this.selectCells(...Array.from(selectingCells))
            } else if (e?.metaKey) {
                endCell.classList.add('selected')
            } else {
                this.deselectCells()
            }
            this.removeEventListener('mouseover', mouseOver)
            startCell.focus()
        }

        this.getRootNode().addEventListener('mouseup', mouseUp, {once: true})
        this.addEventListener('mouseover', mouseOver)
    }
    
    /*
        options
        ----
        outline:
            type: String, Boolean
            description: if string, then that string used as tagName
        class:
            type: String
            description: class to add to cells
    */
    selectCells (...cells/* [options={}]*/) {
        let options = cells[cells.length - 1] instanceof HTMLElement ? {} : cells.pop()
        options = Object.assign({
            outline: true,
            class: 'selected'
        }, options)
    
        const min = (a) => Math.min(...a.filter(x => typeof x == "number"))
        const max = (a) => Math.max(...a.filter(x => typeof x == "number"))
        const sequence = (start, end) => [...Array(end - start + 1).fill().map((_, i) => i + start)]
        const result = []
    
        let rowIndexes = cells.map(cell => cell.rowIndex)
        rowIndexes = rowIndexes.filter(x => x == "header").concat(sequence(min(rowIndexes), max(rowIndexes)))
    
        let colIndexes = cells.map(cell => cell.colIndex)
        colIndexes = colIndexes.filter(x => x == "header").concat(sequence(min(colIndexes), max(colIndexes)))
    
        if (options.class) {
            rowIndexes.forEach(rowIndex => {
                colIndexes.forEach(colIndex => {
                    const target = this.querySelector(`.row-${rowIndex}.col-${colIndex}`)
                    if (target) {
                        target.classList.add(options.class)
                        result.push(target)
                    }
                })
            })
        }
    
        if (options.outline) {
            const tagName = typeof options.outline == "string" ? options.outline : `${this.tagName}-selection`
            const frame = createElement(tagName, {
                style: {
                    gridArea: [
                        rowIndexes[0],
                        colIndexes[0],
                        rowIndexes[rowIndexes.length - 1] + 1,
                        colIndexes[colIndexes.length - 1] + 1
                    ].map(i => i == "header" ? i : `body ${i}`).join(" / ")
                }
            })
            frame.classList.toggle('includes-frozen-row', cells.some(cell => cell.classList.contains('frozen-row')))
            frame.classList.toggle('includes-frozen-col', cells.some(cell => cell.classList.contains('frozen-col')))
            this.append(frame)
        }
        return result
    }

    deselectCells (options={}) {
        options = Object.assign({
            selected: true,
            selection: true,
            inputfield: true,
            selectionStart: true,
            copySelection: false,
        }, options)
    
        if (options.selected) {
            this.querySelectorAll(`${this.cellTag}.selected`).forEach(el => el.classList.remove('selected'));
        }
        if (options.selection) {
            this.querySelectorAll(`${this.tagName}-selection`).forEach(el => el.remove());
        }
        if (options.inputfield) {
            this.querySelectorAll(`${this.cellTag}-input`).forEach(el => {
                el.beforeRemove()
                el.remove()
            });
        }
        if (options.selectionStart) {
            this.querySelectorAll(`${this.cellTag}.selection-start`).forEach(el => el.classList.remove('selection-start'));
        }
        if (options.copySelection) {
            this.querySelectorAll(`${this.tagName}-copy-selection`).forEach(el => el.remove());
        }
    }

    selectedCells () {
        let selectedCells = this.querySelectorAll(`${this.cellTag}.selected, ${this.cellTag}:focus, ${this.cellTag}:focus-within`)
        if (selectedCells.length == 0) {
            if (this.contextMenu) {
                selectedCells = [this.contextMenu.anchor]
            } else {
                return []
            }
        }
        const rows = groupBy(selectedCells, 'rowIndex')
        return Object.keys(rows).map(rowIndex => rows[rowIndex])
    }
}