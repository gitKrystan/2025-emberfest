import { withReactiveResponse } from '@warp-drive/core/request';
import type { RequestInfo } from '@warp-drive/core/types/request';
import { buildBaseURL, buildQueryParams } from '@warp-drive/utilities';

import type Store from '../../stores/index.ts';
import type { Todo } from '../../types/index.ts';
import type { ReactiveTodosDocument } from './types.ts';

/**
 * GET /todo
 * (plus pagination params)
 */
export function getAllTodos(): RequestInfo<ReactiveTodosDocument> {
  const url = buildBaseURL({ resourcePath: 'todo' });
  const queryString = buildQueryParams({
    'page[limit]': 25,
    'page[offset]': 0,
  });

  return withReactiveResponse<Todo[]>({
    method: 'GET',
    url: `${url}?${queryString}`,

    // Adding the 'query' OpCode and specifying the 'todo' type in
    // `cacheOptions` tells the `DefaultCachePolicy` in our store to
    // automatically invalidate this request when any request with the
    // 'createRecord' OpCode + 'todo' in `cacheOptions.type` succeeds.
    op: 'query',
    cacheOptions: { types: ['todo'] },
  });
}

/**
 * GET /todo?filter[completed]=true
 * (plus pagination params)
 */
export function getCompletedTodos(): RequestInfo<ReactiveTodosDocument> {
  const url = buildBaseURL({ resourcePath: 'todo' });
  const queryString = buildQueryParams({
    'filter[completed]': true,
    'page[limit]': 25,
    'page[offset]': 0,
  });

  return withReactiveResponse<Todo[]>({
    method: 'GET',
    url: `${url}?${queryString}`,

    op: 'query',
    cacheOptions: { types: ['todo'] },
  });
}

/**
 * GET /todo?completed=false
 */
export function getActiveTodos(): RequestInfo<ReactiveTodosDocument> {
  const url = buildBaseURL({ resourcePath: 'todo' });
  const queryString = buildQueryParams({
    'filter[completed]': false,
    'page[limit]': 25,
    'page[offset]': 0,
  });

  return withReactiveResponse<Todo[]>({
    method: 'GET',
    url: `${url}?${queryString}`,

    op: 'query',
    cacheOptions: { types: ['todo'] },
  });
}

export function invalidateAllTodoQueries(store: Store) {
  store.lifetimes.invalidateRequestsForType('todo', store);
}
