// depends_on ../../../../lib/**/*.js
import { Modal, Floater } from 'komps';
import { addEventListenerFor } from 'dolla';


document.addEventListener('DOMContentLoaded', function () {
    addEventListenerFor(document, '.js-toggle-source', 'click', e => {
        document.querySelector(e.delegateTarget.getAttribute('rel')).classList.toggle('hide')
    })
})
