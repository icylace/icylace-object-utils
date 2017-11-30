# examine

```ts
examine(spec: any, data: any, props: object = {}): object | null
```

A combination of `inspect` and `whereAll`.

## Parameters

* `spec`: Specification used for validation and extraction. For details, see the documentation for `whereAll`.
* `data`: Data to be validated and possibly extracted from.
* `props`: Properties object to assign extracted values to.

## Return value

Either an object of extracted properties or `null`.

## See also

* `inspect`
* `whereAll`
