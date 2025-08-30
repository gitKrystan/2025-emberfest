import type { RequestInfo } from '@warp-drive/core/types/request';
import type { Type } from '@warp-drive/core/types/symbols';
import { buildBaseURL, buildQueryParams } from '@warp-drive/utilities';

import { defaultHeaders as headers } from '../const/json-api.ts';

export interface BaseTodo {
  [Type]: 'todo';
}

export interface NewTodo extends BaseTodo {
  title?: string;
  completed?: boolean;
}

export interface UnsavedTodo extends BaseTodo {
  title: string;
  completed: boolean;
}

export interface SavedTodo extends BaseTodo {
  id: string;
  title: string;
  completed: boolean;
}

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
    url: `${buildBaseURL({ resourcePath: 'todo' })}?${buildQueryParams({ completed: true })}`,
    headers,
  };
}

export function getActiveTodos() {
  return {
    method: 'GET' as const,
    url: `${buildBaseURL({ resourcePath: 'todo' })}?${buildQueryParams({ completed: false })}`,
    headers,
  };
}

export function getTodoById(id: string) {
  return {
    method: 'GET' as const,
    url: `${buildBaseURL({ resourcePath: 'todo' })}/${id}`,
    headers,
  };
}

// POST
export function createTodo(attributes: UnsavedTodo) {
  return {
    method: 'POST' as const,
    url: buildBaseURL({ resourcePath: 'todo' }),
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
    url: `${buildBaseURL({ resourcePath: 'todo' })}/${todo.id}`,
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
    url: `${buildBaseURL({ resourcePath: 'todo' })}/${todo.id}`,
    headers,
  };
}
