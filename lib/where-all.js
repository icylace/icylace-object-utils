"use strict"

/**
 * An alternative to Ramda's `where` that has the following differences:
 *     1. `whereAll` can take specs that can contain a nested structure.
 *     2. `whereAll` specs can use shorthands for property detection:
 *         `true` - check if the property is present in the test object.
 *         `false` - check if the property is absent in the test object.
 *         `null` - skip the existence check for the property.
 *
 * See also:
 * https://github.com/ramda/ramda/wiki/Cookbook#whereall-sort-of-like-a-recursive-version-of-ramdas-where
 *
 * @param {any} spec - Specification to validate against.
 * @param {any} data - Data to be validated.
 * @return {boolean} True if the data passed the specification.
 */
function whereAll(spec, data) {
  if (typeof data === "undefined") return typeof spec === "boolean" && !spec
  if (spec === null) return true
  if (spec === false) return false
  if (typeof spec === "number") return data === spec
  if (typeof spec === "string") return data === spec
  if (typeof spec === "symbol") return data === spec

  return Object.entries(spec).reduce((valid, [key, value]) => {
    if (typeof value === "function" && !value(data[key])) {
      return false
    }
    return whereAll(value, data[key]) ? valid : false
  }, true)
}

module.exports = whereAll
