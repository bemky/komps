import DataTable from './data-table.js';

export default class AxisResizeDataTable extends DataTable {
    static assignableAttributes = {
        resize: ['col', 'row'],
    }
    
    constructor (...args) {
        super(...args)
        if (this.resize === true) {
            this.resize = ['col', 'row']
        } else if (this.resize === false) {
            this.resize = []
        } else if (typeof this.resize === "string") {
            this.resize = [this.resize]
        }

        this.resizeHandleTag = `${this.constructor.tagName}-resize-handle`
        
        this.addEventListenerFor(this.cellTag, 'mouseover', e => {
            this.showResizeHandleFor(e.delegateTarget)
        })
        this.addEventListener('mouseleave', e => {
            this.querySelectorAll(this.resizeHandleTag).forEach(x => x.remove());
        })
    }
    
    initializeAxisResize (e) {
        const axis = e.target.parentElement.classList.contains('row') ? 'row' : 'col'
        const handle = axis == "row" ? this.rowResizeHandle : this.colResizeHandle
        const index = axis == "row" ? "rowIndex" : "colIndex"
        const selectedIndex = handle[index] - (e.target.classList.contains('start') ? 1 : 0)
        const start = e[axis == "row" ? "y" : "x"] - this.querySelector(`${this.cellTag}.${axis}-${selectedIndex}`)[axis == "row" ? "offsetHeight" : "offsetWidth"]
        const indexes = uniq(Array.from(this.querySelectorAll(`${this.cellTag}.header.selected`)).map(cell => cell[index])).concat(selectedIndex)
        const handleOffset = handle.offsetWidth / 2
        const offset = this[axis == "col" ? "scrollLeft" : "scrollTop"] - this[axis == "col" ? "offsetLeft" : "offsetTop"]
        
        this.classList.add('resizing')
        
        this.dragIndicator = createElement(`${this.constructor.tagName}-drag-indicator`, {
            class: axis,
            style: {
                [axis == "col" ? "gridRow" : "gridColumn"]: 'handles / -1'
            }
        })
        this.append(this.dragIndicator)

        let mouseMove = e => {
            this.dragIndicator.style.insetInlineStart = (e[axis == "col" ? "x" : "y"] + offset) + "px"
        }
        mouseMove = mouseMove.bind(this)

        let mouseUp = (e) => {
            let delta = e[axis == "row" ? "y" : "x"] - start;
            if (delta < 0) { delta = 0 }
            let sizes = this.style[`gridTemplate${axis == "row" ? 'Rows' : 'Columns'}`].split(" [body] ")
            indexes.forEach(index => {
                sizes[index] = delta + "px"
            })
            this.style[`gridTemplate${axis == "row" ? 'Rows' : 'Columns'}`] = sizes.join(" [body] ")
            
            const data = axis == "row" ? this.data : this._columns
            this.trigger(indexes.map(index => data[index].id), `${axis}Resize`,  delta)
            
            this.dragIndicator.remove()
            delete this.dragIndicator
            this.classList.remove('resizing')
            
            this.removeEventListener('mousemove', mouseMove)
            this.removeEventListener('mouseup', mouseUp)
        }
        mouseUp = mouseUp.bind(this)

        this.addEventListener('mousemove', mouseMove)
        this.addEventListener('mouseup', mouseUp)
    }
    
    showResizeHandleFor (cell) {
        if (!this.colResizeHandle && this.resize.includes('col')) {
            this.colResizeHandle = createElement(this.resizeHandleTag, {
                class: 'col',
                content: [{class: 'start'}, {class: 'end'}]
            })
            this.manageEventListenerFor(this.colResizeHandle, 'mousedown', this.initializeAxisResize.bind(this))
            this.append(this.colResizeHandle);
        }
        if (!this.rowResizeHandle && this.resize.includes('row')) {
            this.rowResizeHandle = createElement(this.resizeHandleTag, {
                class: 'row',
                content: [{class: 'start'}, {class: 'end'}]
            })
            this.manageEventListenerFor(this.rowResizeHandle, 'mousedown', this.initializeAxisResize.bind(this))
            this.append(this.rowResizeHandle);
        }
        if (!this.classList.contains('resizing')) {
            if (this.colResizeHandle) {
                this.colResizeHandle.rowIndex = 1
                this.colResizeHandle.colIndex = cell.colIndex
                this.colResizeHandle.style.gridArea = ['header', `body ${cell.colIndex}`, 'header', `body ${cell.colIndex}`].join(" / ")
                this.colResizeHandle.classList.toggle('hide-start', cell.classList.contains('col-1'))
                this.colResizeHandle.classList.toggle('hide-end', cell.classList.contains(`col-${cell.parentElement.children.length}`))
                this.colResizeHandle.classList.toggle('frozen-row', cell.classList.contains('frozen-row'))
                if (cell.classList.contains('row-header')) {
                    this.append(this.colResizeHandle);
                } else {
                    this.colResizeHandle.remove();
                }
            }
        
            if (this.rowResizeHandle) {
                this.rowResizeHandle.rowIndex = cell.rowIndex
                this.rowResizeHandle.colIndex = 1
                this.rowResizeHandle.style.gridArea = [`body ${cell.rowIndex}`, 'body', `body ${cell.rowIndex}`, 'body'].join(" / ")
                this.rowResizeHandle.classList.toggle('frozen-col', cell.classList.contains('frozen-col'))
                if (cell.classList.contains('col-1')) {
                    this.append(this.rowResizeHandle);
                } else {
                    this.rowResizeHandle.remove();
                }
            }
        }
    }
}