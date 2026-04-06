<p align="center">
    <a href="https://komps.js.org" style="display:block; max-width:300px;">
        <img src="https://raw.githubusercontent.com/bemky/komps/master/docs-src/source/assets/images/logo.svg" width="300" alt="Dolla">
    </a>
    <p align="center">
        Komps is a library of style-less Web Components for building UIs. Komps is platform-agnostic, and each component is fully tree-shakeable by any bundler. 
        <a href="https://komps.js.org/">
            Documentation
        </a>
    </p>
</p>


## Dependencies
[Dolla](https://dollajs.com)

[Floating UI](https://floating-ui.com/)


## Installation

    npm install komps

## Usage

```javascript
import { Modal } from 'komps';

new Modal({ content: "Hello World" });
```

### Tree-Shaking

For smaller bundles, import components directly instead of from the barrel:

```javascript
import Modal from 'komps/modal';
import Table from 'komps/table';
```

Each component self-registers as a custom element when imported. Sub-components (e.g., TableRow, TableCell) are registered automatically through the import chain — no extra setup needed.

## Documentation
Checkout details about each method on [komps.js.org](https://komps.js.org/)

## Development
### Testing
    TODO
### Documenation
#### Develope
    cd docs-src
    be middleman server
#### Build
    cd docs-src
    be middleman build
### Release
    npm publish