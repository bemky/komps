# komps

Komps is a library of javascript components and elements for building a UI. Komps is platform-agnostic, with each component is fully tree-shakeable by an bundler.

## Dependencies
[Dolla](https://dollajs.com)


## Installation

    npm install komps

## Usage

Import only the methods you use.
```javascript
import {Modal} from 'komps';

new Modal({content: "Hello World"});
```

## Documentation
Checkout details about each method on [todo.tld](http://todo.tld)

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