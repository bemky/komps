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
})
