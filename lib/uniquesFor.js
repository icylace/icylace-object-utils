"use strict"

/**
 * Gets elements that are unique throughout a given group of arrays.
 *
 * @param {...any[]} a - A group of arrays to get unique elements from.
 * @return {any[]} An array of unique elements.
 */
function uniquesFor(...a) {
  return [...new Set([].concat(...a))]
}

module.exports = uniquesFor
