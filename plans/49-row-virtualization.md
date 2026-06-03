# Implementation Plan — `DataGrid`, a virtualized grid component (Issue #49, Option C)

> Status: planned · Tracking: [#49](../../../issues/49) · Type: **additive feature** (new component, non-breaking for v1)

## 0. Locked decisions

**New component `DataGrid`** (windowed) — built standalone; **no reuse of `Table`/`TableColumn`/`TableCell`**.
Option C windowing · variable row heights w/ measurement cache · explicit widths required (default width
when omitted) · model-backed cell handles · value from `column.render` (+ optional override) · DataGrid owns
a bounded scroll viewport · left-freeze only · `splitInto` row = one measured unit.

**Read-only for v1; editing deferred.** DataGrid v1 ships read-only. Editing/selection/copy-paste arrives
later as a **`Spreadsheet` that extends `DataGrid`**, intended to **replace today's `Table`-based
`Spreadsheet`**. To make that a clean drop-in, DataGrid is *designed up front* to mirror the current
Spreadsheet's constructor options, events, and column-config surface (see §3).

**No Table reuse — optimize for simplicity.** DataGrid gets its own `DataGridColumn`, `DataGridCell`, and
column-type registry. We deliberately accept some duplication with `table/`; once v1 is working we'll assess
whether to extract any shared base. Don't pre-factor.

### Why a new component instead of converting `Table`

- **Non-breaking for v1.** `Table`/`Spreadsheet` and their `at`/`slice`/`cells` element-returning contracts
  are untouched. (The eventual Spreadsheet-on-DataGrid swap is a *later* change, called out in §3/§4.)
- **Clean API surface.** DataGrid defines `at`/`slice`/`cells`/`queryCells` to return **handles** from day
  one — no back-compat shim, no dual contract.
- **Independent evolution.** Standalone column/cell classes let the windowed model move without being pinned
  to Table's subgrid internals.

---

## 1. Architecture

DataGrid is a fresh `KompElement` whose source of truth is the **`this.rows` collection of `DataGridRow`
controllers**, not the DOM. DOM rows are an ephemeral projection of the visible window. This is the inverse of
`Table`, where `rows`/`cells` are
`querySelectorAll` (`table.js:350-355`), `at`/`slice` walk elements (`table.js:462-524`), and `cell.row`
climbs parents (`cell.js:39-46`).

### Terminology: collection / controller / handle

Three layers — used precisely throughout this plan, keyed to the stored-vs-computed axis (§1.1):

- **collection** — the *stored source of truth*: plain arrays `this.rows` / `this.columns` (no `*Model`
  class — mirrors how `Table` holds `this.columns`). The collection ops (splice/sort/window) live on `DataGrid`.
- **controller** — one *persistent plain-class instance* per data-row/column (`DataGridRow` / `DataGridColumn`).
  Long-lived; holds config + behavior and references its dumb/pooled DOM element(s) while mounted. **Rows and
  columns have controllers; cells do not** (cell elements are pooled, and the *logical* cell is never stored).
- **handle** — the *role* of a lightweight public reference; `.element` may be `null`. Because rows/columns are
  stored, a **`DataGridRow`/`DataGridColumn` controller *is* its own handle** (persistent, exposes `element`).
  Because cells aren't, a **`CellHandle` is computed on demand** and discarded. No `RowHandle` type exists.

### Inheritance

```
HTMLElement
  └─ KompElement
       ├─ DataGrid                 (new; standalone, does NOT extend Table)
       │    └─ Spreadsheet (future)  (extends DataGrid; replaces today's Table-based Spreadsheet)
       └─ DataGridCell             (custom element; renders content)
```

### Controller ↔ element split (the symmetry)

DataGrid mirrors `TableColumn`'s pattern on **both** axes: a persistent *controller class* owns behavior and
references *dumb, pooled DOM elements* that exist only while windowed. Crucially, `DataGridRow` mirrors the
**`TableColumn`** controller — **not** `TableRow`, which today *is* the element (`row.js` `extends KompElement`),
the very model↔DOM coupling virtualization removes.

| | Column axis | Row axis |
|---|---|---|
| Controller (plain class, persistent, 1 per column/data-row) | `DataGridColumn` (`column.js`) | **`DataGridRow` (`row.js`)** |
| count | ~dozens | up to N data rows |
| owns while mounted | its cell elements + header cell | its **row element** + cells + `splitInto` group |
| the DOM element | pooled/windowed cells (`DataGridCell`, custom el.) | pooled/windowed **row — a *dumb* container** (`<komp-datagrid-row>`/`div role=row`, **not** a `KompElement`) |
| public role | column reference | **row handle** (`row.element` is `null` when off-screen) |

Why the row element is *dumb*: all row behavior (mount, measure, render cells, reposition, manage the group)
lives on the `DataGridRow` controller, so its DOM node needs no `KompElement` machinery — `createElement`, no
lifecycle reactions, no per-instance attribute getter/setters. Strictly lighter than today's
`TableRow extends KompElement`. Cells, by contrast, stay custom elements (`DataGridCell`) — they render content
and the future Spreadsheet needs cell behavior. **Rows are the DOM grouping; columns are geometry-only**
(template tracks, not containers) — same asymmetry as Table today.

DataGrid owns its own, self-contained component family — no imports from `lib/komps/table/`:

| Module | Responsibility |
|---|---|
| `datagrid.js` | The component. **Owns `this.rows`** (the ordered array of `DataGridRow` controllers) + `appendRow`/`removeRow`/`sort` collection ops — mirroring how `Table` owns `this.columns` with no separate model class. Render loop, layout CSS, cell-walking APIs, frozen panes, event surface. |
| `column.js` | `DataGridColumn` (standalone, plain class). Column config (`width`, `frozen`, `index`, `splitInto`, `header`, `render`/`value`), `cellHandles`/`cellAt(rowIndex)`, mounted-cell tracking. Owns `columnTypeRegistry` ({ default }). |
| `row.js` | `DataGridRow` (standalone, plain **controller** class — mirrors `DataGridColumn`, **not** `TableRow`). One per **data row**, persistent; serves as the **row handle**. **Owns its measured `height`** (`null` until measured — mirrors how `DataGridColumn` owns `width`); also `index`, `record`, `readonly?`; references its **dumb pooled row element** as `row.element` (`null` off-screen). Behavior: `mount`/`unmount`/`recycle`, `measure` (reads the element → sets `this.height` → notifies `row-geometry` to re-index), render this row's cells, reposition via `translateY`, manage the `splitInto` group. The cumulative `offset` is *read from* `row-geometry` (which indexes `row.height`); not stored here. Static surface like `DataGridColumn`: `static Cell`/`Group`, `assignableAttributes`. |
| `cell.js` | `DataGridCell` (standalone `KompElement`). `render()` via `column.render(record)`; positioning/lifecycle owned by the windower (no subgrid self-placement); `rowIndex` assigned at mount from its `DataGridRow`. |
| `header-cell.js` / `header.js` / `group.js` | DataGrid's own header, header-cell, and `splitInto` group elements. |
| `row-geometry.js` | Y-axis index over `row.height` (held on each `DataGridRow`): cumulative `offsetAt(i)`, `indexAtOffset(y)` (binary search, the windowing hit-test), `totalHeight`, plus `update(i)`/`invalidateFrom(i)` when a height changes or `this.rows` splices/sorts. Uses a configured estimate where `row.height` is still `null`. Start as a prefix-sum array behind this interface; swap to a Fenwick tree only if huge datasets make the O(n) update show up in a profile. Symmetric with `column-geometry` (see below); the differences — incremental Fenwick vs naive recompute, and the measurement feedback — are scale/observation concerns, not naming-level ones. |
| `viewport.js` | Owns the bounded scroller (the DataGrid element). `scroll` + `ResizeObserver` → `[firstVisible, lastVisible]` from `row-geometry` + overscan buffer. |
| `windower.js` | Diffs desired vs mounted range; mounts/unmounts rows; positions via `transform: translateY(offset)`; sizes a `komp-datagrid-sizer` so the native scrollbar matches `totalHeight`. **Pools and recycles row/cell elements** (see §1.1) rather than `new`/`remove` per scroll tick. |
| `cell-handle.js` | `CellHandle { rowIndex, cellIndex, column, record, get value(), get element() }` — a **transient, computed-on-demand** projection, **never stored** (see §1.1). `value` from `column.value(record)`/`render`; `element` resolves to the live cell iff its row is mounted, else `null` (it does **not** materialize one). |
| `column-geometry.js` | X-axis index over `column.width` (held on each `DataGridColumn`, or a configured default): cumulative x-offset per column + total width, and left-frozen sticky offsets. Few columns → naive whole-array recompute on column change; no measurement (widths are known config). Symmetric with `row-geometry`. |

### 1.1 One source of truth, two projections (memory model)

There is exactly **one** stored source of truth — the `DataGridRow` controllers in `this.rows` (each holding a
`record`) + `row-geometry` + the column collection. Everything else is a *projection* of it, with a deliberate
lifetime:

- **`CellHandle` — logical, computed on demand, never persisted.** Handles are built from
  `(this.rows[i], column)` only when `at()`/`slice()`/`cells()`/`queryCells()` is called, then discarded.
  We do **not** keep a handle per cell: at 50k×30 that would be 1.5M objects — precisely the OBJECT-heap
  bloat (issue: ~120 MB / 1.65M tiny objects) virtualization exists to delete. Computing them lazily keeps
  steady-state memory ~flat with dataset size.
- **`DataGridCell` (element) — physical, windowed only.** A real `HTMLElement` exists *only* for rows
  currently in the window. We never extend `Element` for the logical/handle layer: an `HTMLElement`
  subclass is never lightweight even when detached (engine-backed DOM node + custom-element constructor:
  attribute getter/setters, method binding, `adoptedStyleSheets`, prototype/reaction machinery — the
  issue's DOMNODE bucket + ~259k `js::GetterSetter`). Materializing one per cell, attached or not, recreates
  the cost we're removing. So `handle.element` returns the live cell when mounted and `null` otherwise — it
  never allocates.

**Element pooling.** Constructing/destroying `DataGridCell`s on every scroll tick is wasteful, so `windower`
keeps a **pool of detached row/cell elements and recycles them** (rebind `record`/`column`, re-render, reposition)
as rows scroll in and out. This caps element construction at ~window-size for the grid's lifetime
(handsontable/ag-grid style) and avoids GC churn during fast scroll. Pool sizing tracks the window + overscan.

### Barrel export

Add to `lib/komps.js`: `export { default as DataGrid } from './komps/datagrid/datagrid.js';`. `Table`/
`Spreadsheet` exports unchanged.

---

## 2. Phase 1 — DataGrid core (read-only, windowed)

**Goal:** renders only the visible window; all public APIs stay total over the dataset via handles.

### 2.1 Layout / CSS (`datagrid.js` `static style`)
- No `subgrid`. DataGrid is `position: relative; overflow: auto;` with a required height (consumer sets
  `height`/`max-height`; dev warning if unbounded).
- Rows: `position: absolute; left: 0; transform: translateY(var offset); will-change: transform;` width =
  total columns width. Each row lays its cells out with explicit `grid-template-columns` from
  `column-geometry` (keeps `grid-column` spanning + groups working inside a row).
- A `komp-datagrid-sizer` of `height: totalHeight` drives the scrollbar.
- Left-frozen cells: `position: sticky; left: <geom offset>`; header sticky `top: 0`.

### 2.2 `this.rows` (DataGridRow controllers) is the source of truth
- `render()`: build `this.rows` (one `DataGridRow` per record) from `data`, render header, mount only the
  initial window; fire `rendered`. (Mirrors how `Table` builds `this.columns` — no separate model class.)
- Positions come from `row-geometry` + transforms — no `setTemplateRows`/`rowMutationObserver` analogue.
- `rows` → the `DataGridRow` controllers (each serves as the row handle; `row.element` is `null` off-screen);
  `mountedRows` filters to those currently windowed.
- `sortRows` → reorder `this.rows` + reassign offsets; re-window (no per-row `append`).
- `appendRow`/`removeRow`/splice → mutate `this.rows` + `row-geometry.invalidateFrom(i)`, then re-window.
  Preserve a `this.rendering` promise-chaining contract like `table.js:300-341`.

### 2.3 Cell-walking APIs → handles
- `cells`, `at`, `slice`, `queryCell`/`queryCells` computed from `this.rows` + `column-geometry`, returning
  `CellHandle`s. `element` is `null` off-screen. (Reimplement the group/`groupIndex` slice math fresh,
  referencing `table.js:482-524` for the rules.)
- `column.cells` holds **mounted** cells only; `column.cellHandles`/`cellAt` cover the full dataset.

### 2.4 Variable heights + groups
- On mount, the `DataGridRow` measures its (dumb) row element — `ResizeObserver`/post-mount — sets
  `this.height`, then calls `row-geometry.update(index)`; offsets below reflow and the sizer updates.
  Unmeasured rows (`row.height == null`) use a configured estimate that settles as they scroll in. Mitigate
  estimate→measure scroll jump with anchor-based scroll correction.
- **Reorder correctness:** because `height` lives on the `DataGridRow` (which travels with its `record`),
  `sortRows`/splice just reorders `this.rows` and re-sums `row-geometry` — heights follow their records with no
  re-measure. (If the height were keyed by slot index inside the index structure, a sort would mismatch heights
  to records until re-measured — the bug this ownership avoids. Columns dodge it for free: `width` is config on
  the `DataGridColumn`.)
- `splitInto`: a `DataGridRow` whose element holds a placeholder + `komp-datagrid-group` sub-rows is **one**
  controller/one measured unit; its measured height is the full stacked height. (Behavior modeled on
  `row.js:53-91`, reimplemented on the controller.)

### 2.5 Frozen columns (left only)
- Left-frozen via `column-geometry` sticky offsets. Keep a `frozen-divider` shadow affordance fed by geometry.

**Phase 1 exit:** 650×30 read-only DataGrid mounts ~window-size rows; `at`/`slice`/`cells` correct for
off-screen ranges; scroll perf flat; sort/splice + `rendered` intact.

---

## 3. Designing for the future `Spreadsheet extends DataGrid`

Editing is **out of scope for v1**, but DataGrid's v1 surface is shaped so a later
`Spreadsheet extends DataGrid` can replace today's `Spreadsheet extends Table` with minimal consumer churn.
Mirror the current Spreadsheet/Table contract:

- **Constructor options** to preserve on the future subclass: `data`, `columns`, `scrollSnap`, `readonly`
  (Spreadsheet `spreadsheet.js:56-59`), plus Table's `data`/`columns` (`table.js:47-50`). DataGrid should
  carry `data`/`columns` and leave room for `scrollSnap`/`readonly` semantics.
- **Events** DataGrid should declare (so the subclass inherits them, matching `table.js:58-68`):
  `headerChange`/`headerChanged`, `indexChange`/`indexChanged`, `widthChange`/`widthChanged`,
  `columnRemoved`, `columnsChanged`, `rendered`. The future Spreadsheet adds `invalidPaste`
  (`spreadsheet.js:70`); the resizable/reorderable plugins add `columnResize(d)`/`rowResize(d)`.
- **Column config / type registry** shaped like `TableColumn`'s so the future Spreadsheet can register
  editable types (select/number/checkbox/readonly) the same way (`spreadsheet.js:61-68`).
- **Cell lifecycle seams** the future editor needs: `column.value(record)` for copy, a mounted/unmounted
  hook, and `CellHandle` carrying `record`/`value` so model-driven selection + copy/paste over off-screen
  ranges is straightforward to layer on.

What the future Spreadsheet layer will own (not built now): range-based selection model, copy/paste,
keyboard nav + scroll-into-view on edit, outline rendering from geometry/offsets, and DataGrid-native
resizable/reorderable/collapsible (the current plugins are Table-DOM-coupled — `resizable.js:121-204`).

---

## 4. Compatibility

- **v1 is non-breaking.** `Table`/`Spreadsheet` and their element-returning `at`/`slice`/`cells` are
  unchanged. DataGrid is opt-in; only a new barrel export is added.
- **DataGrid-only requirements:** a bounded height, and explicit `width` per column (omitted → configured
  default). Document both; warn on unbounded height.
- DataGrid's `cells`/`at`/`slice`/`queryCells` return handles (`handle.element` may be `null`) — documented
  as the DataGrid contract, not a change to Table's.
- **Later (separate, planned):** replacing `Spreadsheet extends Table` with `Spreadsheet extends DataGrid`
  is a future breaking change for Spreadsheet consumers; handled when that work is scheduled, with the
  option-mirroring in §3 minimizing the blast radius.

---

## 5. Risks / watch-list

1. **Duplication with `table/`.** Accepted for v1 by decision; revisit after shipping. Keep DataGrid's
   column/cell/group code self-contained so a later extraction is mechanical, not archaeological.
2. **Future-proofing vs YAGNI.** §3 mirroring should stay to *naming/events/seams* — don't build editing
   scaffolding now.
3. **Variable-height jitter.** estimate→measure offset shifts → scroll jump; anchor-based correction.
4. **`splitInto`/group selection** math is subtle — reimplement `table.js:500-521` rules with targeted cases.
5. **Focus & a11y.** `role=grid` expects addressable cells; off-screen cells absent → set
   `aria-rowcount`/`aria-rowindex` from the model.
6. **Frozen + sticky + transform** stacking/`z-index` — re-verify the layered z-index ladder.
7. **Pooled-element state hygiene.** Recycled cells must fully reset on rebind — stale content, classes
   (`selected`/`frozen`), `data-*`, listeners, focus, and in-flight async renders from the previous record
   must not leak to the next. Define a `recycle(record, column, rowIndex)` reset path and key DOM diffing
   on row identity to avoid mismatches during fast scroll.

---

## 6. Validation (no behavior test harness — see `CLAUDE.md`)

- Demo page: 650×30 read-only DataGrid, with a counter showing mounted vs total rows.
- Manual matrix: scroll perf, off-screen `slice`/`at`, sort/splice, frozen-column sync, `splitInto` rows.
- Re-profile (Firefox heap snapshot) to confirm the `Document`-node layout cost (~109 MB in the Spreadsheet
  profile) is absent in DataGrid and steady-state nodes scale with the window, not the dataset.
