/**
 * A {@link CellHandle} — the logical, lightweight reference to a single cell of a
 * {@link DataGrid}, valid whether or not that cell is currently mounted.
 *
 * Handles are **computed on demand and never stored**: the cell-walking APIs
 * (`at`/`slice`/`cells`/`queryCells`) build them from a `(row, column)` pair when
 * called, then discard them. This keeps steady-state memory flat with dataset size
 * (no per-cell objects retained) — see the plan's "one source of truth, two
 * projections" model.
 *
 * It is a *thin bundle* over the two controllers: `rowIndex`/`cellIndex`/`record`/
 * `value` derive from `row`/`column`, and `element` resolves to the live cell iff
 * the row is mounted (it never materializes one). Implemented as a factory rather
 * than a class — there's no state beyond the two references.
 *
 * @typedef {Object} CellHandle
 * @property {DataGridRow} row
 * @property {DataGridColumn} column
 * @property {*} record
 * @property {number} rowIndex - 0-based
 * @property {number} cellIndex - 0-based
 * @property {string} value - the column's serialized value for this record
 * @property {HTMLElement|null} element - the live cell, or null when off-screen
 *
 * @param {DataGridRow} row
 * @param {DataGridColumn} column
 * @returns {CellHandle}
 */
export default function cellHandle(row, column) {
    return {
        row,
        column,
        get record() { return row.record },
        get rowIndex() { return row.index },
        get cellIndex() { return column.index },
        get value() { return column.valueFor(row.record) },
        get element() { return row.element ? row.cellOf(column) : null }
    }
}
