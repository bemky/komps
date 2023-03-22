// depends_on ../../../../lib/*.js
import {Modal} from 'komps';


document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.js-launch-modal').addEventListener('click', e => {
        new Modal({
            content: "Hello World"
        }).render()
    })
})
