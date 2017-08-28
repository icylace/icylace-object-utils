"use strict"

/**
 * Retrieves values from an input data structure according to a given spec
 * data structure which are then returned in an object keyed according to
 * strings in the spec.
 *
 * String values in our spec serve two purposes:
 *   1. As markers for which parts of the input data structure to extract.
 *   2. As the key names in our returned object which contain the data gathered.
 *
 * The spec can also use null values which enable it to avoid needing to match
 * certain elements of an array.
 *
 * A null value can also be used to skip over matching certain properties of an
 * object but this less useful because you can simply leave those properties
 * out of the spec.
 *
 * We want our spec and our input data structure to "line-up" in order for
 * the matching to work.
 *
 * When data can't be extracted due to absence, the returned object will
 * use `undefined` for the keys associated with the missing sections.
 *
 * See also:
 * https://github.com/ramda/ramda/issues/2038
 * https://github.com/ramda/ramda/wiki/Cookbook#use-a-spec-to-get-some-parts-of-a-data-structure
 *
 * @param {any} spec - Specification used for extraction.
 * @param {any} data - Data to be extracted from.
 * @return {Object}
 *
 * @example
 * const spec = {
 *   a: [
 *     null,
 *     [{ j: "foo" }, "bar"],
 *     "baz",
 *   ],
 * }
 *
 * console.log(inspect(spec, {
 *   a: [
 *     { b: 1 },
 *     [
 *       { c: 2, d: 3 },
 *       { c: 4, d: "quux" },
 *     ],
 *     10,
 *   ],
 * }))
 * // Prints: { foo: undefined, bar: { c: 4, d: "quux" }, baz: 10 }
 *
 * console.log(inspect(spec, {
 *   a: [
 *     { b: 1 },
 *     [{ c: 4, d: "quux" }],
 *     10,
 *   ],
 * }))
 * // Prints: { foo: undefined, bar: undefined, baz: 10 }
 */
const inspect = (spec, data) => Object.entries(spec).reduce((props, [key, value]) => {
  if (typeof value === "string") {
    props[value] = data[key]
  } else if (value !== null && typeof data[key] === "object") {
    props = Object.assign(props, inspect(value, data[key]))
  }
  return props
}, {})

module.exports = inspect
