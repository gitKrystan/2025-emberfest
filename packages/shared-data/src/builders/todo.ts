import { mergeOptions } from '@workspace/shared-utils';

import type { QueryRequestOptions } from '@warp-drive/core/types/request';
import type {
  CollectionResourceDataDocument,
  SingleResourceDataDocument,
} from '@warp-drive/core/types/spec/document';
import type { RequestSignature } from '@warp-drive/core/types/symbols';
import { buildBaseURL } from '@warp-drive/utilities';
import {
  deleteRecord,
  findRecord,
  query,
  updateRecord,
} from '@warp-drive/utilities/json-api';

import type { SavedTodo, TodoAttributes } from '../types/index.ts';

// GET
export type GetTodosResult = CollectionResourceDataDocument<SavedTodo>;

export function getAllTodos(): QueryRequestOptions<GetTodosResult> {
  const requestInfo = query<SavedTodo>('todo', {}, { resourcePath: 'todo' });
  requestInfo.cacheOptions = mergeOptions(requestInfo.cacheOptions, {
    types: ['todo'],
  });
  return requestInfo;
}

export function getCompletedTodos(): QueryRequestOptions<GetTodosResult> {
  const requestInfo = query<SavedTodo>(
    'todo',
    { completed: true },
    { resourcePath: 'todo' },
  );
  requestInfo.cacheOptions = mergeOptions(requestInfo.cacheOptions, {
    types: ['todo'],
  });
  return requestInfo;
}

export function getActiveTodos(): QueryRequestOptions<GetTodosResult> {
  const requestInfo = query<SavedTodo>(
    'todo',
    { completed: false },
    { resourcePath: 'todo' },
  );
  requestInfo.cacheOptions = mergeOptions(requestInfo.cacheOptions, {
    types: ['todo'],
  });
  return requestInfo;
}

// FIXME: Unused
export function getTodoById(id: string) {
  return findRecord<SavedTodo>('todo', id, { resourcePath: 'todo' });
}

// POST
export function createTodo(attributes: TodoAttributes) {
  const urlOptions = {
    op: 'createRecord',
    resourcePath: 'todo',
  };

  const url = buildBaseURL(urlOptions);

  const requestInfo = {
    url,
    method: 'POST' as const,
    op: 'createRecord' as const,
    body: JSON.stringify({
      data: {
        type: 'todo',
        attributes: {
          title: attributes.title,
          completed: attributes.completed,
        },
      },
    }),
  };
  return requestInfo as typeof requestInfo & {
    [RequestSignature]: SingleResourceDataDocument<SavedTodo>;
  };
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
