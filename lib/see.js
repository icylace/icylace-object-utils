"use strict"

function see(predicate, prop, detecting = null) {
  return value => (predicate(value) ? prop : detecting)
}

module.exports = see
