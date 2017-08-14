"use strict"

// Convenience function for use with `examine`.
const see = (cond, prop, detecting = null) => value => cond(value) ? prop : detecting

module.exports = see
