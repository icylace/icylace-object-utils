declare namespace IcylaceObjectUtils {
  export function entriesAsObject(entries: [string | number, any][]): Object
  export function examine(spec: any, data: any, props?: Object): Object | null
  export function inspect(spec: any, data: any): Object
  export function isPlainObject(it: any): boolean
  export function see(predicate: (value: any) => boolean, prop: string, detecting?: boolean | null): (value: any) => string | boolean | null
  export function uniquesFor(...a: any[]): any[]
  export function whereAll(spec: any, data: any): boolean
}

export = IcylaceObjectUtils
