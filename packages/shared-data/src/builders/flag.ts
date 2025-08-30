import type { Type } from '@warp-drive/core/types/symbols';
import { updateRecord } from '@warp-drive/utilities/json-api';

export interface BaseApiFlag {
  [Type]: 'flag';
}

export interface ErrorFlag extends BaseApiFlag {
  name: 'shouldError';
  value: boolean;
}

export interface TodoCountFlag extends BaseApiFlag {
  name: 'initialTodoCount';
  value: number;
}

export type ApiFlag = ErrorFlag | TodoCountFlag;

export function updateFlag(flag: ApiFlag) {
  return updateRecord(flag, { resourcePath: 'flag' });
}
