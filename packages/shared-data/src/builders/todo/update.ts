import { withReactiveResponse } from '@warp-drive/core/request';
import type { RequestInfo } from '@warp-drive/core/types/request';
import { buildBaseURL } from '@warp-drive/utilities';

import type Store from '../../stores/index.ts';
import type { Todo, TodoAttributes } from '../../types/index.ts';
import { getActiveTodos, getCompletedTodos } from './query.ts';
import type { ReactiveTodoDocument } from './types';
import { keyForRequest, keyForSavedResource } from './utils.ts';

/**
 * PATCH /api/todo/:id
 *
 * @param todo - The todo to update
 * @param attributes - The attributes to patch
 */
export function patchTodo(
  todo: Todo,
  attributes: Partial<TodoAttributes>,
): RequestInfo<ReactiveTodoDocument> {
  const key = keyForSavedResource(todo);

  const url = buildBaseURL({
    op: 'updateRecord',
    resourcePath: 'todo',
    identifier: key,
  });

  return withReactiveResponse<Todo>({
    method: 'PATCH',
    url,
    body: JSON.stringify({
      data: {
        type: 'todo',
        id: todo.id,
        attributes,
      },
    }),

    op: 'updateRecord',
    records: [key],
  });
}

/**
 * Moves a completed todo to the "completed" list and removes it from the
 * "active" list.
 *
 * While the `DefaultCachePolicy` in our store will automatically patch
 * the updated _attributes_ for any requests with the 'query' OpCode that
 * include this record in their results, it cannot automatically move the
 * record between different queries (e.g. active vs completed todos).
 *
 * This is because while these queries are subscribed to notifications for
 * the records they return, they explicitly do not subscribe to changes in
 * the records they don't return.
 *
 * Thus, we need to manually patch the request documents stored in the cache
 * to ensure they update.
 *
 * @param store - The store instance
 * @param todo - The todo to mark as completed
 */
export function patchCacheTodoCompleted(
  store: Store,
  todo: Todo,
  options?: { invalidateCounts?: boolean },
) {
  const resourceKey = keyForSavedResource(todo);
  const completedRequestKey = keyForRequest(store, getCompletedTodos());
  const activeRequestKey = keyForRequest(store, getActiveTodos());

  // Add to "completed"
  if (store.cache.peekRequest(completedRequestKey)) {
    store.cache.patch({
      record: completedRequestKey,
      op: 'add',
      value: resourceKey,
      field: 'data',
      index: 0,
    });
  }
  // Remove from "active"
  if (store.cache.peekRequest(activeRequestKey)) {
    store.cache.patch({
      record: activeRequestKey,
      op: 'remove',
      value: resourceKey,
      field: 'data',
    });
  }

  if (options?.invalidateCounts ?? true) {
    store.lifetimes.invalidateRequestsForType('todo-count', store);
  }
}

/**
 * Moves an active todo to the "active" list and removes it from the
 * "completed" list.
 *
 * While the `DefaultCachePolicy` in our store will automatically patch
 * the updated _attributes_ for any requests with the 'query' OpCode that
 * include this record in their results, it cannot automatically move the
 * record between different queries (e.g. active vs completed todos).
 *
 * This is because while these queries are subscribed to notifications for
 * the records they return, they explicitly do not subscribe to changes in
 * the records they don't return.
 *
 * Thus, we need to manually patch the request documents stored in the cache
 * to ensure they update.
 *
 * @param store - The store instance
 * @param todo - The todo that to mark as activated
 */
export function patchCacheTodoActivated(
  store: Store,
  todo: Todo,
  options?: { invalidateCounts?: boolean },
) {
  const resourceKey = keyForSavedResource(todo);
  const completedRequestKey = keyForRequest(store, getCompletedTodos());
  const activeRequestKey = keyForRequest(store, getActiveTodos());

  // FIXME: Set a real index on these.
  // Add to "active"
  if (store.cache.peekRequest(activeRequestKey)) {
    store.cache.patch({
      record: activeRequestKey,
      op: 'add',
      value: resourceKey,
      field: 'data',
      index: 0,
    });
  }
  // Remove from "completed"
  if (store.cache.peekRequest(completedRequestKey)) {
    store.cache.patch({
      record: completedRequestKey,
      op: 'remove',
      value: resourceKey,
      field: 'data',
    });
  }

  if (options?.invalidateCounts ?? true) {
    store.lifetimes.invalidateRequestsForType('todo-count', store);
  }
}
