import type { ReactiveDataDocument } from '@warp-drive/core/reactive';

// A type that can infer T from ReactiveDataDocument<T[]>
export type InferDocumentArrayType<D> =
  D extends ReactiveDataDocument<(infer T)[]> ? T : never;
