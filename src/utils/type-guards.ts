export function isIncluded<T extends string>(
  array: ReadonlyArray<T>,
  value: string | null | undefined,
): value is T {
  return array.includes(value as T);
}
