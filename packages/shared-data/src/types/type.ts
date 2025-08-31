import type { TypedRecordInstance } from '@warp-drive/core/types/record';
import type { Type } from '@warp-drive/core/types/symbols';

export function asType<V extends TypedRecordInstance>(
  value: Omit<V, typeof Type>,
): V {
  return value as V;
}
