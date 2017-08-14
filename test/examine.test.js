"use strict"

const R = require("ramda")
const { examine, see } = require("../lib/examine")
const whereAll = require("../lib/where-all")

describe("the object examiner", () => {
  test("validates but extracts nothing from an empty object using an empty spec", () => {
    const spec = {}
    const data = {}
    const want = {}
    expect(examine(spec, data)).toEqual(want)
  })
  test("validates but extracts nothing from a non-empty object using an empty spec", () => {
    const spec = {}
    const data = { a: 1 }
    const want = {}
    expect(examine(spec, data)).toEqual(want)
  })
  test("validates and extracts a property that is a number", () => {
    const spec = { a: see(Number.isInteger, "foo") }
    const data = { a: 1 }
    const want = { foo: 1 }
    expect(examine(spec, data)).toEqual(want)
  })
  test("using a spec with a predicate, does not validate an object that has the desired key but not the desired type of value", () => {
    const spec = { a: see(Number.isInteger, "foo") }
    const data = { a: "1" }
    expect(examine(spec, data)).toBeNull()
  })
  test("using a spec without a predicate, does not validate an object that has the desired key but not the desired type of value", () => {
    const spec = { a: "foo" }
    const data = { a: 1 }
    expect(examine(spec, data)).toBeNull()
  })
  test("using a spec without a predicate, does not validate an object that has the desired key and type of value but not the desired value itself", () => {
    const spec = { a: "foo" }
    const data = { a: "1" }
    expect(examine(spec, data)).toBeNull()
  })
  test("using a spec without a predicate, validates an object but extracts nothing", () => {
    const spec = { a: "foo" }
    const data = { a: "foo" }
    const want = {}
    expect(examine(spec, data)).toEqual(want)
  })
  test("does not validate an object missing the desired key", () => {
    const spec = { a: see(Number.isInteger, "foo") }
    const data = { b: 1 }
    expect(examine(spec, data)).toBeNull()
  })
  test("does not validate an array that does not have the desired element", () => {
    const spec = ["foo"]
    const data = ["1"]
    expect(examine(spec, data)).toBeNull()
  })
  test("skips validation and extracts the element from the array", () => {
    const spec = [() => "foo"]
    const data = ["1"]
    const want = { foo: "1" }
    expect(examine(spec, data)).toEqual(want)
  })
  test("skips validation and extracts a property from an object", () => {
    const spec = { a: () => "foo" }
    const data = { a: 1 }
    const want = { foo: 1 }
    expect(examine(spec, data)).toEqual(want)
  })
  test("validates and extracts an object with an integer property and an array property", () => {
    const spec = {
      a: see(Number.isInteger, "foo"),
      b: see(Array.isArray, "bar"),
    }
    const data = { a: 1, b: [2] }
    const want = { foo: 1, bar: [2] }
    expect(examine(spec, data)).toEqual(want)
  })
  test("does not validate an object that partially matches the spec", () => {
    const spec = {
      a: see(Number.isInteger, "foo"),
      b: see(Array.isArray, "bar"),
    }
    const data = { a: 1, b: 2 }
    expect(examine(spec, data)).toBeNull()
  })

  describe("when used with symbols", () => {
    test("does not validate an undescribed symbol", () => {
      const spec = Symbol()
      const data = Symbol()
      expect(examine(spec, data)).toBeFalsy()
    })
    test("does not validate a described symbol", () => {
      const spec = Symbol("foo")
      const data = Symbol("foo")
      expect(examine(spec, data)).toBeFalsy()
    })
    test("validates a global undescribed symbol but extracts nothing", () => {
      const spec = Symbol.for()
      const data = Symbol.for()
      expect(examine(spec, data)).toBeTruthy()
    })
    test("validates a global described symbol but extracts nothing", () => {
      const spec = Symbol.for("foo")
      const data = Symbol.for("foo")
      expect(examine(spec, data)).toBeTruthy()
    })
    test("does not validate a global described symbol with a different description", () => {
      const spec = Symbol.for("foo")
      const data = Symbol.for("bar")
      expect(examine(spec, data)).toBeFalsy()
    })
  })

  describe("using a spec for getting a couple properties while asserting a particular array element and object property exists", () => {
    const spec = {
      a: {
        h: [
          null,
          see(Array.isArray, "foo"),
          true,
          { l: { m: see(it => whereAll({ n: true }, it), "bar") } },
        ],
      },
    }
    const data1 = {
      a: {
        h: [
          { i: 5 },
          [
            { j: 6, k: 7 },
            { j: 8, k: "nine" },
          ],
          10,
          { l: { m: { n: false } } },
        ],
      },
    }
    const data2 = {
      a: {
        h: [
          { i: 5 },
          [{ j: 8, k: "nine" }],
        ],
      },
    }
    test("validates and extracts from an object containing all desired properties", () => {
      const want = {
        foo: [
          { j: 6, k: 7 },
          { j: 8, k: "nine" },
        ],
        bar: { n: false },
      }
      expect(examine(spec, data1)).toEqual(want)
    })
    test("does not validate an object missing a required element", () => {
      expect(examine(spec, data2)).toBeNull()
    })
  })

  describe("using a spec for getting a couple properties while asserting a particular array element and object property exist", () => {
    const spec = {
      a: {
        h: [
          null,
          see(Array.isArray, "foo", false),
          true,
          { l: { m: see(it => whereAll({ n: true }, it), "bar", false) } },
        ],
      },
    }
    const data1 = {
      a: {
        h: [
          { i: 5 },
          [
            { j: 6, k: 7 },
            { j: 8, k: "nine" },
          ],
          10,
          { l: { m: { n: false } } },
        ],
      },
    }
    const data2 = {
      a: {
        h: [
          { i: 5 },
          [{ j: 8, k: "nine" }],
        ],
      },
    }
    test("validates and extracts from an object containing all desired properties", () => {
      const want = {
        foo: [
          { j: 6, k: 7 },
          { j: 8, k: "nine" },
        ],
        bar: { n: false },
      }
      expect(examine(spec, data1)).toEqual(want)
    })
    test("does not validate an object missing a required element", () => {
      expect(examine(spec, data2)).toBeNull()
    })
  })
})
