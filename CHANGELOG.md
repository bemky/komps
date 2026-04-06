# Changelog

## 1.0.0

### New Features

- **Select component** — New `komp-select` custom element with dropdown button UI, keyboard navigation, and form association via FormField (#5)
- **FormField base class** — New `FormField` extends `KompElement` with ElementInternals API support (`setFormValue`, `setValidity`, `checkValidity`, `reportValidity`). Components needing form participation extend this instead of KompElement (#17)
- **Exports map** — Package.json exports map enables deep imports (e.g., `import Dropdown from 'komps/dropdown'`) with full bundler resolution (#20)
- **ARIA attributes** — Added `role`, `aria-expanded`, `aria-modal`, `aria-live`, `aria-labelledby`, `aria-describedby`, and `aria-haspopup` across Modal, Dropdown, Tooltip, Table, NotificationCenter, Select, ContentArea, and Dropzone (#15)
- **Keyboard navigation** — Dropdown: arrow keys, Enter/Space toggle. Modal: focus trap with Tab/Shift+Tab, Escape to close, focus restore. Tooltip: show on focus, hide on blur, Escape to dismiss (#16)
- **Number column improvements** — `toLocaleString()` rendering, `[type]-cell` class on cells/headers, `text-align: right` for `.number-cell` in spreadsheet (#6)

### Improvements

- **Table/AutoGrid performance** — Table uses DocumentFragment for batched DOM insertion (N reflows → 1). AutoGrid separates read/write phases in `resize()` to avoid layout thrashing (#18)
- **Tree-shaking support** — Components no longer self-register at import time. Call `Component.define()` explicitly. `define()` recursively registers composed sub-components (e.g., `Table.define()` also registers Row, Header, Cell). Added `sideEffects` field to package.json (#22)
- **Signature migration warnings** — Event listeners bound via constructor options are checked at bind time. Warns if `fn.length > 1` (old multi-arg callback signature) or if a single-arg listener's parameter isn't named `e` or `event`

### Breaking Changes

#### Event naming: verb tense replaces before/after prefixes (#23)

Pre-action events use present tense (cancellable via `preventDefault()`), post-action events use past tense:

| Old | New (pre-action) | New (post-action) |
|-----|-------------------|-------------------|
| `beforeConnect` / `afterConnect` | `connect` | `connected` |
| `beforeDisconnect` / `afterDisconnect` | `disconnect` | `disconnected` |
| `beforeRemove` / `afterRemove` | `remove` | `removed` |
| `beforeSubmit` / `afterSubmit` (Form) | `submit` | `submitted` |
| `afterRender` (Table) | — | `rendered` |
| `columnReorder` / `rowReorder` | — | `columnReordered` / `rowReordered` |
| `columnResize` / `rowResize` | — | `columnResized` / `rowResized` |
| `filedrop` (Dropzone) | — | `fileDrop` (camelCase) |

Constructor option names change accordingly (e.g., `onBeforeConnect` → `onConnect`, `onAfterConnect` → `onConnected`).

#### Pre-action events are now cancellable

Calling `preventDefault()` on `connect`, `disconnect`, `remove` (KompElement), `show`, `hide` (Floater), `resize` (Resizer), `submit` (Form), `headerChange`, `indexChange`, `widthChange` (Table/Column) will cancel the default behavior and skip the post-action event.

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

#### Form internal method rename

`Form.onSubmit()` renamed to `Form.formSubmit()` to avoid collision with the `submit` event name.
