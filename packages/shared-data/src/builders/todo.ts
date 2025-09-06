import type { Store } from '@warp-drive/core';
import { recordIdentifierFor } from '@warp-drive/core';
import { assert } from '@warp-drive/core/build-config/macros';
import type { ReactiveDataDocument } from '@warp-drive/core/reactive';
import { withReactiveResponse } from '@warp-drive/core/request';
import type {
  PersistedResourceKey,
  RequestKey,
} from '@warp-drive/core/types/identifier';
import type { RequestInfo } from '@warp-drive/core/types/request';
import { buildBaseURL, buildQueryParams } from '@warp-drive/utilities';

import { isExisting } from '../index.ts';
import type { Todo, TodoAttributes } from '../types/index.ts';

export type ReactiveTodoDocument = ReactiveDataDocument<Todo>;
export type ReactiveTodosDocument = ReactiveDataDocument<Todo[]>;

/**
 * GET /todo
 */
export function getAllTodos(): RequestInfo<ReactiveTodosDocument> {
  return withReactiveResponse<Todo[]>({
    method: 'GET',
    url: buildBaseURL({ resourcePath: 'todo' }),

    // Adding the 'query' OpCode and specifying the 'todo' type in
    // `cacheOptions` tells the `DefaultCachePolicy` in our store to
    // automatically invalidate this request when any request with the
    // 'createRecord' OpCode + 'todo' in `cacheOptions.type` succeeds.
    op: 'query',
    cacheOptions: { types: ['todo'] },
  });
}

/**
 * GET /todo?completed=true
 */
export function getCompletedTodos(): RequestInfo<ReactiveTodosDocument> {
  const url = buildBaseURL({ resourcePath: 'todo' });
  const queryString = buildQueryParams({ completed: true });

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
  const queryString = buildQueryParams({ completed: false });

  return withReactiveResponse<Todo[]>({
    method: 'GET',
    url: `${url}?${queryString}`,

    op: 'query',
    cacheOptions: { types: ['todo'] },
  });
}

/**
 * POST /todo
 */
export function createTodo(
  attributes: TodoAttributes,
): RequestInfo<ReactiveTodoDocument> {
  return withReactiveResponse<Todo>({
    method: 'POST',
    url: buildBaseURL({ resourcePath: 'todo' }),
    body: JSON.stringify({
      data: {
        type: 'todo',
        attributes,
      },
    }),

    // Adding the 'createRecord' OpCode and specifying the 'todo' type in
    // `cacheOptions` tells the `DefaultCachePolicy` in our store to
    // automatically invalidate any requests with the 'query' OpCode + 'todo'
    // in their `cacheOptions.type` when this request succeeds.
    op: 'createRecord',
    cacheOptions: { types: ['todo'] },
  });
}

