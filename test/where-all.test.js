"use strict"

const whereAll = require("../lib/where-all")

describe("the object validator", () => {
  test("validates a false value when its spec is Boolean true", () => {
    const spec = true
    const data = false
    expect(whereAll(spec, data)).toBeTruthy()
  })
  test("validates a string when its spec is the same string", () => {
    const spec = "a"
    const data = "a"
    expect(whereAll(spec, data)).toBeTruthy()
  })
  test("validates a number when its spec is the same number", () => {
    const spec = 1
    const data = 1
    expect(whereAll(spec, data)).toBeTruthy()
  })
  test("validates an array with a single number when its spec is an array with the same number", () => {
    const spec = [1]
    const data = [1]
    expect(whereAll(spec, data)).toBeTruthy()
  })
  test("does not validate an array with a single number when its spec is an array with a different number", () => {
    const spec = [1]
    const data = [2]
    expect(whereAll(spec, data)).toBeFalsy()
  })
  test("does not validate an array with a single number when its spec is an array with a single string", () => {
    const spec = ["foo"]
    const data = [1]
    expect(whereAll(spec, data)).toBeFalsy()
  })
  test("does not validate an array with a single string when its spec is an array with a different single string", () => {
    const spec = ["foo"]
    const data = ["1"]
    expect(whereAll(spec, data)).toBeFalsy()
  })
  test("validates an object with a string property and a nested object containing a string property", () => {
    const spec = {
      a: it => it === "hi",
      b: { c: it => it === "bar" },
    }
    const data = {
      a: "hi",
      b: { c: "bar" },
    }
    expect(whereAll(spec, data)).toBeTruthy()
  })
  test("validates an object with a string property and a nested object containing a string property using string literals", () => {
    const spec = {
      a: "hi",
      b: { c: "bar" },
    }
    const data = {
      a: "hi",
      b: { c: "bar" },
    }
    expect(whereAll(spec, data)).toBeTruthy()
  })
  test("validates an object with a number property and a nested object containing a number property", () => {
    const spec = {
      a: 1,
      b: { c: 2 },
    }
    const data = {
      a: 1,
      b: { c: 2 },
    }
    expect(whereAll(spec, data)).toBeTruthy()
  })
  test("validates an array with a string element and a nested object containing a string property", () => {
    const spec = [
      it => it === "hi",
      { c: it => it === "bar" },
    ]
    const data = [
      "hi",
      { c: "bar" },
    ]
    expect(whereAll(spec, data)).toBeTruthy()
  })
  test("validates an array with some string elements, an object, and a few arrays", () => {
    const spec = [
      it => it === "hi",
      { c: it => it === "bar" },
      Array.isArray,
      null,
      it => typeof it === "string",
      [[it => typeof it === "string"]],
    ]
    const data = [
      "hi",
      { c: "bar" },
      [345],
      "luahfoi",
      "jack",
      [["aa"]],
      "tyity",
    ]
    expect(whereAll(spec, data)).toBeTruthy()
  })
  test("validates an array with some string elements, a couple objects, and a couple arrays", () => {
    const spec = [
      it => it === "hi",
      { a: it => it === "bar" },
      Array.isArray,
      [
        { b: it => typeof it === "string" },
        { c: it => typeof it === "string" },
      ],
      null,
      { e: it => typeof it === "object" },
    ]
    const data = [
      "hi",
      { a: "bar" },
      [345],
      [
        { b: "asdf" },
        { c: "uilyuoiy" },
      ],
      "luahfoi",
      {
        d: "iuehrgi",
        e: { f: { g: { h: 234 } } },
      },
    ]
    expect(whereAll(spec, data)).toBeTruthy()
  })
  test("does not validate an array with some string elements, a couple objects, and a couple arrays while skipping the validation check for an array element", () => {
    const spec = [
      it => it === "hi",
      { a: it => it === "bar" },
      Array.isArray,
      [
        { b: it => typeof it === "string" },
        { c: it => typeof it === "string" },
      ],
      null,
      { e: it => typeof it === "object" },
    ]
    const data = [
      { a: "bar" },
      [345],
      [
        { b: "asdf" },
        { c: "uilyuoiy" },
      ],
      "luahfoi",
      {
        d: "iuehrgi",
        e: { f: { g: { h: 234 } } },
      },
    ]
    expect(whereAll(spec, data)).toBeFalsy()
  })
  test("does not validate an array not containing the desired elements", () => {
    const spec = [it => it === "hi", it => it === "bar"]
    const data = [null, null, null, null, null, null]
    expect(whereAll(spec, data)).toBeFalsy()
  })

  describe("when used with symbols", () => {
    test("does not validate an undescribed symbol", () => {
      const spec = Symbol()
      const data = Symbol()
      expect(whereAll(spec, data)).toBeFalsy()
    })
    test("does not validate a described symbol", () => {
      const spec = Symbol("foo")
      const data = Symbol("foo")
      expect(whereAll(spec, data)).toBeFalsy()
    })
    test("validates a global undescribed symbol", () => {
      const spec = Symbol.for()
      const data = Symbol.for()
      expect(whereAll(spec, data)).toBeTruthy()
    })
    test("validates a global described symbol", () => {
      const spec = Symbol.for("foo")
      const data = Symbol.for("foo")
      expect(whereAll(spec, data)).toBeTruthy()
    })
    test("does not validate a global described symbol with a different description", () => {
      const spec = Symbol.for("foo")
      const data = Symbol.for("bar")
      expect(whereAll(spec, data)).toBeFalsy()
    })
  })
})
