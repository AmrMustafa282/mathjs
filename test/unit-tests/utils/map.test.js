import assert from 'assert'
import { isMap, ObjectWrappingMap, toObject, createMap, assign } from '../../../src/utils/map.js'

describe('maps', function () {
  it('should provide isMap, a function to tell maps from non-maps', function () {
    assert.ok(isMap(new Map()))
    assert.ok(!isMap([]))
    assert.ok(!isMap({}))

    const duckMap = {
      has: () => 0,
      keys: () => 0,
      get: () => 0,
      set: () => 0
    }

    assert.ok(isMap(duckMap))

    const duckNotMap = {
      has: () => 0,
      keys: () => 0,
      set: () => 0
    }
    assert.ok(!isMap(duckNotMap))

    const notMaps = [null, undefined, true, false, 'string', 42, /regular-expression/, new Date(), {}, []]
    for (const thing of notMaps) {
      assert.ok(!isMap(thing))
    }
  })

  it('should create a map from objects, maps, or undefined', function () {
    const emptyMap = createMap()
    assert.ok(isMap(emptyMap))

    const actualMap = createMap(new Map())
    assert.ok(isMap(actualMap))

    const wrappedMap = createMap({ a: 1 })
    assert.ok(isMap(wrappedMap))

    for (const notMap of ['string', new Date(), []]) {
      assert.throws(() => createMap(notMap))
    }
  })

  it('should let us transform a map into an object', function () {
    const actualMap = new Map()
      .set('a', 1)
      .set('b', 2)

    const obj = {
      a: 1,
      b: 2
    }

    assert.deepStrictEqual(toObject(actualMap), obj)
    assert.notStrictEqual(toObject(actualMap), obj)

    // The wrapped map gives back the backing object.
    const wrappedMap = createMap(obj)
    assert.deepStrictEqual(toObject(wrappedMap), obj)
    assert.strictEqual(toObject(wrappedMap), obj)
  })

  it('should provide an assign function like Object.assign', function () {
    const target = new Map()
      .set('a', 1)
      .set('b', 2)

    assign(target, null, undefined, 'string', new Date())

    assert.deepStrictEqual(
      target,
      new Map()
        .set('a', 1)
        .set('b', 2)
    )

    const src1 = new Map()
      .set('c', 3)
      .set('d', 4)

    const src2 = { e: 5, f: 6 }

    const sameTarget = assign(target, src1, src2)

    // it returns back the first argument…
    assert.strictEqual(target, sameTarget)

    // …copying the contents of the others into it.
    assert.deepStrictEqual(
      target,
      new Map()
        .set('a', 1)
        .set('b', 2)
        .set('c', 3)
        .set('d', 4)
        .set('e', 5)
        .set('f', 6)
    )
  })
})
