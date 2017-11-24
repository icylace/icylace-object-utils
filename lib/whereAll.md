# `whereAll(spec: any, data: any): boolean`

An alternative to Ramda's [`where`](http://ramdajs.com/docs/#where) that has the following differences:

1. `whereAll` can take specs that can contain a nested structure.
2. `whereAll` specs can use shorthands for property detection:
   * `true` - check if the property is present in the test object.
   * `false` - check if the property is absent in the test object.
   * `null` - skip the existence check for the property.

## Parameters

* `spec`: Specification to validate against.
* `data`: Data to be validated.

## Return value

True if the data passed the specification.

## See also

* https://github.com/ramda/ramda/wiki/Cookbook#whereall-sort-of-like-a-recursive-version-of-ramdas-where
