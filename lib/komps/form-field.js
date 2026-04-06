/**
 * Base class for form-associated custom elements. Extends {@link KompElement}
 * with {@link https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals ElementInternals}
 * support for native form participation, validation, and submission.
 *
 * @class FormField
 * @extends KompElement
 *
 * @example
 * class MyInput extends FormField {
 *     static tagName = 'my-input'
 *     static { this.define() }
 * }
 */

import KompElement from './element.js';

export default class FormField extends KompElement {
    static tagName = 'komp-form-field'
    static formAssociated = true

    constructor(attrs={}) {
        super(attrs)
        this._internals = this.attachInternals()
    }

    /** The form this element is associated with, if any */
    get form() { return this._internals.form }

    /** The ValidityState of this element */
    get validity() { return this._internals.validity }

    /** The validation message for this element */
    get validationMessage() { return this._internals.validationMessage }

    /**
     * Set the form value for this element
     * @param {*} value - the value to submit with the form
     */
    setFormValue(value) {
        this._internals.setFormValue(value)
    }

    /**
     * Set the validity of this element
     * @param {Object} flags - ValidityStateFlags object
     * @param {string} [message] - validation message
     * @param {HTMLElement} [anchor] - element to anchor validation UI to
     */
    setValidity(flags, message, anchor) {
        this._internals.setValidity(flags, message, anchor)
    }

    /**
     * Check validity without showing UI
     * @returns {boolean}
     */
    checkValidity() {
        return this._internals.checkValidity()
    }

    /**
     * Check validity and show browser validation UI if invalid
     * @returns {boolean}
     */
    reportValidity() {
        return this._internals.reportValidity()
    }

    /**
     * Called when the associated form is reset. Override in subclasses.
     */
    formResetCallback() {
        // subclasses override to handle form reset
    }

    /**
     * Called when the browser restores form state. Override in subclasses.
     * @param {*} state - the restored state
     * @param {string} mode - 'restore' or 'autocomplete'
     */
    formStateRestoreCallback(state, mode) {
        // subclasses override to handle form state restore
    }
}
