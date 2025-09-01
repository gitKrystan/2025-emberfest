import { mergeOptions } from '@workspace/shared-utils';

import type { CreateRequestOptions } from '@warp-drive/core/types/request';
import type { SingleResourceDataDocument } from '@warp-drive/core/types/spec/document';
import {
  createRecord,
  deleteRecord,
  findRecord,
  query,
  updateRecord,
} from '@warp-drive/utilities/json-api';

import type { SavedTodo, UnsavedTodo } from '../types/index.ts';

// GET
export function getAllTodos() {
  const requestInfo = query<SavedTodo>('todo', {}, { resourcePath: 'todo' });
  requestInfo.cacheOptions = mergeOptions(requestInfo.cacheOptions, {
    types: ['todo'],
  });
  return requestInfo;
}

export function getCompletedTodos() {
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

export function getActiveTodos() {
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
export function createTodo(attributes: UnsavedTodo) {
  const requestInfo = createRecord(attributes, {
    resourcePath: 'todo',
  });
  requestInfo.body = JSON.stringify({
    data: {
      type: 'todo',
      attributes: {
        title: attributes.title,
        completed: attributes.completed,
      },
    },
  });
  // FIXME: Do I need this cast?
  return requestInfo as unknown as CreateRequestOptions<
    SingleResourceDataDocument<SavedTodo>
  >;
}

// FIXME: Implement bulk delete

// PATCH
export function updateTodo(todo: Partial<SavedTodo> & { id: string }) {
  const attributes: {
    title?: string;
    completed?: boolean;
  } = {};
  if (todo.title !== undefined) {
    attributes.title = todo.title;
  }
  if (todo.completed !== undefined) {
    attributes.completed = todo.completed;
  }

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
