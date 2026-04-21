# Changelog

## 1.5.0

### New Components

- **SearchField** — Search input with result rendering and empty/loading states
- **Resizer** — Overlay element with drag handles for resizing/moving a target, with optional bounds and autohide. Integrates with AutoGrid

### New Features

- **Attribute schema** — `assignableAttributes` supports a new object schema format (`{ type, default, null, load }`). Serializable types (`string`, `number`, `boolean`) are automatically reflected to/from DOM attributes, enabling HTML-first usage and element cloning (#2)
- **CSS layer isolation** — Component styles are wrapped in `@layer komps` via `adoptedStyleSheets`. Configurable per-component via `static styleLayer` (set to `false` to disable)
- **JSDocs** — Full JSDoc documentation with demo pages for components (#3)
- **Attribute serialization on connect** — Elements serialize attributes in `connected` for HTML-first usage
- **Input** — Adopts the element-style attribute assignment
- **ContentArea** — `content` is now an assignable attribute

### Breaking Changes

Most changes are backward-compatible with deprecation warnings (see **Deprecations** below), but these behavior changes may require attention:

- **CSS precedence shifted** — Component styles now live inside `@layer komps`. Application styles *outside* any `@layer` now beat component styles automatically (CSS layering rules). If you were relying on specificity or `!important` to override component styles, this should "just work" now — but if your application styles were themselves inside a named layer declared *before* `komps`, your overrides may no longer apply. Opt out per-component with `static styleLayer = false`.
- **Serializable attributes auto-reflect to the DOM** — For attributes with `type: 'string' | 'number' | 'boolean'`, setting the JS property now calls `setAttribute` / `toggleAttribute` automatically. Code that inspects `element.attributes` or relies on an attribute being absent may behave differently.
- **Floater `anchor` coercion timing** — String-selector → element resolution now happens when `anchor` is set (via the schema's `load` hook) rather than during `initialize()`. Subclasses that read `this.anchor` before `connectedCallback` will now see the resolved `Element` instead of the raw string.

### Deprecations (still work, emit console warnings)

- `assignableAttributes` array format (`= ['foo', 'bar']`) — migrate to object schema
- `assignableAttributes` direct-value format (`= { foo: null }`) — migrate to object schema
- Setting attribute values via `data-*` HTML attributes — set them directly on the element
- `Input` option `record` — use `target` instead

### Fixes

- Fix `Floater.computePosition` crash when the arrow locator is missing between autoUpdate ticks, and fix a typo that set the arrow's `top` to the `x` coordinate (#27)
- Fix deprecated uses of `Input.record`
- Fix `Input` not assigning attributes correctly
- Fix `NotificationCenter` timeout issue
- Fix `renderStyle` being invoked twice when pushing adopted stylesheets
