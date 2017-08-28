"use strict"

/**
 * Convenience function for use with `examine`.
 *
 * @param {(any) => boolean} cond - The predicate function.
 * @param {string} prop - The name for a property.
 * @param {boolean | null} [detecting=null] - A flag for checking the presence
 *     of a property.
 *     - `true` - check if the property is present in the test object.
 *     - `false` - check if the property is absent in the test object.
 *     - `null` - skip the existence check for the property.
 * @return {(any) => string | boolean | null} A function returning a property
 *     name if its argument passes its predicate, or a nullable boolean.
 */
const see = (cond, prop, detecting = null) => value => cond(value) ? prop : detecting

module.exports = see
