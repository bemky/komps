/**
 * A container that handles drag/drop events
 *
 * @class Dropzone
 * @extends KompElement
 *
 * @param {Object} [options={}]
 * @param {function|HTMLElement|Object} [options.overlay] - layer to render over dropzone when drag happens on window
 * @param {function} [options.onFileDrop=null] - callback for drop action, receives `File`
 * @param {boolean} [options.enabled=true] - setup events
 *
 * @fires Dropzone#filedrop
 *
 * @example <caption>JS</caption>
 * new Dropzone({
 *     onFileDrop: console.log,
 *     content: {
 *         content: 'Drag Something Here',
 *         class: 'border-2px border-dashed'
 *     }
 * })
 */

/**
 * Fired for each file dropped onto the dropzone
 * @event Dropzone#filedrop
 * @type {File}
 */

import { css, createElement } from 'dolla';
import KompElement from './element.js';

export default class Dropzone extends KompElement {
    static tagName = "komp-dropzone"
    
    static assignableAttributes = {
        enabled: { type: 'boolean', default: true, null: false },
        onFileDrop: { type: 'function', default: null, null: true },
        dragHereOverlay: { type: ['object', 'HTMLElement'], default: { class: 'drag-here', content: 'Drag Here' }, null: false },
        dragOverOverlay: { type: ['object', 'HTMLElement'], default: { class: 'drag-over', content: 'Drop Here' }, null: false }
    }
    
    static bindMethods = ['windowDragEnter', 'windowDragLeave', 'windowDrop', 'drop', 'dragOver', 'dragEnter', 'dragLeave']
    
    constructor (options={}, ...args) {
        super(options, ...args)
        
        if (options.overlay) {
            console.warn("Dropzone.overlay option is deprecated use dragHereOverlay and/or dragOverOverlay")
            if (!options.dragHereOverlay) this.dragHereOverlay = options.overlay
            if (!options.dragOverOverlay) this.dragOverOverlay = options.overlay
        }
        
        if (typeof this.dragHereOverlay == "object" && !(this.dragHereOverlay instanceof HTMLElement)) {
            this.dragHereOverlay = createElement('komp-dropzone-overlay', Object.assign({}, this.constructor.assignableAttributes.dragHereOverlay.default, this.dragHereOverlay))
        }
        if (typeof this.dragOverOverlay == "object" && !(this.dragOverOverlay instanceof HTMLElement)) {
            this.dragOverOverlay = createElement('komp-dropzone-overlay', Object.assign({}, this.constructor.assignableAttributes.dragOverOverlay.default, this.dragOverOverlay))
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
    
    /**
     * Set up drag/drop event listeners
     */
    enable () {
        if (this.enabled) { return }
        this.enabled = true
        this.addEventListeners()
    }
    
    /**
     * Tear down drag/drop event listeners
     */
    disable () {
        if (this.enabled == false) { return }
        this.enabled = false
        this.removeEventListeners()
    }
    
    /*
        This Events
    */
    
    drop (e) {
        if (e.target == this || this.contains(e.target)) {
            e.preventDefault();
            ([...e.dataTransfer.files]).forEach(file => {
                if (this.onFileDrop) { this.onFileDrop(file) }
                this.trigger('komp:filedrop', file)
            });
        }
        
    }
    
    dragEnter (e) {
        e.preventDefault()
        this.dragHereOverlay.remove()
        this.append(this.dragOverOverlay);
    }
    
    dragLeave (e) {
        e.preventDefault()
        if (!this.contains(e.relatedTarget)) {
            this.dragOverOverlay.remove()
            this.append(this.dragHereOverlay);
        }
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
            this.dragOverOverlay.remove()
            this.append(this.dragHereOverlay);
        }
    }
    
    windowDragLeave (e) {
        e.preventDefault();
        if (!e.relatedTarget || e.relatedTarget.getRootNode() != this.getRootNode()) {
            this.dragOverOverlay.remove()
            this.dragHereOverlay.remove()
        }
    }
    
    windowDrop (e) {
        e.preventDefault();
        this.dragOverOverlay.remove()
        this.dragHereOverlay.remove()
    }
    
    static style = `
        komp-dropzone {
            display: inline-block;
            position: relative;
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
        komp-dropzone-overlay.drag-over {
            background: rgba(0,0,0, 0.3);
            color: black;
        }
    `
}
window.customElements.define(Dropzone.tagName, Dropzone);