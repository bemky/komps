import Form from '../lib/komps/form.js';
import Input from '../lib/komps/input.js';
import * as assert from 'assert';

describe('Form', function () {

    describe('submit with preventDefault', function () {
        it('does not call target.save when onSubmit prevents default', async function () {
            let saveCalled = false
            let listenerCalled = false
            const target = {
                name: 'test',
                save: () => { saveCalled = true }
            }

            const form = Form.create(target, {
                content: f => [
                    f.text('name')
                ],
                onSubmit: (e) => {
                    listenerCalled = true
                    e.preventDefault()
                }
            })

            document.body.append(form)
            form.dispatchEvent(new CustomEvent('submit', {
                bubbles: true,
                cancelable: true
            }))

            assert.strictEqual(saveCalled, false, 'target.save should not be called when preventDefault is used')
            assert.ok(listenerCalled)
        })
    })

    describe('registered input types', function () {
        class Swatch extends HTMLElement {
            get value () { return this._value ?? '' }
            set value (v) { this._value = v }
        }
        customElements.define('test-form-swatch', Swatch)

        beforeEach(function () { Input.register('swatch', Swatch) })
        afterEach(function () { Input.unregister('swatch') })

        it('builds a registered type through input() and a shortcut', function () {
            const target = { color: 'red' }
            const form = new Form(target)
            const viaInput = form.input('color', { type: 'swatch' })
            const viaShortcut = form.swatch('color')
            assert.ok(viaInput instanceof Swatch)
            assert.ok(viaShortcut instanceof Swatch)
            assert.equal(viaShortcut.value, 'red')
        })

        it('does not overwrite Form methods with a registered type', function () {
            Input.register('label', Swatch)
            try {
                const form = new Form({})
                assert.equal(form.label('name').tagName, 'LABEL')
            } finally {
                Input.unregister('label')
            }
        })
    })
})
