import type {
  CollectionResourceDocument,
  ExistingResourceObject,
  SingleResourceDocument,
} from '@warp-drive/core/types/spec/json-api-raw';
import type { Type } from '@warp-drive/core/types/symbols';

export interface BaseApiFlag {
  /** Type-only brand */
  readonly [Type]: 'flag';
  /** $type attribute managed by the store */
  readonly $type: 'flag';
}

interface HasShouldErrorFlagId {
  id: 'shouldError';
}

export interface ShouldErrorFlagAttributes {
  value: boolean;
}

export interface ShouldErrorFlag
  extends BaseApiFlag,
    HasShouldErrorFlagId,
    Readonly<ShouldErrorFlagAttributes> {}

export interface EditableShouldErrorFlag
  extends BaseApiFlag,
    HasShouldErrorFlagId,
    ShouldErrorFlagAttributes {}

interface HasTodoCountFlagId {
  id: 'initialTodoCount';
}

export interface TodoCountFlagAttributes {
  /** Must be positive */
  value: number;
}

export interface TodoCountFlag
  extends BaseApiFlag,
    HasTodoCountFlagId,
    Readonly<TodoCountFlagAttributes> {}

export interface EditableTodoCountFlag
  extends BaseApiFlag,
    HasTodoCountFlagId,
    TodoCountFlagAttributes {}

export type ApiFlag = ShouldErrorFlag | TodoCountFlag;

export type ExistingFlagResource = ExistingResourceObject<'flag'>;
export type SingleFlagDocument = SingleResourceDocument<'flag'>;
export type CollectionFlagDocument = CollectionResourceDocument<'flag'>;
