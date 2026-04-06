<p align="center">
    <a href="https://komps.js.org" style="display:block; max-width:300px;">
        <img src="https://raw.githubusercontent.com/bemky/komps/master/docs/source/assets/images/logo.svg" width="300" alt="Dolla">
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

Import only the components you use.
```javascript
import {Modal} from 'komps';

new Modal({content: "Hello World"});
```

## Documentation
Checkout details about each method on [komps.js.org](https://komps.js.org/)

## Development

### Testing
```bash
npm test
```

### Documentation
Documentation is built with [JSDoc](https://jsdoc.app/) and deployed to GitHub Pages via GitHub Actions on push to main.

```bash
npm run docs          # build once
npm run docs:watch    # rebuild on changes
npm run docs:serve    # serve locally
```

### Release
```bash
npm publish
```