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
 */
const whereAll = (spec, obj) => {
  if (typeof obj === "undefined") return typeof spec === "boolean" && !spec
  if (spec === null) return true
  if (spec === false) return false
  if (typeof spec === "number") return obj === spec
  if (typeof spec === "string") return obj === spec
  if (typeof spec === "symbol") return obj === spec

  return Object.entries(spec).reduce((valid, [key, value]) => {
    if (typeof value === "function" && !value(obj[key])) {
      return false
    }
    return whereAll(value, obj[key]) ? valid : false
  }, true)
}

module.exports = whereAll
