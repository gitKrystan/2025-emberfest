export function mergeOptions<T extends object>(
  current: T,
  toMerge: NoInfer<Partial<T>>,
): T;
export function mergeOptions<T extends object>(
  current: T | null | undefined,
  toMerge: NoInfer<T>,
): T;
export function mergeOptions<T extends object>(
  current: T | null | undefined,
  toMerge: T | NoInfer<Partial<T>>,
): T {
  return Object.assign<Partial<T>, Partial<T>, Partial<T>>(
    {},
    current ?? {},
    toMerge,
  ) as T;
}
