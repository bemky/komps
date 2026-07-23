# Changelog

## Unreleased

### New Features

- **Row-level readonly** — `TableRow` accepts a `readonly` function (called with the record) and a new `renderCell(column, record, options)` method that resolves it per-record before delegating to `column.renderCell`. `Spreadsheet` exposes a matching `readonly` attribute and forwards it to each row, so a single `readonly: record => record.archived` declaration makes all cells in matching rows non-editable. `Table.renderRow` now accepts an optional `attrs` object that is spread into the row's construction options (#28).
- **SearchField default results** — `SearchField` accepts a `defaultResults` option (Array or async function) shown when the query is below `minLength`, including on focus before the user has typed. Items have the same shape as those returned from `search`, so `result` and `select` apply unchanged. Async functions are resolved once and cached on the instance.
- **DataSpreadsheet programmatic focus** — `DataSpreadsheet.focusCellAt(col, row)` is now the public entry point for focusing a cell: it makes the cell active, collapses the selection onto it (clearing any copy marquee), scrolls it into view, focuses it, and returns the cell element. Previously this sequence was inlined across the `mousedown`, contextmenu, and arrow/Tab paths. The argument order matches `DataGrid.at(col, row)`.

### Bug Fixes

- **Spreadsheet cell render after unmount** — The editing floater's `onHidden` handler awaits any `session.hold`-registered promise (e.g. an async save) before re-rendering the cell. If the grid recycled that cell in the meantime — windowed scroll, sort, or splice, none of which check `_editing` — `cell.column` had already been nulled by `unmount()`, and `cell.render()` crashed with `TypeError: can't access property "unnest", column is null`. `onHidden` now skips the re-render if the cell was unmounted while the hold promise was pending.
- **Component registration ordering** — Moved every `static { this.define() }` block to the end of its class body, so `customElements.define` always runs after every other static field initializer. Without this, a pre-existing element in the DOM at script load could trigger a constructor on a class whose `assignableAttributes` (and other statics like `observer`) haven't initialized yet. Documented the requirement on `KompElement.define`'s JSDoc and in `CLAUDE.md` so subclasses follow the same pattern.
- **`scanPrototypesFor` cache invalidation** — Cache entries now invalidate when the constructor's own-property status for a key flips. Without this, an instance constructed during class initialization (e.g. when `customElements.define` upgrades a pre-existing element before the subclass's `static <key> = ...` field has run) would lock in a result missing the subclass's own value, and every subsequent instance would inherit the wrong merged metadata.
- **Floater arrow alignment** — The arrow now centers on its anchor. floating-ui measures the square `komp-floater-arrow-locator` and returns the cross-axis edge offset, but the visible `:after` was rendered at twice `--arrow-size` with centering math that left it half an arrow-width off (and clamped against the wrong width near the floater edges). The locator and arrow now share a single `--arrow-inset`/`--arrow-size`, and all four placements are handled with logical properties plus `writing-mode`.

### Breaking Changes

- **Legacy `Table` and `Spreadsheet` removed; `DataSpreadsheet` renamed to `Spreadsheet`** — the non-virtualized `Table` and its editable `Spreadsheet` subclass are gone, along with their sub-components (`lib/komps/table/`, `lib/komps/spreadsheet/`) and the Table-based plugins under `lib/komps/table/plugins/`. The surviving components are the virtualized `DataGrid` and its editable subclass, which is now named **`Spreadsheet`** (was `DataSpreadsheet`). Migration: replace `Table` → `DataGrid` (`komps/table` → `komps/data-grid`; note `DataGrid` requires a bounded height and its plugins are opt-in via `.include()`), and `DataSpreadsheet` → `Spreadsheet` (`komps/data-spreadsheet` → `komps/spreadsheet`; custom element `komp-data-spreadsheet` → `komp-spreadsheet`, cells `komp-data-spreadsheet-cell` → `komp-spreadsheet-cell`). The `komps/plugins` barrel and `komps/data-grid/plugins` now both re-export the DataGrid plugins (`resizable`, `reorderable`, `collapsible`). A new `komps/data-grid` subpath export was added.

- **Tooltip auto-wiring removed** — `new Tooltip({ anchor, content })` no longer attaches mouseenter/mouseleave/focus/blur/keydown listeners to the anchor. The `enable()` / `disable()` methods and the `enabled` option are removed. Use `Tooltip.delegate(container, defaults)` to install a single delegated listener that shows tooltips for any descendant with `data-tooltip` (or `title`, which is stripped to suppress the native browser tooltip). Per-element options are read from `data-tooltip-*` attributes.

## 2.0.0-alpha.1

### New Components

- **SearchField** — Async search input with debounced queries, keyboard navigation, result rendering, empty/loading states, and inline or floater display modes
- **Resizer** — Overlay element with drag handles for resizing and moving a target element, with optional bounds constraints and autohide. Integrates with AutoGrid
- **Select** — Custom `komp-select` dropdown with button UI, keyboard navigation, and form association via FormField (#5)
- **FormField base class** — New `FormField` extends `KompElement` with ElementInternals API support (`setFormValue`, `setValidity`, `checkValidity`, `reportValidity`). Components needing form participation extend this instead of KompElement (#17)

### New Features

- **Attribute schema** — `assignableAttributes` now uses an object schema format (`{ type, default, null, load }`) replacing the old array/direct-value format. Attributes with serializable types (`string`, `number`, `boolean`) are automatically reflected to/from DOM attributes, enabling HTML-first usage and element cloning (#2)
- **CSS layer isolation** — Component styles are wrapped in `@layer komps` via `adoptedStyleSheets` so they don't override application styles. Configurable via `static styleLayer`
- **Exports map** — Package.json exports map enables deep imports (e.g., `import Dropdown from 'komps/dropdown'`) with full bundler resolution (#20)
- **ARIA attributes** — Added `role`, `aria-expanded`, `aria-modal`, `aria-live`, `aria-labelledby`, `aria-describedby`, and `aria-haspopup` across Modal, Dropdown, Tooltip, Table, NotificationCenter, Select, ContentArea, and Dropzone (#15)
- **Keyboard navigation** — Dropdown: arrow keys, Enter/Space toggle. Modal: focus trap with Tab/Shift+Tab, Escape to close, focus restore. Tooltip: show on focus, hide on blur, Escape to dismiss (#16)
- **Number column improvements** — `toLocaleString()` rendering, `[type]-cell` class on cells/headers, `text-align: right` for `.number-cell` in spreadsheet (#6)
- **JSDocs** — Full JSDoc documentation with demo pages for all components (#3)

### Improvements

- **Table/AutoGrid performance** — Table uses DocumentFragment for batched DOM insertion (N reflows → 1). AutoGrid separates read/write phases in `resize()` to avoid layout thrashing (#18)
- **Tree-shaking support** — Components no longer self-register at import time. Call `Component.define()` explicitly. `define()` recursively registers composed sub-components (e.g., `Table.define()` also registers Row, Header, Cell). Added `sideEffects` field to package.json (#22)
- **Signature migration warnings** — Event listeners bound via constructor options are checked at bind time. Warns if `fn.length > 1` (old multi-arg callback signature) or if a single-arg listener's parameter isn't named `e` or `event`

### Breaking Changes

#### Attribute schema format

`assignableAttributes` changed from array or direct-value format to object schema:

```js
// Old
static assignableAttributes = ['anchor', 'placement']
// or
static assignableAttributes = { placement: 'bottom' }

