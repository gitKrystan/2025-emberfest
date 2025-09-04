import type { ReactiveDataDocument } from '@warp-drive/core/reactive';
import { withReactiveResponse } from '@warp-drive/core/request';
import type { RequestInfo } from '@warp-drive/core/types/request';
import { buildBaseURL, buildQueryParams } from '@warp-drive/utilities';
import { deleteRecord, updateRecord } from '@warp-drive/utilities/json-api';

import type { SavedTodo, TodoAttributes } from '../types/index.ts';

// GET /todo
export type GetTodosResult = ReactiveDataDocument<SavedTodo[]>;

export function getAllTodos(): RequestInfo<GetTodosResult> {
  return withReactiveResponse<SavedTodo[]>({
    method: 'GET',
    url: buildBaseURL({ resourcePath: 'todo' }),

    // Query ops are invalidated by createRecord, updateRecord, deleteRecord ops
    op: 'query',
    cacheOptions: { types: ['todo'] },
  });
}

// GET /todo?completed=true
export function getCompletedTodos(): RequestInfo<GetTodosResult> {
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
export function getActiveTodos(): RequestInfo<GetTodosResult> {
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
export function createTodo(attributes: TodoAttributes) {
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

// PATCH
export function updateTodo(
  todo: SavedTodo,
  attributes: Partial<Omit<SavedTodo, 'id'>>,
) {
  const requestInfo = updateRecord(todo, { resourcePath: 'todo' });
  requestInfo.body = JSON.stringify({
    data: {
      type: 'todo',
      id: todo.id,
      attributes,
    },
  });
  return requestInfo;
}

// DELETE
export function deleteTodo(todo: SavedTodo) {
  return deleteRecord(todo, { resourcePath: 'todo' });
}
