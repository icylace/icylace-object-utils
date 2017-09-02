"use strict"

/**
 * Convenience function for use with `examine`.
 *
 * @param {(any) => boolean} predicate - The function that checks a condition.
 * @param {string} prop - The name for a property.
 * @param {boolean | null} [detecting=null] - When true, verify the property is
 *     present in the examined object.  When false, verify it's not.  Else skip
 *     null
 *     of a property (`true`).
 *     - `true` - Check if the property is present in the examined object.
 *     - `false` - Check if the property is absent in the examined object.
 *     - `null` - Skip the existence check for the property.
 * @return {(any) => string | boolean | null} A function returning a property
 *     name if its argument passes its predicate, or a nullable boolean.
 */
function see(predicate, prop, detecting = null) {
  return value => predicate(value) ? prop : detecting
}

module.exports = see