// New
static assignableAttributes = {
    anchor: { type: 'HTMLElement', default: null, null: true },
    placement: { type: 'string', default: 'bottom', null: false }
}
```

The old formats still work but emit a deprecation warning (#2).

#### Event naming: verb tense replaces before/after prefixes (#23)

Pre-action events use present tense (cancellable via `preventDefault()`), post-action events use past tense:

| Old | New (pre-action) | New (post-action) |
|-----|-------------------|-------------------|
| `beforeConnect` / `afterConnect` | `connect` | `connected` |
| `beforeDisconnect` / `afterDisconnect` | `disconnect` | `disconnected` |
| `beforeRemove` / `afterRemove` | `remove` | `removed` |
| `beforeSubmit` / `afterSubmit` (Form) | — | `submitted` |
| `afterRender` (Table) | — | `rendered` |
| `columnReorder` / `rowReorder` | — | `columnReordered` / `rowReordered` |
| `columnResize` / `rowResize` | — | `columnResized` / `rowResized` |
| `filedrop` (Dropzone) | — | `fileDrop` (camelCase) |

Constructor option names change accordingly (e.g., `onBeforeConnect` → `onConnect`, `onAfterConnect` → `onConnected`).

#### Pre-action events are now cancellable

Calling `preventDefault()` on `connect`, `disconnect`, `remove` (KompElement), `show`, `hide` (Floater), `resize` (Resizer), `headerChange`, `indexChange`, `widthChange` (Table/Column) will cancel the default behavior and skip the post-action event. For Form, call `preventDefault()` in the `onSubmit` listener to prevent `target.save()` and the `submitted` event.

#### Floater: new show/hide event pairs, onShow/onHide attributes removed

- New cancellable events: `show` (pre-action), `shown` (post-action), `hide` (pre-action), `hidden` (post-action)
- `onShow` and `onHide` assignable attributes removed. Use event listeners: `onShow` (for `show` event), `onShown`, `onHide`, `onHidden`

#### Callbacks migrated to event system

| Component | Old (assignable attribute) | New (event listener) | Event detail |
|-----------|---------------------------|----------------------|-------------|
| ContentArea | `onchange(value, was)` | `onChange` event | `e.detail.value`, `e.detail.was` |
| Dropzone | `onFileDrop(file)` | `onFileDrop` event | `e.detail.file` |

#### TableColumn: assignableMethods → cancellable events on Table

`headerChanged`, `indexChanged`, `widthChanged` removed from `assignableMethods`. Now fire cancellable event pairs on the parent Table element:

| Old (assignableMethod) | New pre-action event | New post-action event | Event detail |
|------------------------|---------------------|-----------------------|-------------|
| `headerChanged(was, now)` | `headerChange` | `headerChanged` | `e.detail.column`, `e.detail.was`, `e.detail.now` |
| `indexChanged(was, now)` | `indexChange` | `indexChanged` | `e.detail.column`, `e.detail.was`, `e.detail.now` |
| `widthChanged(was, now)` | `widthChange` | `widthChanged` | `e.detail.column`, `e.detail.was`, `e.detail.now` |

#### Component registration

Components no longer self-register via `customElements.define()` at import time. Call `Component.define()` explicitly, or import the barrel file which registers all components (#22).

#### Form no longer dispatches a custom `submit` event

Form no longer dispatches a cancelable `submit` event before saving. Instead, the `onSubmit` listener fires before `target.save()`. Call `event.preventDefault()` in the `onSubmit` listener to prevent saving and the `submitted` event.
