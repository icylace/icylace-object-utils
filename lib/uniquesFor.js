"use strict"

function uniquesFor(...a) {
  return [...new Set([].concat(...a))]
}

module.exports = uniquesFor
