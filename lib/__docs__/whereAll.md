# `whereAll(spec: any, data: any): boolean`

Checks if the given data satisfies a given specification.

## Parameters

* `spec`: Specification to validate against. It is usually an object (including arrays) that could be nested. If so, each of its own properties are applied to the value of the corresponding property of the data object. The effect of the application depends upon the value of the specification property:

  * A _predicate function_ gets applied to the value of the data object property.
  * `true` checks if the property is present in the test object.
  * `false` checks if the property is absent in the test object.
  * `null` skips the existence check for the property.

  If `spec` is not an object then `data` is validated against it as-is.

* `data`: Data to be validated. If `spec` is an object and `data` is not an object then the given data is invalid.

## Return value

True if the data passed the specification check.

## See also

* http://ramdajs.com/docs/#where
* https://github.com/ramda/ramda/wiki/Cookbook#whereall-sort-of-like-a-recursive-version-of-ramdas-where
