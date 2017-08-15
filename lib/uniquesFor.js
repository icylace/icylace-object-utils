"use strict"

// Gets unique elements that exist in all given arrays.
const uniquesFor = (...a) => [...new Set([].concat(...a))]

module.exports = uniquesFor
