"use strict"

function entriesAsObject(entries) {
  return entries.reduce((o, [k, v]) => ((o[k] = v), o), {})
}

module.exports = entriesAsObject