/**
 * PATCH /todo/:id
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
    url,
    method: 'PATCH',
    body: JSON.stringify({
      data: {
        type: 'todo',
        id: todo.id,
        attributes,
      },
    }),

    // Adding the 'updateRecord' OpCode and specifying the `ResourceKey` for
    // this todo in the `records` array tells the `DefaultCachePolicy` in our
    // store that when this request succeeds it should automatically patch
    // the returned attributes into any matching resources in any cached
    // documents for requests with the 'query' OpCode that include this
    // record in their results when this request succeeds.
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
export function patchCacheTodoCompleted(store: Store, todo: Todo) {
  const resourceKey = keyForSavedResource(todo);
  const completedRequestKey = keyForRequest(store, getCompletedTodos());
  const activeRequestKey = keyForRequest(store, getActiveTodos());

  // Add to "completed"
  store.cache.patch({
    record: completedRequestKey,
    op: 'add',
    value: resourceKey,
    field: 'data',
    index: 0,
  });
  // Remove from "active"
  store.cache.patch({
    record: activeRequestKey,
    op: 'remove',
    value: resourceKey,
    field: 'data',
  });
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
export function patchCacheTodoActivated(store: Store, todo: Todo) {
  const resourceKey = keyForSavedResource(todo);
  const completedRequestKey = keyForRequest(store, getCompletedTodos());
  const activeRequestKey = keyForRequest(store, getActiveTodos());

  // FIXME: Set a real index on these.
  // Add to "active"
  store.cache.patch({
    record: activeRequestKey,
    op: 'add',
    value: resourceKey,
    field: 'data',
    index: 0,
  });
  // Remove from "completed"
  store.cache.patch({
    record: completedRequestKey,
    op: 'remove',
    value: resourceKey,
    field: 'data',
  });
}

export function bulkPatchTodos(
  todos: Todo[],
  attributes: Partial<TodoAttributes>,
): RequestInfo<ReactiveTodosDocument> {
  assert('No todos passed to bulk patch', todos.length > 0);
  const keys = todos.map((todo) => keyForSavedResource(todo));

  const url = buildBaseURL({ resourcePath: 'todo' });

  return withReactiveResponse<Todo[]>({
    method: 'PATCH',
    url: `${url}/ops.bulk.patch`,
    body: JSON.stringify({
      data: keys.map((key) => ({
        type: key.type,
        id: key.id,
      })),
      attributes,
    }),

    // Adding the 'updateRecord' OpCode and specifying the `ResourceKey`s for
    // these todos in the `records` array tells the `DefaultCachePolicy` in our
    // store that when this request succeeds it should automatically patch
    // the returned attributes into any matching resources in any cached
    // documents for requests with the 'query' OpCode that include these
    // records in their results when this request succeeds.
    op: 'updateRecord',
    records: keys,
  });
}

// FIXME: Check w/ @runspired that this isn't totally ridiculous
export function bulkPatchCacheTodos(
  store: Store,
  todos: Todo[],
  attributes: Partial<TodoAttributes>,
) {
  for (const todo of todos.toReversed()) {
    const resourceKey = keyForSavedResource(todo);

    // If the `completed` attribute is being changed, we need to move the
    // todo between the "active" and "completed" lists as needed.
    if ('completed' in attributes) {
      const wasCompleted = todo.completed;
      const isCompleted = attributes.completed;

      if (isCompleted && !wasCompleted) {
        patchCacheTodoCompleted(store, todo);
      } else if (!isCompleted && wasCompleted) {
        patchCacheTodoActivated(store, todo);
      }
    }

    // Finally, patch the attributes into the cached resource
    store.cache.upsert(resourceKey, { ...resourceKey, attributes }, true);
  }
}

/**
 * DELETE /todo/:id
 *
 * @param todo - The todo to delete
 */
export function deleteTodo(todo: Todo) {
  const key = keyForSavedResource(todo);

  const url = buildBaseURL({
    op: 'deleteRecord',
    resourcePath: 'todo',
    identifier: key,
  });

  return withReactiveResponse<Todo>({
    url,
    method: 'DELETE',

    // Adding the 'deleteRecord' OpCode and specifying the `ResourceKey` for
    // this todo in the `records` array tells the cache that when this
    // request succeeds it should automatically remove any matching resources
    // from any cached documents for any requests that include this record
    // in their results.
    op: 'deleteRecord',
    records: [key],
  });
}

/**
 * DELETE /todo/ops.bulk.delete
 *
 * @param todos - The todos to delete
 */
export function bulkDeleteTodos(
  todos: Todo[],
): RequestInfo<ReactiveTodosDocument> {
  assert('No todos passed to bulk delete', todos.length > 0);
  const keys = todos.map(keyForSavedResource);

  const url = buildBaseURL({ resourcePath: 'todo' });

  return withReactiveResponse<Todo[]>({
    method: 'DELETE',
    url: `${url}/ops.bulk.delete`,
    body: JSON.stringify({
      data: keys.map((key) => ({
        type: key.type,
        id: key.id,
      })),
    }),

    // Adding the 'deleteRecord' OpCode and specifying the `ResourceKey`s for
    // these todos in the `records` array tells the cache that when this
    // request succeeds it should automatically remove any matching resources
    // from any cached documents for any requests that include these records
    // in their results.
    op: 'deleteRecord',
    records: keys,
  });
}

function keyForSavedResource(resource: Todo): PersistedResourceKey<'todo'> {
  const key = recordIdentifierFor(resource);
  assert('Expected key to have type and id', isExisting(key));
  return key;
}

function keyForRequest(store: Store, request: RequestInfo): RequestKey {
  const key = store.cacheKeyManager.getOrCreateDocumentIdentifier(request);
  assert('Expected key to be defined', key);
  return key;
}
