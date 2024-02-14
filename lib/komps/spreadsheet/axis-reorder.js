import DataTable from './data-table.js';

export default class AxisReorderDataTable extends DataTable {
    static assignableAttributes = {
        reorder: ['col', 'row'],
    }
    
    constructor (...args) {
        super(...args)
        if (this.reorder === true) {
            this.reorder = ['col', 'row']
        } else if (this.reorder === false) {
            this.reorder = new Array()
        } else if (typeof this.reorder === "string") {
            this.reorder = [this.reorder]
        }

        this.reorderHandleTag = `${this.constructor.tagName}-reorder-handle`
        
        this.addEventListenerFor(this.cellTag, 'mouseover', e => {
            this.showReorderHandleFor(e.delegateTarget)
        })
        this.addEventListener('mouseleave', e => {
            this.querySelectorAll(this.reorderHandleTag).forEach(x => x.remove());
        })
    }
    
    initializeAxisReorder (e) {
        const axis = e.currentTarget.classList.contains('row') ? 'row' : 'col'
        const handle = axis == "row" ? this.rowReorderHandle : this.colReorderHandle
        let lastCell;
        
        e.dataTransfer.setDragImage(createElement(), 0, 0);
        this.deselectCells({copySelection: true})
        
        if (axis == "col") {
            this.dragStartIndex = handle.colIndex
            handle.style.width = handle.offsetWidth + "px"
            handle.style.left = e.x - (handle.offsetWidth / 2) + this.scrollLeft - this.offsetLeft + "px"
            this.querySelectorAll(`${this.cellTag}.col-${handle.colIndex}`).forEach(el => el.classList.add('selecting'));
        } else {
            this.dragStartIndex = handle.rowIndex
            handle.style.height = handle.offsetHeight + "px"
            handle.style.top = e.y - (handle.offsetHeight / 2) + this.scrollTop - this.offsetTop + "px"
            this.querySelectorAll(`${this.cellTag}.row-${handle.rowIndex}`).forEach(el => el.classList.add('selecting'));
        }
        handle.style.gridArea = null
        this.classList.add('reordering')
        this.dragIndicator = createElement(`${this.constructor.tagName}-drag-indicator`, {
            class: axis,
            style: {
                [axis == "col" ? "gridRow" : "gridColumn"]: 'handles / -1'
            }
        })
        this.append(this.dragIndicator)
        
        let dragOver = e => {
            e.preventDefault()
            const cell = closest(e.target, `${this.cellTag}, ${this.reorderHandleTag}`)
            lastCell = cell;
            if (axis == "col") {
                let x = e.x - (handle.offsetWidth / 2) + this.scrollLeft - this.offsetLeft
                x = x < 0 ? 0 : x
                x = x > this.scrollWidth - handle.offsetWidth ? this.scrollWidth - handle.offsetWidth : x
                handle.style.left = x + "px"
            
                if (cell) {
                    this.dragIndicator.style.gridColumn = `body ${cell.colIndex} / body ${cell.colIndex}`
                    this.dragIndicator.classList.toggle('end', cell.colIndex > this.dragStartIndex)
                }
            } else {
                let y = e.y - (handle.offsetHeight / 2) + this.scrollLeft - this.offsetTop
                y = y < 0 ? 0 : y
                y = y > this.scrollHeight - handle.offsetHeight ? this.scrollHeight - handle.offsetHeight : y
                handle.style.top = y + "px"
            
                if (cell) {
                    this.dragIndicator.style.gridRow = `body ${cell.rowIndex} / body ${cell.rowIndex}`
                    this.dragIndicator.classList.toggle('end', cell.rowIndex > this.dragStartIndex)
                }
            }
        }
        dragOver = dragOver.bind(this)
        
        let drop = e => {
            const cell = closest(e.target, `${this.cellTag}, ${this.reorderHandleTag}`) || lastCell
            lastCell = cell;
            if (cell) {
                const index = axis == "col" ? "colIndex" : "rowIndex"
                const gridAxis = axis == "col" ? "gridColumn" : "gridRow"
                const newIndex = cell[index]
                const oldIndex = this.dragStartIndex
                const delta = newIndex > oldIndex ? -1 : 1;
                this.querySelectorAll(this.cellTag).forEach(cell => {
                    cell.classList.remove(`${axis}-${cell[index]}`)
                    if (cell[index] == oldIndex) {
                        cell[index] = newIndex
                        const anchorIndex = newIndex + Math.max(delta, 0)
                        const method = delta == -1 ? insertAfter : insertBefore
                        if (axis == "col") {
                            method(cell.parentElement.querySelector(`${this.cellTag}.col-${anchorIndex}`), cell)
                        } else {
                            const anchor = this.querySelector(`${this.cellTag}.row-${anchorIndex}.col-${cell.colIndex}`).parentElement
                            method(anchor, cell.parentElement)
                        }
                    } else if (cell[index] == newIndex) {
                        cell[index] += delta
                    } else if (Math.min(oldIndex, newIndex) < cell[index] && cell[index] < Math.max(oldIndex, newIndex)) {
                        cell[index] += delta
                    }
                    if (cell.classList.contains('header') && axis == "row") {
                        cell.classList.add(`${axis}-${cell[index]}`)
                    } else {
                        cell.style[`${gridAxis}Start`] = `body ${cell[index]}`
                        cell.style[`${gridAxis}End`] = `body ${cell[index]}`
                        cell.classList.add(`${axis}-${cell[index]}`)
                    }
                })
                let sizes = this.style[`gridTemplate${axis == "row" ? 'Rows' : 'Columns'}`].split(" [body] ")
                const indexSize = sizes[oldIndex]
                sizes.splice(oldIndex, 1);
                sizes.splice(newIndex, 0, indexSize);
                this.style[`gridTemplate${axis == "row" ? 'Rows' : 'Columns'}`] = sizes.join(" [body] ")
                this.trigger(`${axis}Reorder`, newIndex, oldIndex)
            }
            
            this.querySelectorAll(`${this.cellTag}.selecting`).forEach(el => {
                el.classList.remove('selecting')
                el.classList.add('selected')
            })
        }
        drop = drop.bind(this)
        
        let dragEnd = (e) => {
            const cell = lastCell || this.querySelector(`${this.cellTag}.selecting, ${this.cellTag}.selected`)
            this.dragIndicator.remove()
            delete this.dragIndicator

            this.classList.remove('reordering')
            handle.style.left = ''
            handle.style.width = ''
            handle.style.top = ''
            handle.style.height = ''
            this.showReorderHandleFor(cell)
            this.querySelectorAll(`${this.cellTag}.selecting`).forEach(el => {
                el.classList.remove('selecting')
            })
            
            this.removeEventListener('dragover', dragOver)
            this.removeEventListener('drop', drop)
            this.removeEventListener('dragend', dragEnd)
        }
        dragEnd = dragEnd.bind(this)
        
        this.addEventListener('dragover', dragOver)
        this.addEventListener('drop', drop)
        this.addEventListener('dragend', dragEnd)
    }
    
