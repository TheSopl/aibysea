export function isNonNull<T>(value: T | null | undefined): value is T {
  return value != null
}

export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`)
}
