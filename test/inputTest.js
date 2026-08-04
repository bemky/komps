import Input from '../lib/komps/input.js';
import * as assert from 'assert';

describe('Input', function () {

    describe('dump', function () {
        it('sets dump to default function when not passed as param', function () {
            const input = Input.new('text', {
                target: { name: 'test' },
                attribute: 'name'
            })
            assert.equal(typeof input.dump, 'function')
            assert.equal(input.dump('hello'), 'hello')
        })

        it('uses custom dump when passed as param', function () {
            const input = Input.new('text', {
                target: { name: 'test' },
                attribute: 'name',
                dump: (v) => v.toUpperCase()
            })
            assert.equal(typeof input.dump, 'function')
            assert.equal(input.dump('hello'), 'HELLO')
        })
    })

    describe('extending assignableAttributes', function () {
        before(function () {
            Input.assignableAttributes.autosave = { type: 'boolean', default: false, null: false }
        })

        after(function () {
            delete Input.assignableAttributes.autosave
        })

        it('sets autosave to default when not passed as param', function () {
            const input = Input.new('text', {
                target: { name: 'test' },
                attribute: 'name'
            })
            assert.strictEqual(input.autosave, false)
        })

        it('accepts autosave when passed as param', function () {
            const input = Input.new('text', {
                target: { name: 'test' },
                attribute: 'name',
                autosave: true
            })
            assert.strictEqual(input.autosave, true)
        })
    })

    describe('load', function () {
        it('loads the target value', function () {
            const input = Input.new('text', {
                target: { name: 'test' },
                attribute: 'name'
            })
            assert.equal(input.input.value, 'test')
        })

        it('clears the input when the target value becomes nil', function () {
            const target = { name: 'test' }
            const input = Input.new('text', { target: target, attribute: 'name' })

            target.name = null
            input.targetChange()

            assert.equal(input.input.value, '')
        })

        it('keeps the value it was built with when the target has none', function () {
            const input = Input.new('text', {
                target: {},
                attribute: 'name',
                value: 'Untitled'
            })
            assert.equal(input.input.value, 'Untitled')
        })

        it('clears a checkbox by unchecking it, leaving its value alone', async function () {
            const target = { active: true }
            const input = Input.new('checkbox', { target: target, attribute: 'active' })
            await input.input._loading
            assert.equal(input.input.checked, true)

            input.clear()

            assert.equal(input.input.checked, false)
            assert.equal(input.input.value, 'on')
        })

        it('selects the blank option when the target value becomes nil', function () {
            const target = { size: 'large' }
            const input = Input.new('select', {
                target: target,
                attribute: 'size',
                includeBlank: { content: 'All' },
                options: ['small', 'large']
            })
            assert.equal(input.input.value, 'large')

            target.size = null
            input.targetChange()

            assert.equal(input.blankOption.selected, true)
            assert.equal(input.input.selectedIndex, 0)
        })

        it('deselects every option of a multiple select when the target value becomes nil', function () {
            const target = { sizes: ['small', 'large'] }
            const input = Input.new('select', {
                target: target,
                attribute: 'sizes',
                multiple: true,
                options: ['small', 'large']
            })

            input.clear()

            assert.equal(Array.from(input.input.options).filter(o => o.selected).length, 0)
        })
    })
})
