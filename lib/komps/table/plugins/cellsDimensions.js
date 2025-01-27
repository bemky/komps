export default function (proto) {
    proto.cellsDimensions = function (dimension) {
        const cells = this.querySelectorAll(`${this.tagName}-cell`)
        const lastCell = cells.item(cells.length - 1)
        return {
            width: lastCell.offsetLeft + lastCell.offsetWidth,
            height: lastCell.offsetTop + lastCell.offsetHeight
        }[dimension]
    }
}