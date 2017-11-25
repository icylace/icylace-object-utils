"use strict"

const jsv = require("jsverify")
const isPlainObject = require("./isPlainObject")

describe("the plain object checker", () => {
  test("does not validate an arbitrary boolean, character, datetime, falsy value, or number", () => {
    jsv.assert(jsv.forall("bool | char | datetime | falsy | number", it => isPlainObject(it) === false))
  })
})
