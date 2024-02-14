import DataTable from './data-table.js';

export default class ClipboardDataTable extends DataTable {
    
    connected () {
        // Setup copy/paste listeners on Root Node
        if (!this.getRootNode()) { return }
        this.manageEventListenerFor(this.getRootNode(), 'paste', e => {
            if (this.contains(document.activeElement)) {
                e.preventDefault()
                this.pasteCells(e.clipboardData.getData("text/plain"))
            }
        })
        this.manageEventListenerFor(this.getRootNode(), 'copy', e => {
            if (this.contains(document.activeElement)) {
                e.preventDefault()
                this.copyCells(document.activeElement)
            }
        })
    }
    
    copyCells(cell) {
        const selectedCells = this.selectedCells()
        const data = this.selectedCells().map(row => row.map(cell => {
            return cell.columnModel.copy(cell.record)
        }).join("\t")).join("\n")
        window.navigator.clipboard.writeText(data)
        this.copyData = data
        this.deselectCells({copySelection: true})
        this.selectCells(...selectedCells.flat(), {outline: `${this.tagName}-copy-selection`})
    }
    
    pasteCells(data) {
        if (data == undefined) { return }
        const selectedCells = this.selectedCells()
        const pasteMatrix = data.split("\n").map(r => r.split("\t"))
        
        if (selectedCells.length == 1 && selectedCells[0].length == 1) {
            const selectedCell = selectedCells[0][0]
            let rowIndex = selectedCell.rowIndex
            const targets = []
            pasteMatrix.forEach(row => {
                let colIndex = selectedCell.colIndex
                row.forEach(cellValue => {
                    const cell = this.querySelector(this.cellTag + `.col-${colIndex}.row-${rowIndex}`)
                    if (cell) {
                        this.pasteCell(cell, cellValue)
                        targets.push(cell)
                    }
                    colIndex++
                })
                rowIndex++
            })
            this.selectCells(...targets)
            selectedCell.focus();
        } else {
            let rowIndex = 0
            selectedCells.forEach(row => {
                rowIndex = rowIndex == pasteMatrix.length ? 0 : rowIndex
                let colIndex = 0
                row.forEach(cell => {
                    colIndex = colIndex == pasteMatrix[rowIndex].length ? 0 : colIndex
                    this.pasteCell(cell, pasteMatrix[rowIndex][colIndex])
                    colIndex++
                })
                rowIndex++
            })
        }

        this.querySelectorAll(`${this.tagName}-copy-selection`).forEach(el => el.remove());
    }
    
    pasteCell(cell, value) {
        cell.columnModel.paste(cell.record, value)
        cell.render()
    }
}