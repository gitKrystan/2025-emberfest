export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

export type ExactPartial<T> = {
  [K in keyof T]?: T[K] | undefined;
};
