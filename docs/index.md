# Komps

Komps is a library of style-less [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) for building UIs. Komps is platform-agnostic, and each component is fully tree-shakeable by any bundler.

## Installation

```bash
npm install komps
```

## Usage

Import only the components you use:

```javascript
import { Modal } from 'komps';

new Modal({ content: "Hello World" });
```