    showReorderHandleFor (cell) {
        if (!this.colReorderHandle && this.reorder.includes('col')) {
            this.colReorderHandle = createElement(this.reorderHandleTag, {
                class: 'col',
                draggable: true,
                content: {
                    content: handleIcon()
                }
            })
            this.manageEventListenerFor(this.colReorderHandle, 'dragstart', this.initializeAxisReorder.bind(this))
        }
        if (!this.rowReorderHandle && this.reorder.includes('row')) {
            this.rowReorderHandle = createElement(this.reorderHandleTag, {
                class: 'row',
                draggable: true,
                content: {
                    content: handleIcon({horizontal: true})
                }
            })
            this.manageEventListenerFor(this.rowReorderHandle, 'dragstart', this.initializeAxisReorder.bind(this))
        }
        if (!this.classList.contains('reordering')) {
            if (this.colReorderHandle) {
                this.colReorderHandle.rowIndex = 1
                this.colReorderHandle.colIndex = cell.colIndex
                this.colReorderHandle.style.gridArea = ['handles', `body ${cell.colIndex}`, 'handles', `body ${cell.colIndex}`].join(" / ")
                if (cell.classList.contains('frozen-col')) {
                    this.colReorderHandle.remove();
                } else {
                    this.append(this.colReorderHandle);
                }
            }
            
            if (this.rowReorderHandle) {
                this.rowReorderHandle.rowIndex = cell.rowIndex
                this.rowReorderHandle.colIndex = 1
                this.rowReorderHandle.style.gridArea = [`body ${cell.rowIndex}`, 'handles', `body ${cell.rowIndex}`, 'handles'].join(" / ")
                if (cell.classList.contains('frozen-row')) {
                    this.rowReorderHandle.remove();
                } else {
                    this.append(this.rowReorderHandle);
                }
            }
        }
    }
}