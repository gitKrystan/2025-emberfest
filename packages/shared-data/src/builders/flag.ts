import { updateRecord } from '@warp-drive/utilities/json-api';
import { query } from '@warp-drive/utilities/json-api';

import type { ApiFlag } from '../types';

export function queryFlags() {
  return query<ApiFlag>('flag', {}, { resourcePath: 'flag' });
}

export function updateFlag(flag: ApiFlag) {
  return updateRecord(flag, { resourcePath: 'flag' });
}
