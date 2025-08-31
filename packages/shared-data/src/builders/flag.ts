import { query, updateRecord } from '@warp-drive/utilities/json-api';

import type { ApiFlag } from '../types';

export function queryFlags() {
  return query<ApiFlag>('flag', {}, { resourcePath: 'flag' });
}

export function updateFlag(flag: ApiFlag) {
  const requestInfo = updateRecord(flag, { resourcePath: 'flag' });
  requestInfo.body = JSON.stringify({
    data: {
      type: 'flag',
      id: flag.id,
      attributes: {
        value: flag.value,
      },
    },
  });
  return requestInfo;
}
