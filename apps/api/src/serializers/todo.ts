import type {
  CollectionTodoDocument,
  ExistingTodoResource,
  SavedTodo,
  SingleTodoDocument,
} from '@workspace/shared-data/types';

import { JSONAPI_VERSION } from './base.ts';

/**
 * Serialize a single Todo to JSONAPI format
 */
function serializeTodo(todo: SavedTodo, baseUrl = ''): ExistingTodoResource {
  const { id, ...attributes } = todo;

  return {
    type: 'todo',
    id,
    attributes,
    links: {
      self: `${baseUrl}/todo/${id}`,
    },
  };
}

/**
 * Serialize multiple Todos to JSONAPI format
 */
function serializeTodos(
  todos: SavedTodo[],
  baseUrl = '',
): ExistingTodoResource[] {
  return todos.map((todo) => serializeTodo(todo, baseUrl));
}

/**
 * Create a JSONAPI document for a single Todo
 */
export function createTodoDocument(
  todo: SavedTodo,
  baseUrl = '',
): SingleTodoDocument {
  return {
    data: serializeTodo(todo, baseUrl),
    jsonapi: JSONAPI_VERSION,
    links: {
      self: `${baseUrl}/todo/${todo.id}`,
    },
  };
}

/**
 * Create a JSONAPI document for multiple Todos
 */
export function createTodosDocument(
  todos: SavedTodo[],
  baseUrl = '',
): CollectionTodoDocument {
  return {
    data: serializeTodos(todos, baseUrl),
    jsonapi: JSONAPI_VERSION,
    links: {
      self: `${baseUrl}/todo`,
    },
  };
}
