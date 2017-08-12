"use strict"

const R = require("ramda")
const whereAll = require("../lib/where-all")

describe("the object validator", () => {
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
  test("validates an array with some string elements, a couple objects, and a couple arrays while skipping the validation check for an array element", () => {
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
})
