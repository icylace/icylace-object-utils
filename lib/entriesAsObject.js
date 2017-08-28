"use strict"

/**
 * Converts an array of key-value pairs into an object.
 *
 * Based on:
 * https://gist.github.com/lukehorvat/133e2293ba6ae96a35ba
 *
 * @param {[string | number, any][]} entries - An array of key-value pairs.
 * @return {Object} An object whose keys are the first elements of the entries
 *     and whose values are the second elements of the entries.
 */
const entriesAsObject = entries => entries.reduce((o, [k, v]) => (o[k] = v, o), {})

module.exports = entriesAsObject
