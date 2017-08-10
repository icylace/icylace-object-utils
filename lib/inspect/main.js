const { curry, forEachObjIndexed } = R

//
// Retrieves values from a data structure according to a given spec which
// are then returned in an object keyed according to strings in the spec.
//
const inspect = curry((spec, obj) => {
  const props = {}
  function inspectProps(spec, obj) {
    forEachObjIndexed((v, k) => {
      const objValue = obj[k]
      if (typeof v === "string") {
        props[v] = objValue
      } else if (typeof objValue === "object") {
        inspectProps(v, objValue)
      }
    }, spec)
  }
  inspectProps(spec, obj)
  return props
})

// -----------------------------------------------------------------------------

QUnit.test("`inspect` should work", (t) => {
  // Strings in our spec serve two purposes:
  //   1. As markers for which parts of our data structure to extract.
  //   2. As the key names in our returned object which contain the data gathered.
  const spec = {
    a: {
      h: [
        null,
        [
          { j: "foo" },
          "bar"
        ],
        "baz"
      ]
    }
  }

  // Note that our data structure must "line-up" with the spec for things to work.
  const data1 = {
    a: {
      h: [
        { i: 5 },
        [
          { j: 6, k: 7 },
          { j: 8, k: "nine" }
        ],
        10
      ]
    }
  }

  // When data can't be extracted due to absence the returned object will
  // simply use `undefined` for the associated keys of the missing sections.
  const data2 = {
    a: {
      h: [
        { i: 5 },
        [
          { j: 8, k: "nine" }
        ]
      ]
    }
  }

  const inspector = inspect(spec)

  t.deepEqual(inspector(data1), {
    foo: 6,
    bar: {
      j: 8,
      k: "nine",
    },
    baz: 10,
  })
  t.deepEqual(inspector(data2), {
    foo: 8,
    bar: undefined,
    baz: undefined,
  })
})

// -----------------------------------------------------------------------------

QUnit.test("`inspect` should work again", (t) => {
  const spec = {
    person: {
      favoritePhotos: [
        [{ imageUrl: "url1" }, "favorite2"],
        null,
        { locationCoordinates: [null, "location2"] },
      ]
    }
  }

  const legacyData = {
    person: {
      favoritePhotos: [
        [
          { imageUrl: "httpblahbiddyblah1", note: "1st favorite" },
          { imageUrl: "httpblahbiddyblah2", public: false },
        ],
        { obsoleteDataBlob: "AGb-A#A#+A+%A#DF-AC#" },
        { locationCoordinates: [[123, 456], [234, 567]] },
      ],
    },
  }

  const inspector = inspect(spec)

  t.deepEqual(inspector(legacyData), {
    url1: "httpblahbiddyblah1",
    favorite2: {
      imageUrl: "httpblahbiddyblah2",
      public: false,
    },
    location2: [234, 567],
  })
})

// -----------------------------------------------------------------------------

QUnit.test("`inspect` trials", (t) => {
  let spec, data, mustBe

  spec   = { a: "foo" }
  data   = { a: 1 }
  mustBe = { foo: 1 }
  t.deepEqual(inspect(spec, data), mustBe)

  spec   = { a: "foo" }
  data   = { a: 1, b: 2 }
  mustBe = { foo: 1 }
  t.deepEqual(inspect(spec, data), mustBe)

  spec   = { a: [{ b: "foo" }] }
  data   = { a: [{ b: 2 }] }
  mustBe = { foo: 2 }
  t.deepEqual(inspect(spec, data), mustBe)

  spec   = { a: "foo", b: "bar" }
  data   = { a: 1, b: 2 }
  mustBe = { foo: 1, bar: 2 }
  t.deepEqual(inspect(spec, data), mustBe)

  spec   = { a: "foo", b: { c: "bar" } }
  data   = { a: 1, b: { c: 3 } }
  mustBe = { foo: 1, bar: 3 }
  t.deepEqual(inspect(spec, data), mustBe)

  spec   = { a: "foo", b: { c: "bar" } }
  data   = { a: 1, b: { c: { d: 5 } } }
  mustBe = { foo: 1, bar: { d: 5 } }
  t.deepEqual(inspect(spec, data), mustBe)

  spec   = { a: "foo", b: { c: { d: "bar" } } }
  data   = { a: 1, b: { c: { d: 5 } } }
  mustBe = { foo: 1, bar: 5 }
  t.deepEqual(inspect(spec, data), mustBe)

  spec = {
    a: [{ b: "one" }],
    c: "two",
    d: { e: "three" },
    f: {
      g: "four",
      h: [[{ j: "six" }, { k: "nine" }]],
    },
  }
  data = {
    a: [{ b: 1 }],
    c: 2,
    d: { e: 3 },
    f: {
      g: [4],
      h: [
        { i: 5 },
        [{ j: 6, k: 7 }, { j: 8, k: 9 }],
        10,
      ],
    },
  }
  mustBe = {
    one: 1,
    two: 2,
    three: 3,
    four: [4],
  }
  t.deepEqual(inspect(spec, data), mustBe)
})

// MeasureThat.net benchmarks:
// https://www.measurethat.net/Benchmarks/ShowResult/4149

// -----------------------------------------------------------------------------

// See also:
// https://github.com/ramda/ramda/issues/2038
// https://github.com/ramda/ramda/wiki/Cookbook#use-a-spec-to-get-some-parts-of-a-data-structure
