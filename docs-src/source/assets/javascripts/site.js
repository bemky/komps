// depends_on ../../../../lib/**/*.js
import * as Komps from 'komps';
import { addEventListenerFor } from 'dolla';

Object.keys(Komps).forEach(funcName => {
    window[funcName] = Komps[funcName]
})

document.addEventListener('DOMContentLoaded', function () {
    addEventListenerFor(document, '.js-toggle-source', 'click', e => {
        document.querySelector(e.delegateTarget.getAttribute('rel')).classList.toggle('hide')
    })
})
