"use strict"

/**
 * A combination of `inspect` and `whereAll`.
 *
 * @param {any} spec - Specification to use for validation and extraction.
 * @param {any} data - Data to be validated and possibly extracted from.
 * @param {Object} [props={}] - Properties object to assign extracted values to.
 * @return {Object | null} Either an object of extracted properties or null.
 */
function examine(spec, data, props = {}) {
  if (typeof data === "undefined") return typeof spec === "boolean" && !spec
  if (spec === null) return true
  if (spec === false) return false
  if (typeof spec === "number") return data === spec
  if (typeof spec === "string") return data === spec
  if (typeof spec === "symbol") return data === spec

  return Object.entries(spec).reduce((valid, [key, value]) => {
    if (typeof value === "function") {
      const result = value(data[key])
      if (!result) {
        return false
      } else if (typeof result === "string") {
        props[result] = data[key]
      }
    }
    return examine(value, data[key], props) ? valid : false
  }, true)
    ? props
    : null
}

module.exports = examine
