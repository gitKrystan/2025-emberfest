import { withReactiveResponse } from '@warp-drive/core/request';
import type { RequestInfo } from '@warp-drive/core/types/request';
import { buildBaseURL, buildQueryParams } from '@warp-drive/utilities';

import type Store from '../../stores/index.ts';
import type { Todo } from '../../types/index.ts';
import type { ReactiveTodosDocument } from './types.ts';

/** GET /api/todo (plus pagination params) */
export function getAllTodos(page?: number): RequestInfo<ReactiveTodosDocument> {
  const url = buildBaseURL({ resourcePath: 'todo' });
  const queryString = buildQueryParams({
    'page[limit]': 10,
    'page[offset]': typeof page === 'number' ? (page - 1) * 10 : 0,
  });

  return withReactiveResponse<Todo[]>({
    method: 'GET',
    url: `${url}?${queryString}`,

    op: 'query',
    cacheOptions: { types: ['todo'] },
  });
}

/**
 * GET /api/todo?filter[completed]=true
 * (plus pagination params)
 */
export function getCompletedTodos(
  page?: number,
): RequestInfo<ReactiveTodosDocument> {
  const url = buildBaseURL({ resourcePath: 'todo' });
  const queryString = buildQueryParams({
    'filter[completed]': true,
    'page[limit]': 10,
    'page[offset]': typeof page === 'number' ? (page - 1) * 10 : 0,
  });

  return withReactiveResponse<Todo[]>({
    method: 'GET',
    url: `${url}?${queryString}`,

    op: 'query',
    cacheOptions: { types: ['todo'] },
  });
}

/**
 * GET /api/todo?completed=false
 */
export function getActiveTodos(
  page?: number,
): RequestInfo<ReactiveTodosDocument> {
  const url = buildBaseURL({ resourcePath: 'todo' });
  const queryString = buildQueryParams({
    'filter[completed]': false,
    'page[limit]': 10,
    'page[offset]': typeof page === 'number' ? (page - 1) * 10 : 0,
  });

  return withReactiveResponse<Todo[]>({
    method: 'GET',
    url: `${url}?${queryString}`,

    op: 'query',
    cacheOptions: { types: ['todo'] },
  });
}

export function invalidateAllTodoQueries(store: Store) {
  // store.lifetimes === our DefaultCachePolicy instance
  store.lifetimes.invalidateRequestsForType('todo', store);
}

/*













Comment so that Slidev can scroll invalidateAllTodoQueries to the middle





*/
