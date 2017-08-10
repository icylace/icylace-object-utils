const { curry, forEachObjIndexed, keys } = R

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

// // A combination of `inspect` and `whereAll`.
// const examine = curry((spec, obj) => {
//   const props = {}
//   function go(spec, obj) {
//     if (typeof obj === "undefined") {
//       if (spec === null || typeof spec === "boolean") {
//         return !spec
//       }
//       return false
//     } else if (spec === false) {
//       return false
//     }
//     let output = true
//     forEachObjIndexed((v, k) => {
//       if (v === null || typeof v === "boolean" || keys(v).length) {
//         if (!go(v, obj[k])) {
//           output = false
//         }
//       } else if (typeof v === "string") {
//         props[v] = obj[k]
//       } else {
//         const r = v(obj[k])
//         if (!r) {
//           output = false
//         } else if (typeof r === "string") {
//           props[r] = obj[k]
//         }
//       }
//     }, spec)
//     return output
//   }
//   return go(spec, obj) ? props : null
// })
//
// const { always, F, ifElse } = R
//
// // Convenience function for use with `examine`.
// const see = (c, p) => ifElse(c, always(p), F)

// A combination of `inspect` and `whereAll`.
const examine = curry((spec, obj) => {
  const props = {}

  const go = (spec, obj) => {
    if (typeof obj === "undefined") {
      if (spec === null || typeof spec === "boolean") {
        return !spec
      }
      return false
    } else if (spec === false) {
      return false
    }

    let output = true

    for (let [k, v] of Object.entries(spec)) {
      if (v === null || typeof v === "boolean" || Object.keys(v).length) {
        if (!go(v, obj[k])) {
          output = false
        }
      } else if (typeof v === "string") {
        props[v] = obj[k]
      } else {
        const r = v(obj[k])
        if (!r) {
          output = false
        } else if (typeof r === "string") {
          props[r] = obj[k]
        }
      }
    }

    return output
  }

  return go(spec, obj) ? props : null
})

// Convenience function for use with `examine`.
const see = (cond, prop) => value => cond(value) ? prop : null

// -----------------------------------------------------------------------------

QUnit.test("`examine` should work", (t) => {
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

  const probe1 = examine({
    a: {
      h: [
        null,
        R.ifElse(Array.isArray, R.always("foo"), R.F),
        true,
        { l: { m: R.ifElse(whereAll({ n: true }), R.always("bar"), R.F) } },
      ],
    },
  })

  const probe2 = examine({
    a: {
      h: [
        null,
        see(Array.isArray, "foo"),
        true,
        { l: { m: see(whereAll({ n: true }), "bar") } },
      ],
    },
  })

  t.deepEqual(probe1(data1), {
    foo: [
      { j: 6, k: 7 },
      { j: 8, k: "nine" },
    ],
    bar: { n: false },
  })
  t.deepEqual(probe1(data2), null)

  t.deepEqual(probe2(data1), {
    foo: [
      { j: 6, k: 7 },
      { j: 8, k: "nine" },
    ],
    bar: { n: false },
  })
  t.deepEqual(probe2(data2), null)
})
