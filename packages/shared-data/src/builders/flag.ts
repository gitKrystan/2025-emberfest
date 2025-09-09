import { withReactiveResponse } from '@warp-drive/core/request';
import { buildBaseURL } from '@warp-drive/utilities';
import { updateRecord } from '@warp-drive/utilities/json-api';

import type { ApiFlag } from '../types';

export function queryFlags() {
  const url = buildBaseURL({ resourcePath: 'flag' });

  return withReactiveResponse<ApiFlag[]>({
    method: 'GET',
    url,

    op: 'query',
    cacheOptions: { types: ['flag'] },
  });
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
