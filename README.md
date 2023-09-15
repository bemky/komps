<p align="center">
    <a href="https://bemky.github.io/komps/" style="display:block; max-width:300px;">
        <img src="https://raw.githubusercontent.com/bemky/komps/master/docs-src/source/assets/images/logo.svg" width="300" alt="Dolla">
    </a>
    <p align="center">
        Komps is a library of javascript style-less components and elements for building a UI. Komps is platform-agnostic, with each component is fully tree-shakeable by an bundler.
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

Import only the components you use.
```javascript
import {Modal} from 'komps';

new Modal({content: "Hello World"});
```

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