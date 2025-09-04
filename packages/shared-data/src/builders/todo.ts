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

// GET /todo
export function getAllTodos(): RequestInfo<ReactiveSavedTodosDocument> {
  return withReactiveResponse<SavedTodo[]>({
    method: 'GET',
    url: buildBaseURL({ resourcePath: 'todo' }),

    // Query ops are invalidated by createRecord, updateRecord, deleteRecord ops
    op: 'query',
    cacheOptions: { types: ['todo'] },
  });
}

// GET /todo?completed=true
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

// GET /todo?completed=false
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

// POST /todo
export function createTodo(
  attributes: TodoAttributes,
): RequestInfo<ReactiveSavedTodoDocument> {
  return withReactiveResponse<SavedTodo>({
    method: 'POST',
    url: buildBaseURL({ resourcePath: 'todo' }),

    // This op plus cacheOptions -> will invalidate any op: 'query' requests for 'todo'
    op: 'createRecord',
    cacheOptions: {
      types: ['todo'],
    },

    body: JSON.stringify({
      data: {
        type: 'todo',
        attributes,
      },
    }),
  });
}

// FIXME: Implement bulk delete

// PATCH /todo/:id
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

    op: 'updateRecord',
    data: {
      record: key,
    },
    records: [key],

    body: JSON.stringify({
      data: {
        type: 'todo',
        id: todo.id,
        attributes,
      },
    }),
  });
}

export function patchCacheTodoCompleted(store: Store, todo: SavedTodo) {
  const resourceKey = keyForResource(todo);
  const completedRequestKey = keyForRequest(store, getCompletedTodos());
  const activeRequestKey = keyForRequest(store, getActiveTodos());

  // We need this because while these queries are subscribed to notifications
  // for the records they return, they explicitly do not subscribe to changes
  // in the records they don't return. Thus, we need to manually patch the
  // request documents stored in the cache to ensure they update.
  // Add to completed, remove from active
  store.cache.patch({
    record: completedRequestKey,
    op: 'add',
    value: resourceKey,
    field: 'data',
    index: 0,
  });
  store.cache.patch({
    record: activeRequestKey,
    op: 'remove',
    value: resourceKey,
    field: 'data',
  });
}

export function patchCacheTodoActivated(store: Store, todo: SavedTodo) {
  const resourceKey = keyForResource(todo);
  const completedRequestKey = keyForRequest(store, getCompletedTodos());
  const activeRequestKey = keyForRequest(store, getActiveTodos());

  // We need this because while these queries are subscribed to notifications
  // for the records they return, they explicitly do not subscribe to changes
  // in the records they don't return. Thus, we need to manually patch the
  // request documents stored in the cache to ensure they update.

  // Add to active, remove from completed
  store.cache.patch({
    record: activeRequestKey,
    op: 'add',
    value: resourceKey,
    field: 'data',
    index: 0,
  });
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

export function patchCacheTodoDeleted(store: Store, todo: SavedTodo) {
  const resourceKey = keyForResource(todo);
  const completedRequestKey = keyForRequest(store, getCompletedTodos());
  const activeRequestKey = keyForRequest(store, getActiveTodos());

  // Remove from both active and completed
  store.cache.patch({
    record: activeRequestKey,
    op: 'remove',
    value: resourceKey,
    field: 'data',
  });
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
