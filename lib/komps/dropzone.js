/*
Description
----
A container that handles drag/drop events

Example
----
<div class="pad-2x text-center"></div>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelector('div').append(new Dropzone({
            content: {
                content: 'Drag Something Here',
                class: 'height-100-px width-200-px flex justify-content-center align-center bg-gray-10  border-2px border-dashed'
            }
        }))
    })
</script>

Options
----
overlay:
    description: layer to render over dropzone when drag happens on window
    types: Function, HTMLElement, Object
    default: Drag Here
onDrop:
    description: callback for drop action
    types: Function(`File`)
    default: null
enabled:
    description: setup events
    types: Boolean
    default: true

Methods
----
enabled:
    arguments: none
    description: sets up events
disabled:
    arguments: none
    description: tears down events
*/

import { css, createElement } from 'dolla';
import KompElement from './element.js';

export default class Dropzone extends KompElement {
    static tagName = "komp-dropzone"
    
    static assignableAttributes = {
        enabled: true,
        onDrop: null,
        overlay: {
            content: 'Drag Here'
        }
    }
    
    static bindMethods = ['windowDragEnter', 'windowDragLeave', 'windowDrop', 'drop', 'dragOver', 'dragEnter', 'dragLeave']
    
    constructor (...args) {
        super(...args)

        if (typeof this.overlay == "object" && !(this.overlay instanceof HTMLElement)) {
            this.overlay = createElement('komp-dropzone-overlay', Object.assign({}, this.constructor.assignableAttributes.overlay, this.overlay))
        }
    }
    
    addEventListeners () {
        if (this.getRootNode()) {
            this.getRootNode().addEventListener('dragenter', this.windowDragEnter);
            this.getRootNode().addEventListener('dragleave', this.windowDragLeave);
            this.getRootNode().addEventListener('drop', this.windowDrop);
        }
        this.addEventListener('drop', this.drop)
        this.addEventListener('dragover', this.dragOver)
        this.addEventListener('dragenter', this.dragEnter)
        this.addEventListener('dragleave', this.dragLeave)
    }
    
    removeEventListeners () {
        if (this.getRootNode()) {
            this.getRootNode().removeEventListener('dragenter', this.windowDragEnter);
            this.getRootNode().removeEventListener('dragleave', this.windowDragLeave);
            this.getRootNode().removeEventListener('drop', this.windowDrop);
        }
        this.removeEventListener('drop', this.drop)
        this.removeEventListener('dragover', this.dragOver)
        this.removeEventListener('dragenter', this.dragEnter)
        this.removeEventListener('dragleave', this.dragLeave)
    }
    
    connected () {
        if (css(this, 'position') == "static") {
            this.style.position = 'relative';
        }
        if (this.enabled) {
            this.addEventListeners()
        }
    }
    disconnected () {
        if (this.enabled) {
            this.removeEventListeners()
        }
    }
    
    enable () {
        if (this.enabled) { return }
        this.enabled = true
        this.addEventListeners()
    }
    
    disable () {
        if (this.enabled == false) { return }
        this.enabled = false
        this.removeEventListeners()
    }
    
    /*
        This Events
    */
    
    drop (e) {
        if (e.target == this) {
            e.preventDefault();
            ([...e.dataTransfer.files]).forEach(file => {
                if (this.onDrop) { this.onDrop(file) }
                this.trigger('drop', file)
            });
        }
        
    }
    
    dragEnter (e) {
        e.preventDefault()
        this.overlay.classList.add('active');
    }
    
    dragLeave (e) {
        e.preventDefault()
        this.overlay.classList.remove('active');
    }
    
    dragOver (e) {
        e.preventDefault();
    }
    
    /*
        Window Events
    */
    
    windowDragEnter (e) {
        e.preventDefault();
        if (!e.relatedTarget || e.relatedTarget.getRootNode() != this.getRootNode()) {
            this.overlay.classList.remove('active');
            this.append(this.overlay);
        }
    }
    
    windowDragLeave (e) {
        e.preventDefault();
        if (!e.relatedTarget || e.relatedTarget.getRootNode() != this.getRootNode()) {
            this.overlay.remove()
        }
    }
    
    windowDrop (e) {
        e.preventDefault();
        this.overlay.remove()
    }
    
    static style = `
        komp-dropzone {
            display: inline-block;
        }
        komp-dropzone-overlay {
            display: flex;
            position:absolute;
            inset: 0;
            border: 2px dashed blue;
            background: rgba(255,255,255, 0.5);
            backdrop-filter: blur(2px);
            z-index:2;
            color: blue;
            font-weight: bold;
            align-items: center;
            justify-content: center;
            pointer-events: none;
        }
        komp-dropzone-overlay.active {
            background: rgba(0,0,0, 0.3);
            color: black;
        }
    `
}
window.customElements.define(Dropzone.tagName, Dropzone);