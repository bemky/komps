/**
 * A plugin that provides a `cellsDimensions` method to compute the total width/height of all cells.
 *
 * @function cellsDimensions
 * @mixin
 */
export default function (proto) {
    proto.cellsDimensions = function (dimension) {
        const cells = this.querySelectorAll(this.cellSelector)
        const lastCell = cells.item(cells.length - 1)
        return {
            width: lastCell.offsetLeft + lastCell.offsetWidth,
            height: lastCell.offsetTop + lastCell.offsetHeight
        }[dimension]
    }
}