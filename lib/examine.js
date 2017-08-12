"use strict"

// A combination of `inspect` and `whereAll`.
const examine = (spec, obj) => {
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

    if (spec === null) {
      return true
    }

    return Object.entries(spec).reduce((valid, [key, value]) => {
      if (value === null || typeof value === "boolean" || Object.keys(value).length) {
        if (!go(value, obj[key])) {
          return false
        }
      } else if (typeof value === "string") {
        props[value] = obj[key]
      } else {
        const r = value(obj[key])
        if (!r) {
          return false
        } else if (typeof r === "string") {
          props[r] = obj[key]
        }
      }
      return valid
    }, true)
  }

  return go(spec, obj) ? props : null
}

// Convenience function for use with `examine`.
const see = (cond, prop) => value => cond(value) ? prop : null

module.exports = { examine, see }
