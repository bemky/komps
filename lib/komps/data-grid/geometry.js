/**
 * A generic **1-D geometry index** for one axis of a {@link DataGrid}. Instantiate
 * once per axis (rows and columns).
 *
 * Vocabulary is abstracted: **size** (a height or a width), **offset** (cumulative
 * start along the axis), **extent** (total size of the axis). The only axis-specific
 * knowledge is *how to read an element's size*, injected via `sizeOf(element)`:
 *
 * - rows → `row => row.height ?? estimate` (variable, measured)
 * - columns → `col => resolveWidth(col.width, default)` (known config)
 *
 * Everything else — cumulative offsets (prefix-sum with incremental `rebuildFrom`),
 * the `indexAtOffset` hit-test, the CSS track `template`, and `frozenOffsetAt` for
 * leading pinned elements — is identical for both axes.
 *
 * Backed by a prefix-sum array; `rebuildFrom(i)` reflows the suffix in O(n) (fine for
 * hundreds–thousands of rows). Sizes are cached on rebuild so `sizeOf` (which may
 * parse a px string) isn't re-run on every read.
 *
 * {@link DataGrid} builds one instance per axis (`rowGeometry` / `columnGeometry`).
 *
 * @example
 * const rowGeometry = new DataGridGeometry(rows, {
 *     sizeOf: row => row.height == null ? rowEstimate : row.height
 * })
 * const columnGeometry = new DataGridGeometry(columns, {
 *     sizeOf: col => resolveWidth(col.width, defaultColumnWidth)
 * })
 * columnGeometry.template()            // -> "80px 120px 60px"
 * rowGeometry.indexAtOffset(scrollTop) // -> first visible row index
 *
 * @class DataGridGeometry
 */
export default class DataGridGeometry {
    /**
     * @param {Array} elements - the ordered controllers for this axis (rows or columns)
     * @param {Object} options
     * @param {function} options.sizeOf - `(element) => size` in px for that element
     */
    constructor(elements, { sizeOf }) {
        this.elements = elements
        this.sizeOf = sizeOf
        this.sizes = []
        this.offsets = []
        this.rebuildFrom(0)
    }

    /**
     * Recompute cached sizes + cumulative offsets from index `from` to the end. Call
     * whenever an element's size changes, or elements are inserted/removed/reordered
     * at/after `from`. Offsets before `from` are unaffected, so re-summing only the
     * suffix is sufficient.
     */
    rebuildFrom(from = 0) {
        const n = this.elements.length
        from = Math.max(0, Math.min(from, n))
        let acc = from === 0 ? 0 : (this.offsets[from] || 0)
        for (let i = from; i < n; i++) {
            this.offsets[i] = acc
            this.sizes[i] = this.sizeOf(this.elements[i])
            acc += this.sizes[i]
        }
        this.offsets[n] = acc
        this.offsets.length = n + 1
        this.sizes.length = n
        return this
    }

    /** Size (px) of element `i` (cached). */
    sizeAt(i) { return this.sizes[i] || 0 }

    /** Cumulative start offset (px) of element `i`. */
    offsetAt(i) {
        const n = this.elements.length
        return this.offsets[Math.max(0, Math.min(i, n))] || 0
    }

    /** Total size (px) along the axis. */
    get extent() { return this.offsets[this.elements.length] || 0 }

    /**
     * Largest element index whose start offset is <= `offset` (the windowing
     * hit-test). Binary search over the prefix-sum array; clamps into [0, n-1].
     */
    indexAtOffset(offset) {
        const n = this.elements.length
        if (n === 0) return 0
        const o = this.offsets
        if (offset <= 0) return 0
        if (offset >= o[n]) return n - 1
        let lo = 0, hi = n
        while (lo < hi) {
            const mid = (lo + hi) >> 1
            if (o[mid] <= offset) lo = mid + 1
            else hi = mid
        }
        return Math.max(0, lo - 1)
    }

    /** CSS track list of the sizes along this axis (e.g. for `grid-template-columns`). */
    template() { return this.sizes.map(s => s + 'px').join(' ') }

    /**
     * Sticky offset (px) for a leading **frozen** element (cumulative size of the
     * frozen elements before it), or `null` if this element isn't frozen. Elements
     * opt in with a truthy `frozen` flag; axes without frozen elements always get null.
     */
    frozenOffsetAt(i) {
        if (!(this.elements[i] && this.elements[i].frozen)) return null
        let acc = 0
        for (let j = 0; j < i; j++) {
            if (this.elements[j] && this.elements[j].frozen) acc += this.sizeAt(j)
        }
        return acc
    }
}
