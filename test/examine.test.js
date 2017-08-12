"use strict"

const R = require("ramda")
const { examine, see } = require("../lib/examine")
const whereAll = require("../lib/where-all")

const spec1 = {
  a: {
    h: [
      null,
      see(Array.isArray, "foo"),
      true,
      { l: { m: see(R.curry(whereAll)({ n: true }), "bar") } },
    ],
  },
}

const spec2 = {
  a: {
    h: [
      null,
      R.ifElse(Array.isArray, R.always("foo"), R.F),
      true,
      { l: { m: R.ifElse(R.curry(whereAll)({ n: true }), R.always("bar"), R.F) } },
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

describe("the object examiner", () => {
  describe("using a spec for getting a couple properties while asserting a particular array element exists", () => {
    test("validates and extracts from an object containing all desired properties", () => {
      expect(examine(spec1, data1)).toEqual({
        foo: [
          { j: 6, k: 7 },
          { j: 8, k: "nine" },
        ],
        bar: { n: false },
      })
    })
    test("does not validate an object missing a required element", () => {
      expect(examine(spec1, data2)).toBeNull()
    })
  })

  describe("using a spec for getting a couple properties while asserting a particular array element and object property exist", () => {
    test("validates and extracts from an object containing all desired properties", () => {
      expect(examine(spec2, data1)).toEqual({
        foo: [
          { j: 6, k: 7 },
          { j: 8, k: "nine" },
        ],
        bar: { n: false },
      })
    })
    test("does not validate an object missing a required element", () => {
      expect(examine(spec2, data2)).toBeNull()
    })
  })
})
