"use strict"

/**
 * An alternative to Ramda's `where` that has the following differences:
 *     1. `whereAll` can take specs containing a nested structure.
 *     2. `whereAll` specs can use shorthands for property detection:
 *         `true` - check if the property is present in the test object.
 *         `false` - check if the property is absent in the test object.
 *         `null` - skip the existence check for the property.
 *     3. `whereAll` specs can be shorter than similar `R.where` specs.
 *     4. `whereAll` is much slower than `R.where` in most scenarios.
 *
 * See also:
 * https://github.com/ramda/ramda/wiki/Cookbook#whereall-sort-of-like-a-recursive-version-of-ramdas-where
 */
const whereAll = (spec, obj) => {
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
      if (!whereAll(value, obj[key])) {
        return false
      }
    } else if (!value(obj[key])) {
      return false
    }
    return valid
  }, true)
}

module.exports = whereAll
