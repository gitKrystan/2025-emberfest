import type { Type } from '@warp-drive/core/types/symbols';

export interface BaseApiFlag {
  /** Type-only brand */
  readonly [Type]: 'flag';
  /** $type attribute managed by the store */
  readonly $type: 'flag';
}

// Initial Todo Count

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

// Should Paginate

interface HasShouldPaginateFlagId {
  id: 'shouldPaginateFlag';
}

export interface ShouldPaginateFlagAttributes {
  value: boolean;
}

export interface ShouldPaginateFlag
  extends BaseApiFlag,
    HasShouldPaginateFlagId,
    Readonly<ShouldPaginateFlagAttributes> {}

export interface EditableShouldPaginateFlag
  extends BaseApiFlag,
    HasShouldPaginateFlagId,
    ShouldPaginateFlagAttributes {}

// Should Error

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

// Latency

interface HasLatencyFlagId {
  id: 'latency';
}

export interface LatencyFlagAttributes {
  /** Must be positive */
  value: number;
}

export interface LatencyFlag
  extends BaseApiFlag,
    HasLatencyFlagId,
    Readonly<LatencyFlagAttributes> {}

export interface EditableLatencyFlag
  extends BaseApiFlag,
    HasLatencyFlagId,
    LatencyFlagAttributes {}

export type ApiFlag =
  | ShouldErrorFlag
  | TodoCountFlag
  | ShouldPaginateFlag
  | LatencyFlag;
