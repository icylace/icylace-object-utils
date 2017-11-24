"use strict"

function inspect(spec, data) {
  return Object.entries(spec).reduce((props, [key, value]) => {
    if (typeof value === "string") {
      props[value] = data[key]
    } else if (value !== null && typeof data[key] === "object") {
      props = Object.assign(props, inspect(value, data[key]))
    }
    return props
  }, {})
}

module.exports = inspect
