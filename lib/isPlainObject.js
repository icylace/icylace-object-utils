"use strict"

function isPlainObject(it) {
  return it !== null
    && typeof it === "object"
    && (!it.constructor || it.constructor === Object)
    && {}.toString.call(it) === "[object Object]"
}

module.exports = isPlainObject
