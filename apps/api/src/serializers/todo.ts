import type { SavedTodo, UnsavedTodo } from '@workspace/shared-data/types';

import type { JsonApiDocument, JsonApiResource } from '../types.ts';
import { todoCreationSchema, todoUpdateSchema } from '../validations/todo.ts';
import { safeValidate } from '../validations/utils.ts';
import { JSONAPI_VERSION } from './base.ts';

// Todo-specific JSONAPI types
export type TodoResource = JsonApiResource<SavedTodo>;
export type TodoDocument = JsonApiDocument<SavedTodo>;

/**
 * Serialize a single Todo to JSONAPI format
 */
export function serializeTodo(todo: SavedTodo, baseUrl = ''): TodoResource {
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
export function serializeTodos(
  todos: SavedTodo[],
  baseUrl = '',
): TodoResource[] {
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

/**
 * Deserialize a JSONAPI Todo resource to a Todo object
 */
export function deserializeTodo(resource: TodoResource): Partial<SavedTodo> {
  if (resource.type !== 'todo') {
    throw new Error(`Expected resource type 'todo', got '${resource.type}'`);
  }

  const todo: Partial<SavedTodo> = {};

  if (resource.id) {
    todo.id = resource.id;
  }

  if (resource.attributes) {
    if (typeof resource.attributes.title === 'string') {
      todo.title = resource.attributes.title;
    }
    if (typeof resource.attributes.completed === 'boolean') {
      todo.completed = resource.attributes.completed;
    }
  }

  return todo;
}

/**
 * Validate Todo data for creation using Zod
 */
export function validateTodoForCreation(data: Partial<UnsavedTodo>): string[] {
  return safeValidate(todoCreationSchema, data);
}

/**
 * Validate Todo data for updates using Zod
 */
export function validateTodoForUpdate(data: Partial<SavedTodo>): string[] {
  return safeValidate(todoUpdateSchema, data);
}
