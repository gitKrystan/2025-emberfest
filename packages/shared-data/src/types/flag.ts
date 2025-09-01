import type {
  CollectionResourceDocument,
  ExistingResourceObject,
  SingleResourceDocument,
} from '@warp-drive/core/types/spec/json-api-raw';
import type { Type } from '@warp-drive/core/types/symbols';

export interface BaseApiFlag {
  [Type]: 'flag';
}

export interface ShouldErrorFlag extends BaseApiFlag {
  id: 'shouldError';
  value: boolean;
}

export interface TodoCountFlag extends BaseApiFlag {
  id: 'initialTodoCount';
  value: number;
}

export type ApiFlag = ShouldErrorFlag | TodoCountFlag;

export type ExistingFlagResource = ExistingResourceObject<'flag'>;
export type SingleFlagDocument = SingleResourceDocument<'flag'>;
export type CollectionFlagDocument = CollectionResourceDocument<'flag'>;
