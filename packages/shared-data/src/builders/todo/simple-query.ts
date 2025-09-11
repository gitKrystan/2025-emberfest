import { withReactiveResponse } from '@warp-drive/core/request';
import type { RequestInfo } from '@warp-drive/core/types/request';
import { buildBaseURL, buildQueryParams } from '@warp-drive/utilities';

import type { Todo } from '../../types/index.ts';
import type { ReactiveTodosDocument } from './types.ts';

/** GET /api/todo */
export function getAllTodos(): RequestInfo<ReactiveTodosDocument> {
  return withReactiveResponse<Todo[]>({
    method: 'GET',
    url: buildBaseURL({ resourcePath: 'todo' }),

    op: 'query',
    cacheOptions: { types: ['todo'] },
  });
}

/** GET /api/todo?filter[completed]=true */
export function getCompletedTodos(): RequestInfo<ReactiveTodosDocument> {
  const url = buildBaseURL({ resourcePath: 'todo' });
  const queryString = buildQueryParams({
    'filter[completed]': true,
  });

  return withReactiveResponse<Todo[]>({
    method: 'GET',
    url: `${url}?${queryString}`,

    op: 'query',
    cacheOptions: { types: ['todo'] },
  });
}
