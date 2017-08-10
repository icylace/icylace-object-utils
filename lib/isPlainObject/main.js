//
// Checks if a value is a plain object.
//
// Based on:
// http://stackoverflow.com/a/38555871/1935675
//
function isPlainObject(obj) {
  return obj !== null
      && typeof obj === "object"
      && (!obj.constructor || obj.constructor === Object)
      && Object.prototype.toString.call(obj) === "[object Object]"
}

// -----------------------------------------------------------------------------

QUnit.test("`isPlainObject` trials", (t) => {
  t.ok(isPlainObject({}))
  t.ok(isPlainObject({ x: 0, y: 0 }))
  t.ok(isPlainObject(Object.create(null)))
  t.ok(isPlainObject(new Object()))
  t.ok(isPlainObject(Object()))

  // This is detected by the `null` check.
  t.notOk(isPlainObject(null))

  // These are detected by the `typeof` check.
  t.notOk(isPlainObject("P"))
  t.notOk(isPlainObject(5))
  t.notOk(isPlainObject(Number(5)))
  t.notOk(isPlainObject(Infinity))
  t.notOk(isPlainObject(NaN))
  t.notOk(isPlainObject(Object))
  t.notOk(isPlainObject(true))
  t.notOk(isPlainObject(false))
  t.notOk(isPlainObject(undefined))

  // These are detected by the `constructor` check.
  t.notOk(isPlainObject([]))
  t.notOk(isPlainObject([1, 2, 3]))
  t.notOk(isPlainObject(new Array()))
  t.notOk(isPlainObject(new Number(6)))
  t.notOk(isPlainObject(new (function Foo() {})()))
  t.notOk(isPlainObject(document.createElement("div")))

  // This is detected by the `toString` check.
  t.notOk(isPlainObject(Math))
})
