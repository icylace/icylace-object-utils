"use strict"

const isPlainObject = require("../lib/is-plain-object")

describe("the plain object checker", () => {
  test("does not validate an undefined value", () => {
    expect(isPlainObject(undefined)).toBeFalsy()
  })
  test("does not validate a null value", () => {
    expect(isPlainObject(null)).toBeFalsy()
  })
  test("does not validate a string literal", () => {
    expect(isPlainObject("P")).toBeFalsy()
  })
  test("does not validate the Object factory function", () => {
    expect(isPlainObject(Object)).toBeFalsy()
  })
  test("does not validate a function", () => {
    expect(isPlainObject(function foo() {})).toBeFalsy()
  })
  test("does not validate an instance of a custom constructor", () => {
    expect(isPlainObject(new (function Foo() {})())).toBeFalsy()
  })
  test("does not validate a DOM element", () => {
    expect(isPlainObject(document.createElement("div"))).toBeFalsy()
  })

  describe("when used with objects", () => {
    test("validates an empty literal object", () => {
      expect(isPlainObject({})).toBeTruthy()
    })
    test("validates a non-empty literal object", () => {
      expect(isPlainObject({ x: 0, y: 0 })).toBeTruthy()
    })
    test("validates an empty object instance", () => {
      expect(isPlainObject(new Object())).toBeTruthy()
    })
    test("validates an empty object created using the Object factory function", () => {
      expect(isPlainObject(Object())).toBeTruthy()
    })
    test("validates an empty object created using `Object.create`", () => {
      expect(isPlainObject(Object.create(null))).toBeTruthy()
    })
    test("validates an empty object created using `Object.create` having property descriptors", () => {
      expect(isPlainObject(Object.create(null, {
        property1: {
          value: true,
          writable: true,
        },
      }))).toBeTruthy()
    })
    test("does not validate the Math object", () => {
      expect(isPlainObject(Math)).toBeFalsy()
    })
  })

  describe("when used with numbers", () => {
    test("does not validate a number literal", () => {
      expect(isPlainObject(5)).toBeFalsy()
    })
    test("does not validate a number object", () => {
      expect(isPlainObject(Number(5))).toBeFalsy()
    })
    test("does not validate a number instance", () => {
      expect(isPlainObject(new Number(6))).toBeFalsy()
    })
    test("does not validate infinity", () => {
      expect(isPlainObject(Infinity)).toBeFalsy()
    })
    test("does not validate NaN", () => {
      expect(isPlainObject(NaN)).toBeFalsy()
    })
  })

  describe("when used with Booleans", () => {
    test("does not validate Boolean true", () => {
      expect(isPlainObject(true)).toBeFalsy()
    })
    test("does not validate Boolean false", () => {
      expect(isPlainObject(false)).toBeFalsy()
    })
  })

  describe("when used with arrays", () => {
    test("does not validate an empty array literal", () => {
      expect(isPlainObject([])).toBeFalsy()
    })
    test("does not validate a non-empty array literal", () => {
      expect(isPlainObject([1, 2, 3])).toBeFalsy()
    })
    test("does not validate an empty array instance", () => {
      expect(isPlainObject(new Array())).toBeFalsy()
    })
  })

  describe("when used with symbols", () => {
    test("does not validate an undescribed symbol", () => {
      expect(isPlainObject(Symbol())).toBeFalsy()
    })
    test("does not validate a described symbol", () => {
      expect(isPlainObject(Symbol("foo"))).toBeFalsy()
    })
    test("validates a global undescribed symbol", () => {
      expect(isPlainObject(Symbol.for())).toBeFalsy()
    })
    test("validates a global described symbol", () => {
      expect(isPlainObject(Symbol.for("foo"))).toBeFalsy()
    })
  })
})
