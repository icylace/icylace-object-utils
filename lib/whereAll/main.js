const { curry, forEachObjIndexed, keys } = R

//
// An alternative to Ramda's `where` that has the following differences:
//     1. `whereAll` can take specs containing a nested structure.
//     2. `whereAll` specs can use shorthands for property detection:
//         `true` - check if the property is present in the test object.
//         `false` - check if the property is absent in the test object.
//         `null` - skip the existence check for the property.
//     3. `whereAll` specs can be shorter than similar `R.where` specs.
//     4. `whereAll` is much slower than `R.where` in most scenarios.
//
// When you need to do checks on nested structures and processor speed
// is not the bottleneck, `whereAll` is a nice alternative to `R.where`.
//
const whereAll = curry((spec, obj) => {
  if (typeof obj === "undefined") {
    if (spec === null || typeof spec === "boolean") {
      return !spec
    }
    return false
  } else if (spec === false) {
    return false
  }
  let output = true
  forEachObjIndexed((v, k) => {
    if (v === null || typeof v === "boolean" || keys(v).length) {
      if (!whereAll(v, obj[k])) {
        output = false
      }
    } else if (!v(obj[k])) {
      output = false
    }
  }, spec)
  return output
})

// -----------------------------------------------------------------------------

// Ramda's `where` vs. my `whereAll` - Part 1 - Single Property Tests

const data = [
  '{ Z: 1 }',
  "{ q: undefined }",
  "{ q: null }",
  "{ q: false }",
  "{ q: true }",
  "{ q: Infinity }",
  "{ q: 1 }",
  "{ q: 0 }",
  "{ q: NaN }",
  '{ q: "" }',
]

const specs = [
  "{ q: null }",
  "{ q: true }",
  "{ q: false }",
  "{ q: R.identity }",
  "{ q: R.equals(true) }",
  "{ q: R.equals(false) }",
  "{ q: R.equals(null) }",
  "{ q: R.equals(undefined) }",
  "{ q: R.identical(true) }",
  "{ q: R.identical(false) }",
  "{ q: R.identical(null) }",
  "{ q: R.identical(undefined) }",
  "{ q: R.always(true) }",
  "{ q: R.always(false) }",
  "{ q: R.always(null) }",
  "{ q: R.always(undefined) }",
  "{ q: Infinity }",
  "{ q: 1 }",
  "{ q: 0 }",
  "{ q: NaN }",
  '{ q: "" }',
  "{ q: [] }",
  "{ q: {} }",
  "{ q: undefined }",
]

function generateTruthTable(f) {
  const table = {}
  for (let i in specs) {
    const row = {}
    const spec = eval(`(${specs[i]})`)
    for (let j in data) {
      let r
      try {
        r = f(spec, eval(`(${data[j]})`))
      } catch (_) {
        r = "⊥"
      }
      if (r) {
        row[data[j]] = r
      }
    }
    table[specs[i]] = row
  }
  return table
}

// -----------------------------------------------------------------------------

// Based on:
// http://stackoverflow.com/a/26892309/1935675
function htmlizeConsoleTable(table, tableClass = "consoleTable") {
  const columns = []
  // Find columns.
  for (const r in table) {
    for (const c in table[r]) {
      if (columns.indexOf(c) === -1) {
        columns.push(c)
      }
    }
  }
  // Build the HTML table.
  const rows = []
  for (const r in table) {
    rows.push(`<tr><th>${r}</th>` + columns.map((c) => `<td>${table[r][c] || ""}</td>`).join("") + "</tr>")
  }
  return `<table class='${tableClass}'><thead><tr><th></th>`
    + columns.map((c) => `<th>${c}</th>`).join("")
    + `</tr></thead><tbody>${rows.join("")}</tbody></table>`
}

// -----------------------------------------------------------------------------

const whereTable = generateTruthTable(R.where)
const whereAllTable = generateTruthTable(whereAll)

document.getElementById("whereTable").innerHTML = ""
  + "<hr><h2>Using `R.where`</h2>"
  + "<p>In the truth table shown below, `false` is omitted and errors are shown as `⊥` for sake of readability.  The rows are the specs and the columns are the data.</p>"
  + htmlizeConsoleTable(whereTable, "pure-table pure-table-striped")

document.getElementById("whereAllTable").innerHTML = ""
  + "<hr><h2>Using `whereAll`</h2>"
  + "<p>In the truth table shown below, `false` is omitted and errors are shown as `⊥` for sake of readability.  The rows are the specs and the columns are the data.</p>"
  + htmlizeConsoleTable(whereAllTable, "pure-table pure-table-striped")

console.clear()

// NOTE: Open up your browser's console instead of CodePen's console panel to
// see tables created by `console.table`.  You may need to reload the page
// after doing so to see the table get rendered in the console.

console.log("-".repeat(80))
console.log("Using `R.where`")
console.log("In the truth table shown below, `false` is omitted and errors are shown as `⊥` for sake of readability.  The rows are the specs and the columns are the data.")
console.table(whereTable)

console.log("\n\n" + "-".repeat(80))
console.log("Using `whereAll`")
console.log("In the truth table shown below, `false` is omitted and errors are shown as `⊥` for sake of readability.  The rows are the specs and the columns are the data.")
console.table(whereAllTable)

