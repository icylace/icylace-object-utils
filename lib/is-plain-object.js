"use strict"

/**
 * Checks if a value is a plain object.
 *
 * Based on:
 * http://stackoverflow.com/a/38555871/1935675
 */
const isPlainObject = obj => {
  return obj !== null
      && typeof obj === "object"
      && (!obj.constructor || obj.constructor === Object)
      && {}.toString.call(obj) === "[object Object]"
}

module.exports = isPlainObject
