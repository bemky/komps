import Form from '../lib/komps/form.js';
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
})
