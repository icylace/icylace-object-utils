"use strict"

const R = require("ramda")
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
  test("does not validate an unnamed symbol", () => {
    const spec = Symbol()
    const data = Symbol()
    expect(whereAll(spec, data)).toBeFalsy()
  })
  test("does not validate a named symbol", () => {
    const spec = Symbol("foo")
    const data = Symbol("foo")
    expect(whereAll(spec, data)).toBeFalsy()
  })
  test("validates a global unnamed symbol", () => {
    const spec = Symbol.for()
    const data = Symbol.for()
    expect(whereAll(spec, data)).toBeTruthy()
  })
  test("validates a global named symbol", () => {
    const spec = Symbol.for("foo")
    const data = Symbol.for("foo")
    expect(whereAll(spec, data)).toBeTruthy()
  })
  test("does not validate a global named symbol with a different name", () => {
    const spec = Symbol.for("foo")
    const data = Symbol.for("bar")
    expect(whereAll(spec, data)).toBeFalsy()
  })
  test("validates an object with a string property and a nested object containing a string property", () => {
    const spec = {
      a: R.equals("hi"),
      b: { c: R.equals("bar") },
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
      R.equals("hi"),
      { c: R.equals("bar") },
    ]
    const data = [
      "hi",
      { c: "bar" },
    ]
    expect(whereAll(spec, data)).toBeTruthy()
  })
  test("validates an array with some string elements, an object, and a few arrays", () => {
    const spec = [
      R.equals("hi"),
      { c: R.equals("bar") },
      Array.isArray,
      null,
      R.is(String),
      [[R.is(String)]],
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
      R.equals("hi"),
      { a: R.equals("bar") },
      Array.isArray,
      [
        { b: R.is(String) },
        { c: R.is(String) },
      ],
      null,
      { e: R.is(Object) },
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
      R.equals("hi"),
      { a: R.equals("bar") },
      Array.isArray,
      [
        { b: R.is(String) },
        { c: R.is(String) },
      ],
      null,
      { e: R.is(Object) },
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
    const spec = [R.equals("hi"), R.equals("bar")]
    const data = [null, null, null, null, null, null]
    expect(whereAll(spec, data)).toBeFalsy()
  })
})
