# see

```ts
see(predicate: (any) => boolean, prop: string, detecting: boolean | null = null): (any) => string | boolean | null
```

A convenience function for use with `examine`.

## Parameters

* `predicate`: The function that checks a condition.
* `prop`: The name for a property.
* `detecting`: The value to use if the predicate fails.

## Return value

A function returning a property name if its argument passes its predicate. If the predicate fails, either a boolean or null is returned.

The meaning of the returned value is interpreted by `examine` as follows:

* When `true`, check if the property is present in the examined object.
* When `false`, check if the property is absent in the examined object.
* When `null`, skip the existence check for the property.
