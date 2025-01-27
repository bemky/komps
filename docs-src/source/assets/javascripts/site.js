// depends_on ../../../../lib/**/*.js
import * as Komps from 'komps';
import { resizable, reorderable } from 'komps/plugins';
import { addEventListenerFor } from 'dolla';

Object.keys(Komps).forEach(funcName => {
    window[funcName] = Komps[funcName]
})
window.plugins = {
    resizable, reorderable
}

document.addEventListener('DOMContentLoaded', function () {
    addEventListenerFor(document, '.js-toggle-source', 'click', e => {
        document.querySelector(e.delegateTarget.getAttribute('rel')).classList.toggle('hide')
    })
})
