import { scanPrototypesFor } from '../lib/support.js';
import * as assert from 'assert';

describe('scanPrototypesFor', function () {

    it('walks the prototype chain collecting own values per prototype', function () {
        class A { static items = [1] }
        class B extends A { static items = [2] }
        class C extends B {}

        assert.deepEqual(scanPrototypesFor(A, 'items'), [[1]])
        assert.deepEqual(scanPrototypesFor(B, 'items'), [[2], [1]])
        assert.deepEqual(scanPrototypesFor(C, 'items'), [[2], [1]])
    })

    it('memoizes repeated calls for the same (constructor, key) pair', function () {
        class A { static items = [1] }
        const first = scanPrototypesFor(A, 'items')
        const second = scanPrototypesFor(A, 'items')
        assert.strictEqual(first, second)
    })

    // Regression: when `customElements.define` triggers an upgrade mid-class-body,
    // the constructor runs before the subclass's `static <key> = ...` line. The
    // cache previously locked in the parent-only result and never recovered.
    it('invalidates the cache when own-property status flips after first scan', function () {
        class A { static items = [1] }
        class B extends A {}

        assert.deepEqual(scanPrototypesFor(B, 'items'), [[1]])

        B.items = [2]
        assert.deepEqual(scanPrototypesFor(B, 'items'), [[2], [1]])
        assert.deepEqual(scanPrototypesFor(B, 'items'), [[2], [1]])
    })

    it('preserves in-place mutations to cached values (plugin pattern)', function () {
        class A { static events = ['a'] }
        const first = scanPrototypesFor(A, 'events')
        first[0].push('b')
        assert.deepEqual(scanPrototypesFor(A, 'events'), [['a', 'b']])
    })
})
