"use strict"

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