// MeasureThat.net benchmarks:
// https://www.measurethat.net/Benchmarks/ShowResult/4127

// -----------------------------------------------------------------------------

// Ramda's `where` vs. my `whereAll` - Part 2 - Example Code From the Documentation for `R.where`

QUnit.test("using `where`", (t) => {
  const check = R.where({
    a: R.equals("foo"),
    b: R.complement(R.equals("bar")),
    x: R.gt(R.__, 10),
    y: R.lt(R.__, 20),
  })

  t.ok(check({a: "foo", b: "xxx", x: 11, y: 19}))
  t.notOk(check({a: "xxx", b: "xxx", x: 11, y: 19}))
  t.notOk(check({a: "foo", b: "bar", x: 11, y: 19}))
  t.notOk(check({a: "foo", b: "xxx", x: 10, y: 19}))
  t.notOk(check({a: "foo", b: "xxx", x: 11, y: 20}))
})

QUnit.test("using `whereAll`", (t) => {
  const check = whereAll({
    a: R.equals("foo"),
    b: R.complement(R.equals("bar")),
    x: R.gt(R.__, 10),
    y: R.lt(R.__, 20),
  })

  t.ok(check({a: "foo", b: "xxx", x: 11, y: 19}))
  t.notOk(check({a: "xxx", b: "xxx", x: 11, y: 19}))
  t.notOk(check({a: "foo", b: "bar", x: 11, y: 19}))
  t.notOk(check({a: "foo", b: "xxx", x: 10, y: 19}))
  t.notOk(check({a: "foo", b: "xxx", x: 11, y: 20}))
})

// MeasureThat.net benchmarks:
// https://www.measurethat.net/Benchmarks/ShowResult/4128

// -----------------------------------------------------------------------------

// Ramda's `where` vs. my `whereAll` - Part 3 - Nested Spec
// https://measurethat.net/Benchmarks/ShowResult/4126

QUnit.test("nested spec", (t) => {
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
        [
          { j: 8, k: "nine" },
        ],
      ],
    },
  }

  const detect1 = R.where({
    a: R.where({
      h: R.where([
        R.always(true),
        Array.isArray,
        R.complement(R.identical(undefined)),
        R.where({ l: R.where({ m: R.where({ n: R.complement(R.identical(undefined)) }) }) }),
      ]),
    }),
  })

  const detect2 = whereAll({
    a: {
      h: [
        R.always(true),
        Array.isArray,
        R.complement(R.identical(undefined)),
        { l: { m: { n: R.complement(R.identical(undefined)) } } },
      ],
    },
  })

  const detect3 = whereAll({
    a: {
      h: [
        null,
        Array.isArray,
        true,
        { l: { m: { n: true } } },
      ],
    },
  })

  // Using `R.where`
  t.ok(detect1(data1))
  t.notOk(detect1(data2))

  // Using `whereAll`
  t.ok(detect2(data1))
  t.notOk(detect2(data2))

  // Using `whereAll` (alternate)
  t.ok(detect3(data1))
  t.notOk(detect3(data2))
})

// MeasureThat.net benchmarks:
// https://measurethat.net/Benchmarks/ShowResult/4133

// -----------------------------------------------------------------------------

QUnit.test("`whereAll` trials", (t) => {
  let spec, data, mustBe

  spec = { a: R.equals("hi"), b: { c: R.equals("bar") } }
  data = { a: "hi", b: { c: "bar" } }
  t.ok(whereAll(spec, data))

  spec = [R.equals("hi"), { c: R.equals("bar") }]
  data = ["hi", { c: "bar" }]
  t.ok(whereAll(spec, data))

  spec = [R.equals("hi"), { c: R.equals("bar") }, Array.isArray, null, R.is(String), [[R.is(String)]]]
  data = ["hi", { c: "bar" }, [345], "luahfoi", "jack", [["aa"]], "tyity"]
  t.ok(whereAll(spec, data))

  spec = [
    R.equals("hi"),
    { a: R.equals("bar") },
    Array.isArray,
    [{ b: R.is(String) }, { c: R.is(String) }],
    null,
    { e: R.is(Object) },
  ]
  data = [
    "hi",
    { a: "bar" },
    [345],
    [{ b: "asdf" }, { c: "uilyuoiy" }],
    "luahfoi",
    { d: "iuehrgi", e: { f: { g: { h: 234 } } } },
  ]
  t.ok(whereAll(spec, data))

  spec = [
    R.equals("hi"),
    { a: R.equals("bar") },
    Array.isArray,
    [{ b: R.is(String) }, { c: R.is(String) }],
    null,
    { e: R.is(Object) },
  ]
  data = [
    { a: "bar" },
    [345],
    [{ b: "asdf" }, { c: "uilyuoiy" }],
    "luahfoi",
    { d: "iuehrgi", e: { f: { g: { h: 234 } } } },
  ]
  t.notOk(whereAll(spec, data))
})

// -----------------------------------------------------------------------------

// See also:
// https://github.com/ramda/ramda/wiki/Cookbook#whereall-sort-of-like-a-recursive-version-of-ramdas-where
