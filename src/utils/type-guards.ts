export function isIncluded<T extends string>(
  array: ReadonlyArray<T>,
  value: unknown,
): value is T {
  return array.includes(value as T);
}
