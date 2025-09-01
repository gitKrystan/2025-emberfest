import type {
  ExistingResourceObject,
  JsonApiDocument,
} from '@warp-drive/core/types/spec/json-api-raw';

import type { SavedTodo } from '@workspace/shared-data/types';

import { JSONAPI_VERSION } from './base.ts';

// Todo-specific JSONAPI types
type TodoResource = ExistingResourceObject<'todo'>;
export type TodoDocument = JsonApiDocument<'todo'>;

/**
 * Serialize a single Todo to JSONAPI format
 */
function serializeTodo(todo: SavedTodo, baseUrl = ''): TodoResource {
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
function serializeTodos(todos: SavedTodo[], baseUrl = ''): TodoResource[] {
  return todos.map((todo) => serializeTodo(todo, baseUrl));
}

/**
 * Create a JSONAPI document for a single Todo
 */
export function createTodoDocument(
  todo: SavedTodo,
  baseUrl = '',
): TodoDocument {
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
): TodoDocument {
  return {
    data: serializeTodos(todos, baseUrl),
    jsonapi: JSONAPI_VERSION,
    links: {
      self: `${baseUrl}/todo`,
    },
  };
}
