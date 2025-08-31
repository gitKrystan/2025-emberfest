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
