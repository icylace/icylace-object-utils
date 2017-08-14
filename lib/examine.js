"use strict"

// A combination of `inspect` and `whereAll`.
const examine = (spec, obj, props = {}) => {
  if (typeof obj === "undefined") return typeof spec === "boolean" && !spec
  if (spec === null) return true
  if (spec === false) return false
  if (typeof spec === "number") return obj === spec
  if (typeof spec === "string") return obj === spec
  if (typeof spec === "symbol") return obj === spec

  return Object.entries(spec).reduce((valid, [key, value]) => {
    if (typeof value === "function") {
      const result = value(obj[key])
      if (!result) {
        return false
      } else if (typeof result === "string") {
        props[result] = obj[key]
      }
    }
    return examine(value, obj[key], props) ? valid : false
  }, true) ? props : null
}

// Convenience function for use with `examine`.
const see = (cond, prop, detecting = null) => value => cond(value) ? prop : detecting

module.exports = { examine, see }
