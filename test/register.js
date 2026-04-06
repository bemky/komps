import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
import jsdom from 'jsdom';

const { JSDOM } = jsdom;

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost',
    pretendToBeVisual: true
});

global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.customElements = dom.window.customElements;
global.Element = dom.window.Element;
global.Node = dom.window.Node;
global.NodeList = dom.window.NodeList;
global.getComputedStyle = dom.window.getComputedStyle;
global.MutationObserver = dom.window.MutationObserver;
global.CustomEvent = dom.window.CustomEvent;
global.Event = dom.window.Event;
global.HTMLCollection = dom.window.HTMLCollection;
global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};
global.IntersectionObserver = class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};
global.CSSStyleSheet = class CSSStyleSheet {
    constructor() { this.id = null }
    replaceSync() {}
};

if (!document.adoptedStyleSheets) {
    Object.defineProperty(document, 'adoptedStyleSheets', {
        value: [],
        writable: true
    });
}

// Register the custom loader for extensionless imports
register('./test/loader.js', pathToFileURL('./'));
