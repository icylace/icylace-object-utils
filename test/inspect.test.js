"use strict"

const inspect = require("../lib/inspect")

describe("the object inspector", () => {
  describe("when used with objects", () => {
    test("extracts nothing from an object when using an empty object spec", () => {
      const spec = {}
      const data = { a: 1 }
      const want = {}
      expect(inspect(spec, data)).toEqual(want)
    })
    test("extracts nothing from an object when using an empty array spec", () => {
      const spec = []
      const data = { a: 1 }
      const want = {}
      expect(inspect(spec, data)).toEqual(want)
    })
    test("extracts nothing from an empty object", () => {
      const spec = { a: "foo" }
      const data = {}
      const want = { foo: undefined }
      expect(inspect(spec, data)).toEqual(want)
    })
    test("extracts a single property from an object with a single property", () => {
      const spec = { a: "foo" }
      const data = { a: 1 }
      const want = { foo: 1 }
      expect(inspect(spec, data)).toEqual(want)
    })
    test("extracts nothing when trying to get a property from an object missing it", () => {
      const spec = { a: "foo" }
      const data = { b: 1 }
      const want = { foo: undefined }
      expect(inspect(spec, data)).toEqual(want)
    })
    test("extracts a single property from an object with a single property using a spec with a null property", () => {
      const spec = { a: "foo", b: null }
      const data = { a: 1 }
      const want = { foo: 1 }
      expect(inspect(spec, data)).toEqual(want)
    })
    test("extracts a single property from an object with more than one property", () => {
      const spec = { a: "foo" }
      const data = { a: 1, b: 2 }
      const want = { foo: 1 }
      expect(inspect(spec, data)).toEqual(want)
    })
    test("extracts an arbitrary single property from an object with more than one property", () => {
      const spec = { b: "foo" }
      const data = { a: 1, b: 2, c: 3 }
      const want = { foo: 2 }
      expect(inspect(spec, data)).toEqual(want)
    })
    test("extracts a single nested property from an object with a single property nested in an object", () => {
      const spec = { a: { b: "foo" } }
      const data = { a: { b: 2 } }
      const want = { foo: 2 }
      expect(inspect(spec, data)).toEqual(want)
    })
    test("extracts a couple properties from an object with a couple properties", () => {
      const spec = { a: "foo", b: "bar" }
      const data = { a: 1, b: 2 }
      const want = { foo: 1, bar: 2 }
      expect(inspect(spec, data)).toEqual(want)
    })
    test("extracts a property and a nested property from an object with a property and a nested property", () => {
      const spec = { a: "foo", b: { c: "bar" } }
      const data = { a: 1, b: { c: 3 } }
      const want = { foo: 1, bar: 3 }
      expect(inspect(spec, data)).toEqual(want)
    })
    test("extracts a property and a nested property from an object with a property and a doubly-nested property", () => {
      const spec = { a: "foo", b: { c: "bar" } }
      const data = { a: 1, b: { c: { d: 5 } } }
      const want = { foo: 1, bar: { d: 5 } }
      expect(inspect(spec, data)).toEqual(want)
    })
    test("extracts a property and a doubly-nested property from an object with a property and a doubly-nested property", () => {
      const spec = { a: "foo", b: { c: { d: "bar" } } }
      const data = { a: 1, b: { c: { d: 5 } } }
      const want = { foo: 1, bar: 5 }
      expect(inspect(spec, data)).toEqual(want)
    })
  })

  describe("when used with arrays", () => {
    test("extracts nothing from an array when using an empty array spec", () => {
      const spec = []
      const data = [1]
      const want = {}
      expect(inspect(spec, data)).toEqual(want)
    })
    test("extracts nothing from an array when using an empty object spec", () => {
      const spec = {}
      const data = [1]
      const want = {}
      expect(inspect(spec, data)).toEqual(want)
    })
    test("extracts nothing from an empty array", () => {
      const spec = ["foo"]
      const data = []
      const want = { foo: undefined }
      expect(inspect(spec, data)).toEqual(want)
    })
    test("extracts a single element from an array with a single element", () => {
      const spec = ["foo"]
      const data = [1]
      const want = { foo: 1 }
      expect(inspect(spec, data)).toEqual(want)
    })
    test("extracts a single element from an array with more than one element", () => {
      const spec = ["foo"]
      const data = [1, 2]
      const want = { foo: 1 }
      expect(inspect(spec, data)).toEqual(want)
    })
    test("extracts a couple elements from an array with a couple elements", () => {
      const spec = ["foo", "bar"]
      const data = [1, 2]
      const want = { foo: 1, bar: 2 }
      expect(inspect(spec, data)).toEqual(want)
    })
    test("extracts only a single element from an array missing a desired element", () => {
      const spec = ["foo", "bar"]
      const data = [1]
      const want = { foo: 1, bar: undefined }
      expect(inspect(spec, data)).toEqual(want)
    })
    test("extracts a single nested element from an array with a single element nested in an array", () => {
      const spec = [["foo"]]
      const data = [[1]]
      const want = { foo: 1 }
      expect(inspect(spec, data)).toEqual(want)
    })
    test("extracts a couple elements from an array with a couple elements at different levels of nesting", () => {
      const spec = ["foo", ["bar"]]
      const data = [1, [2]]
      const want = { foo: 1, bar: 2 }
      expect(inspect(spec, data)).toEqual(want)
    })
    test("extracts the 2nd element from an array", () => {
      const spec = [null, "foo"]
      const data = [1, 2]
      const want = { foo: 2 }
      expect(inspect(spec, data)).toEqual(want)
    })
    test("extracts the 5th element from an array", () => {
      const spec = [null, null, null, null, "foo"]
      const data = [1, 2, 3, 4, 5, 6, 7, 8, 9]
      const want = { foo: 5 }
      expect(inspect(spec, data)).toEqual(want)
    })
    test("extracts nothing from an array shorter than the array spec", () => {
      const spec = [null, null, null, null, "foo"]
      const data = [1, 2, 3, 4]
      const want = { foo: undefined }
      expect(inspect(spec, data)).toEqual(want)
    })
  })

  describe("when used with objects and arrays together", () => {
    test("extracts a single nested property from an object with a single property nested in an array", () => {
      const spec = { a: [{ b: "foo" }] }
      const data = { a: [{ b: 2 }] }
      const want = { foo: 2 }
      expect(inspect(spec, data)).toEqual(want)
    })

    test("extracts several properties from an object with several properties", () => {
      const spec = {
        a: [{ b: "one" }],
        c: "two",
        d: { e: "three" },
        f: {
          g: "four",
          h: [
            [
              { j: "six" },
              { k: "nine" },
            ],
          ],
        },
      }
      const data = {
        a: [{ b: 1 }],
        c: 2,
        d: { e: 3 },
        f: {
          g: [4],
          h: [
            { i: 5 },
            [
              { j: 6, k: 7 },
              { j: 8, k: 9 },
            ],
            10,
          ],
        },
      }
      const want = {
        one: 1,
        two: 2,
        three: 3,
        four: [4],
      }
      expect(inspect(spec, data)).toEqual(want)
    })

    test("extracts several properties while explicitly skipping one from an object with several properties", () => {
      const spec = {
        a: [
          null,
          [{ j: "foo" }, "bar"],
          "baz",
        ],
      }
      const data = {
        a: [
          { b: 1 },
          [
            { c: 2, d: 3 },
            { c: 4, d: "quux" },
          ],
          10,
        ],
      }
      const want = {
        foo: undefined,
        bar: { c: 4, d: "quux" },
        baz: 10,
      }
      expect(inspect(spec, data)).toEqual(want)
    })

    test("extracts several properties while explicitly skipping one from an object that doesn't have all the properties to be extracted", () => {
      const spec = {
        a: [
          null,
          [{ j: "foo" }, "bar"],
          "baz",
        ],
      }
      const data = {
        a: [
          { b: 1 },
          [{ c: 4, d: "quux" }],
          10,
        ],
      }
      const want = {
        foo: undefined,
        bar: undefined,
        baz: 10,
      }
      expect(inspect(spec, data)).toEqual(want)
    })

    test("extracts several properties while explicitly skipping a couple from an object with several properties", () => {
      const spec = {
        person: {
          favoritePhotos: [
            [
              { imageUrl: "url1" },
              "favorite2",
            ],
            null,
            { locationCoordinates: [null, "location2"] },
          ],
        },
      }
      const data = {
        person: {
          favoritePhotos: [
            [
              {
                imageUrl: "httpblahbiddyblah1",
                note: "1st favorite",
              },
              {
                imageUrl: "httpblahbiddyblah2",
                public: false,
              },
            ],
            { obsoleteDataBlob: "AGb-A#A#+A+%A#DF-AC#" },
            { locationCoordinates: [[123, 456], [234, 567]] },
          ],
        },
      }
      const want = {
        url1: "httpblahbiddyblah1",
        favorite2: {
          imageUrl: "httpblahbiddyblah2",
          public: false,
        },
        location2: [234, 567],
      }
      expect(inspect(spec, data)).toEqual(want)
    })
  })
})
