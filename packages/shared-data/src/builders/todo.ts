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
import { deleteRecord } from '@warp-drive/utilities/json-api';

import { isExisting } from '../index.ts';
import type { SavedTodo, TodoAttributes } from '../types/index.ts';

export type ReactiveSavedTodoDocument = ReactiveDataDocument<SavedTodo>;
export type ReactiveSavedTodosDocument = ReactiveDataDocument<SavedTodo[]>;

/**
 * GET /todo
 */
export function getAllTodos(): RequestInfo<ReactiveSavedTodosDocument> {
  return withReactiveResponse<SavedTodo[]>({
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
export function getCompletedTodos(): RequestInfo<ReactiveSavedTodosDocument> {
  const url = buildBaseURL({ resourcePath: 'todo' });
  const queryString = buildQueryParams({ completed: true });

  return withReactiveResponse<SavedTodo[]>({
    method: 'GET',
    url: `${url}?${queryString}`,

    op: 'query',
    cacheOptions: { types: ['todo'] },
  });
}
/**
 * GET /todo?completed=false
 */
export function getActiveTodos(): RequestInfo<ReactiveSavedTodosDocument> {
  const url = buildBaseURL({ resourcePath: 'todo' });
  const queryString = buildQueryParams({ completed: false });

  return withReactiveResponse<SavedTodo[]>({
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
): RequestInfo<ReactiveSavedTodoDocument> {
  return withReactiveResponse<SavedTodo>({
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

// FIXME: Implement bulk delete

/**
 * PATCH /todo/:id
 */
export function patchTodo(
  todo: SavedTodo,
  attributes: Partial<TodoAttributes>,
): RequestInfo<ReactiveSavedTodoDocument> {
  const key = recordIdentifierFor(todo);
  assert(
    `Cannot update a todo that is not already a SavedTodo.`,
    isExisting(key),
  );

  const url = buildBaseURL({
    identifier: key,
    op: 'updateRecord',
    resourcePath: 'todo',
  });

  return withReactiveResponse<SavedTodo>({
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
 * @param todo - The todo that was marked completed
 */
export function patchCacheTodoCompleted(store: Store, todo: SavedTodo) {
  const resourceKey = keyForResource(todo);
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
 * @param todo - The todo that was marked completed
 */
export function patchCacheTodoActivated(store: Store, todo: SavedTodo) {
  const resourceKey = keyForResource(todo);
  const completedRequestKey = keyForRequest(store, getCompletedTodos());
  const activeRequestKey = keyForRequest(store, getActiveTodos());

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

// DELETE
export function deleteTodo(todo: SavedTodo) {
  return deleteRecord(todo, { resourcePath: 'todo' });
}

// FIXME: Is this actually necessary?
/**
 * Removes a deleted todo from both the "active" list and "completed" lists.
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
 * @param todo - The todo that was marked completed
 */
export function patchCacheTodoDeleted(store: Store, todo: SavedTodo) {
  const resourceKey = keyForResource(todo);
  const allRequestKey = keyForRequest(store, getAllTodos());
  const completedRequestKey = keyForRequest(store, getCompletedTodos());
  const activeRequestKey = keyForRequest(store, getActiveTodos());

  // Remove from "all"
  store.cache.patch({
    record: allRequestKey,
    op: 'remove',
    value: resourceKey,
    field: 'data',
  });
  // Remove from "active"
  store.cache.patch({
    record: activeRequestKey,
    op: 'remove',
    value: resourceKey,
    field: 'data',
  });
  // Remove from "completed"
  store.cache.patch({
    record: completedRequestKey,
    op: 'remove',
    value: resourceKey,
    field: 'data',
  });
}

function keyForResource(resource: SavedTodo): PersistedResourceKey<'todo'> {
  const key = recordIdentifierFor(resource);
  assert('Expected key to have type and id', isExisting(key));
  return key;
}

function keyForRequest(store: Store, request: RequestInfo): RequestKey {
  const key = store.cacheKeyManager.getOrCreateDocumentIdentifier(request);
  assert('Expected key to be defined', key);
  return key;
}
