import KompElement from '../lib/komps/element.js';
import * as assert from 'assert';

class TestElement extends KompElement {
    static tagName = 'komp-test-element'
    static assignableAttributes = {
        name: { type: 'string', default: 'untitled', null: false },
        count: { type: 'number', default: 0, null: false },
        enabled: { type: 'boolean', default: true, null: false },
        label: { type: 'string', default: null, null: true },
        anchor: { type: 'HTMLElement', default: null, null: true },
        data: { type: 'object', default: null, null: true },
        items: { type: 'array', default: [], null: false },
        onClick: { type: 'function', default: null, null: true },
        mixed: { type: ['boolean', 'object'], default: false, null: false },
    }
}
customElements.define(TestElement.tagName, TestElement)

describe('KompElement', function () {

    describe('assignableAttributes schema', function () {
        it('sets defaults from schema', function () {
            const el = new TestElement()
            assert.equal(el.name, 'untitled')
            assert.equal(el.count, 0)
            assert.equal(el.enabled, true)
            assert.equal(el.label, null)
        })

        it('accepts attrs from constructor', function () {
            const el = new TestElement({ name: 'hello', count: 5, enabled: false })
            assert.equal(el.name, 'hello')
            assert.equal(el.count, 5)
            assert.equal(el.enabled, false)
        })
    })

    describe('serializing attributes', function () {

        describe('string attributes', function () {
            it('serializes as HTML attribute', function () {
                const el = new TestElement({ name: 'foo' })
                assert.equal(el.getAttribute('name'), 'foo')
            })

            it('updates HTML attribute on change', function () {
                const el = new TestElement({ name: 'foo' })
                el.name = 'bar'
                assert.equal(el.getAttribute('name'), 'bar')
            })

            it('removes HTML attribute when set to null', function () {
                const el = new TestElement({ label: 'hi' })
                assert.equal(el.getAttribute('label'), 'hi')
                el.label = null
                assert.equal(el.hasAttribute('label'), false)
            })

            it('serializes default value', function () {
                const el = new TestElement()
                assert.equal(el.getAttribute('name'), 'untitled')
            })
        })

        describe('number attributes', function () {
            it('serializes as HTML attribute', function () {
                const el = new TestElement({ count: 42 })
                assert.equal(el.count, 42)
                assert.equal(el.getAttribute('count'), '42')
            })

            it('updates on change', function () {
                const el = new TestElement({ count: 1 })
                el.count = 99
                assert.equal(el.getAttribute('count'), '99')
            })
        })

        describe('boolean attributes', function () {
            it('uses toggleAttribute for true', function () {
                const el = new TestElement({ enabled: true })
                assert.equal(el.hasAttribute('enabled'), true)
            })

            it('removes attribute for false', function () {
                const el = new TestElement({ enabled: false })
                assert.equal(el.hasAttribute('enabled'), false)
            })

            it('toggles on change', function () {
                const el = new TestElement({ enabled: true })
                el.enabled = false
                assert.equal(el.hasAttribute('enabled'), false)
                el.enabled = true
                assert.equal(el.hasAttribute('enabled'), true)
            })
        })

        describe('non-serializable attributes (manifest refs)', function () {
            it('stores object in manifest and sets _ref attribute', function () {
                const obj = { key: 'value' }
                const el = new TestElement({ data: obj })
                const refId = el.getAttribute('data_ref')
                assert.ok(refId, 'should have data_ref attribute')
                assert.equal(KompElement.manifest.get(refId), obj)
            })

            it('stores function in manifest', function () {
                const fn = () => 'clicked'
                const el = new TestElement({ onClick: fn })
                const refId = el.getAttribute('onclick_ref')
                assert.ok(refId, 'should have onclick_ref attribute')
                assert.equal(KompElement.manifest.get(refId), fn)
            })

            it('stores HTMLElement in manifest', function () {
                const anchor = document.createElement('div')
                const el = new TestElement({ anchor: anchor })
                const refId = el.getAttribute('anchor_ref')
                assert.ok(refId, 'should have anchor_ref attribute')
                assert.equal(KompElement.manifest.get(refId), anchor)
            })

            it('stores array in manifest', function () {
                const items = [1, 2, 3]
                const el = new TestElement({ items: items })
                const refId = el.getAttribute('items_ref')
                assert.ok(refId, 'should have items_ref attribute')
                assert.equal(KompElement.manifest.get(refId), items)
            })

            it('removes _ref attribute when set to null', function () {
                const el = new TestElement({ data: { a: 1 } })
                const refId = el.getAttribute('data_ref')
                assert.ok(el.hasAttribute('data_ref'))
                el.data = null
                assert.equal(el.hasAttribute('data_ref'), false)
                assert.equal(KompElement.manifest.get(refId), undefined)
            })

            it('does not set _ref for null defaults', function () {
                const el = new TestElement()
                assert.equal(el.hasAttribute('anchor_ref'), false)
                assert.equal(el.anchor, null)
            })
        })

        describe('mixed type attributes', function () {
            it('serializes as boolean when boolean value', function () {
                const el = new TestElement({ mixed: true })
                // mixed type includes non-serializable 'object', so uses ref
                const refId = el.getAttribute('mixed_ref')
                assert.ok(refId)
                assert.equal(KompElement.manifest.get(refId), true)
            })

            it('stores object value in manifest', function () {
                const obj = { alignment: 'start' }
                const el = new TestElement({ mixed: obj })
                const refId = el.getAttribute('mixed_ref')
                assert.ok(refId)
                assert.equal(KompElement.manifest.get(refId), obj)
            })
        })

        describe('cloneNode restores from manifest', function () {
            it('restores non-serializable attributes from manifest on clone', function () {
                const obj = { key: 'value' }
                const fn = () => 'test'
                const el = new TestElement({ data: obj, onClick: fn, name: 'original' })

                const clone = el.cloneNode(true)
                // Clone has the _ref attributes, construct new instance to test restoration
                const dataRef = clone.getAttribute('data_ref')
                const onClickRef = clone.getAttribute('onclick_ref')
                assert.ok(dataRef)
                assert.ok(onClickRef)
                assert.equal(KompElement.manifest.get(dataRef), obj)
                assert.equal(KompElement.manifest.get(onClickRef), fn)
                // Serializable attributes are directly on the clone
                assert.equal(clone.getAttribute('name'), 'original')
            })

            it('clone survives finalization of original', function () {
                const obj = { key: 'value' }
                const el = new TestElement({ data: obj, name: 'original' })

                const clone1 = el.cloneNode(true)

                // Simulate GC finalization of original element
                for (const id of el._refIds) {
                    KompElement.manifest.delete(id)
                }

                // Clone the clone
                const clone2 = clone1.cloneNode(true)

                // clone2 should still have the data
                assert.equal(clone2.data, obj)
                assert.equal(clone2.getAttribute('name'), 'original')
            })

            it('restores non-serializable attributes on nested elements', function () {
                const parentData = { role: 'parent' }
                const childData = { role: 'child' }
                const childFn = () => 'nested'

                const parent = new TestElement({ data: parentData, name: 'parent' })
                const child = new TestElement({ data: childData, onClick: childFn, name: 'child' })
                parent.appendChild(child)

                const clone = parent.cloneNode(true)
                const clonedChild = clone.querySelector('komp-test-element')

                assert.ok(clonedChild, 'clone should contain nested element')
                assert.equal(clone.data, parentData)
                assert.equal(clone.getAttribute('name'), 'parent')
                assert.equal(clonedChild.data, childData)
                assert.equal(clonedChild.onClick, childFn)
                assert.equal(clonedChild.getAttribute('name'), 'child')
            })
        })
    })

    describe('deprecated array format', function () {
        it('converts array format and warns', function () {
            class LegacyElement extends KompElement {
                static tagName = 'komp-legacy-element'
                static assignableAttributes = ['foo', 'bar']
            }
            customElements.define(LegacyElement.tagName, LegacyElement)

            const warnings = []
            const originalWarn = console.warn
            console.warn = (...args) => warnings.push(args.join(' '))

            const el = new LegacyElement({ foo: 'hello' })
            assert.equal(el.foo, 'hello')
            assert.equal(el.bar, null)
            assert.ok(warnings.some(w => w.includes('deprecated array format')))

            console.warn = originalWarn
        })
    })

    describe('deprecated direct value format', function () {
        it('converts {key: defaultValue} format and warns', function () {
            class DirectValueElement extends KompElement {
                static tagName = 'komp-direct-value-element'
                static assignableAttributes = { timeout: 5000, label: 'untitled' }
            }
            customElements.define(DirectValueElement.tagName, DirectValueElement)

            const warnings = []
            const originalWarn = console.warn
            console.warn = (...args) => warnings.push(args.join(' '))

            const el = new DirectValueElement()
            assert.equal(el.timeout, 5000)
            assert.equal(el.label, 'untitled')
            assert.ok(warnings.some(w => w.includes('direct value')))

            console.warn = originalWarn
        })

        it('accepts attrs from constructor', function () {
            const warnings = []
            const originalWarn = console.warn
            console.warn = (...args) => warnings.push(args.join(' '))

            const el = new (customElements.get('komp-direct-value-element'))({ timeout: 3000, label: 'custom' })
            assert.equal(el.timeout, 3000)
            assert.equal(el.label, 'custom')

            console.warn = originalWarn
        })
    })

    describe('HTML initialization', function () {
        it('reads string attribute from parsed HTML', function () {
            const container = document.createElement('div')
            container.innerHTML = '<komp-test-element name="from-html"></komp-test-element>'
            const el = container.querySelector('komp-test-element')

            // In jsdom, HTML attributes are available during construction,
            // so the constructor's hasAttribute check picks them up immediately.
            // In a real browser, this would happen later in initialize() on connect.
            assert.equal(el.name, 'from-html')
            assert.equal(el.getAttribute('name'), 'from-html')
        })

        it('reads number attribute from parsed HTML after connect', function () {
            const container = document.createElement('div')
            container.innerHTML = '<komp-test-element count="42"></komp-test-element>'
            const el = container.querySelector('komp-test-element')

            document.body.appendChild(container)
            // initialize() reads getAttribute which returns string "42"
            assert.equal(el.count, '42')

            document.body.removeChild(container)
        })

        it('reads boolean attribute from parsed HTML after connect', function () {
            const container = document.createElement('div')
            container.innerHTML = '<komp-test-element></komp-test-element>'
            const el = container.querySelector('komp-test-element')

            document.body.appendChild(container)
            // enabled defaults to true, presence of attribute means true
            assert.equal(el.enabled, true)

            document.body.removeChild(container)
        })
    })
})
