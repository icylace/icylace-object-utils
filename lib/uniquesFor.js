"use strict"

function uniquesFor(...these) {
  return [...new Set([].concat(...these))]
}

module.exports = uniquesFor
