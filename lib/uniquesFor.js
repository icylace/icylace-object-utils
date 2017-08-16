"use strict"

// Gets elements that are unique throughout a given set of arrays.
const uniquesFor = (...a) => [...new Set([].concat(...a))]

module.exports = uniquesFor
