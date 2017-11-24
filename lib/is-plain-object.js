"use strict"

/**
 * Checks if a value is a plain object.
 *
 * Based on:
 * http://stackoverflow.com/a/38555871/1935675
 *
 * @param {any} it - The value to check whether or not it's a plain object.
 * @return {boolean} True if it's a plain object.
 */
function isPlainObject(it) {
  // prettier-ignore
  return it !== null
      && typeof it === "object"
      && (!it.constructor || it.constructor === Object)
      && {}.toString.call(it) === "[object Object]"
}

module.exports = isPlainObject
