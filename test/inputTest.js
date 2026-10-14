import Input from '../lib/komps/input.js';
import FormField from '../lib/komps/form-field.js';
import { createElement } from 'dolla';
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

    describe('register', function () {
        let ColorField

        before(function () {
            ColorField = class extends FormField {
                static tagName = 'test-color-field'
                static { this.define() }
                get value () { return this._value ?? '' }
                set value (v) { this._value = v }
            }
        })

        afterEach(function () {
            Input.unregister('color')
        })

        it('registers an Input subclass and uses it as-is', function () {
            class StarInput extends Input {
                createInput (options) { return createElement('span', { id: options.id }) }
                _load () {}
            }
            Input.register('star', StarInput)
            try {
                const input = Input.new('star', { id: 'x' })
                assert.ok(input instanceof StarInput)
                assert.equal(input.input.tagName, 'SPAN')
            } finally {
                Input.unregister('star')
            }
        })

        it('wraps a FormField subclass and loads the bound value', function () {
            Input.register('color', ColorField)
            const el = Input.create('color', { target: { color: 'red' }, attribute: 'color' })
            assert.ok(el instanceof ColorField)
            assert.equal(el.value, 'red')
        })

        it('dumps element change events to the target', function () {
            Input.register('color', ColorField)
            const target = { color: 'red' }
            const el = Input.create('color', { target, attribute: 'color' })
            el.value = 'blue'
            el.dispatchEvent(new window.Event('change'))
            assert.equal(target.color, 'blue')
        })

        it('dumps to nested array attribute paths', function () {
            Input.register('color', ColorField)
            const target = { configuration: { options: [{ color: 'red' }] } }
            const attribute = ['configuration', 'options', 0, 'color']
            const el = Input.create('color', { target, attribute })
            assert.equal(el.value, 'red')
            el.value = 'green'
            el.dispatchEvent(new window.Event('change'))
            assert.equal(target.configuration.options[0].color, 'green')
        })

        it('clears the element when the target value becomes nil', function () {
            Input.register('color', ColorField)
            const target = { color: 'red' }
            const input = Input.new('color', { target, attribute: 'color' })
            target.color = null
            input.targetChange()
            assert.equal(input.input.value, '')
        })

        it('overrides a built-in type', function () {
            class MyDate extends Input {}
            const builtin = Input.types.get('date')
            Input.register('date', MyDate)
            try {
                assert.ok(Input.new('date') instanceof MyDate)
            } finally {
                Input.register('date', builtin)
            }
            assert.ok(Input.new('date') instanceof builtin)
        })

        it('falls back to a plain input for unknown types', function () {
            const el = Input.create('nonexistent', {})
            assert.equal(el.tagName, 'INPUT')
            assert.equal(el.getAttribute('type'), 'nonexistent')
        })

        it('rejects classes that are neither Input nor element classes', function () {
            assert.throws(() => Input.register('bad', class {}), TypeError)
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
