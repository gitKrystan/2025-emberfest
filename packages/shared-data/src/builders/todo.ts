import { buildBaseURL } from '@warp-drive/utilities';
import { JSONAPI_CONTENT_TYPE } from '../const/json-api.ts';
import type { RequestInfo } from '@warp-drive/core/types/request';

export interface NewTodo {
  title?: string;
  completed?: boolean;
}

export interface UnsavedTodo {
  title: string;
  completed: boolean;
}

export interface SavedTodo {
  id: string;
  title: string;
  completed: boolean;
}

const headers = new Headers({
  Accept: JSONAPI_CONTENT_TYPE,
  'Content-Type': JSONAPI_CONTENT_TYPE,
});

// GET
export function getAllTodos(): RequestInfo<SavedTodo[]> {
  return {
    method: 'GET' as const,
    url: buildBaseURL({ resourcePath: 'todo' }),
    headers,
  };
}

export function getCompletedTodos() {
  return {
    method: 'GET' as const,
    url: '/todo?completed=true',
    headers,
  };
}

export function getActiveTodos() {
  return {
    method: 'GET' as const,
    url: '/todo?completed=false',
    headers,
  };
}

export function getTodoById(id: string) {
  return {
    method: 'GET' as const,
    url: `/todo/${id}`,
    headers,
  };
}

// POST
export function createTodo(attributes: UnsavedTodo) {
  return {
    method: 'POST' as const,
    url: '/todo',
    headers,
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
}

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

  return {
    method: 'PATCH' as const,
    url: `/todo/${todo.id}`,
    body: JSON.stringify({
      data: {
        type: 'todo',
        id: todo.id,
        attributes,
      },
    }),
    headers,
  };
}

// DELETE
export function deleteTodo(todo: SavedTodo) {
  return {
    method: 'DELETE' as const,
    url: `/todo/${todo.id}`,
    headers,
  };
}
