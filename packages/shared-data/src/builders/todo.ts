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
  return query<SavedTodo>('todo', {}, { resourcePath: 'todo' });
}

export function getCompletedTodos() {
  return query<SavedTodo>(
    'todo',
    { completed: true },
    { resourcePath: 'todo' },
  );
}

export function getActiveTodos() {
  return query<SavedTodo>(
    'todo',
    { completed: false },
    { resourcePath: 'todo' },
  );
}

export function getTodoById(id: string) {
  return findRecord<SavedTodo>('todo', id, { resourcePath: 'todo' });
}

// POST
export function createTodo(attributes: UnsavedTodo) {
  const requestInfo = createRecord<UnsavedTodo>(attributes, {
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
  return requestInfo;
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
