import type { SavedTodo, UnsavedTodo } from '@workspace/shared-data/types';

import type { TodoDocument, TodoResource } from '../types.ts';
import { JSONAPI_VERSION, TODO_TYPE } from './base.ts';

/**
 * Serialize a single Todo to JSONAPI format
 */
export function serializeTodo(todo: SavedTodo, baseUrl = ''): TodoResource {
  const { id, ...attributes } = todo;

  return {
    type: TODO_TYPE,
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
  if (resource.type !== TODO_TYPE) {
    throw new Error(
      `Expected resource type '${TODO_TYPE}', got '${resource.type}'`,
    );
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
 * Validate Todo data for creation
 */
export function validateTodoForCreation(data: Partial<UnsavedTodo>): string[] {
  const errors: string[] = [];

  if (
    !data.title ||
    typeof data.title !== 'string' ||
    data.title.trim() === ''
  ) {
    errors.push('title is required and must be a non-empty string');
  }

  if (data.completed !== undefined && typeof data.completed !== 'boolean') {
    errors.push('completed must be a boolean');
  }

  return errors;
}

/**
 * Validate Todo data for updates
 */
export function validateTodoForUpdate(data: Partial<SavedTodo>): string[] {
  const errors: string[] = [];

  if ('title' in data && !data.title) {
    errors.push('title cannot be empty if provided');
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if ('completed' in data && data.completed === undefined) {
    errors.push('completed cannot be undefined if provided');
  }

  if (
    data.title !== undefined &&
    (typeof data.title !== 'string' || data.title.trim() === '')
  ) {
    errors.push('title must be a non-empty string');
  }

  if (data.completed !== undefined && typeof data.completed !== 'boolean') {
    errors.push('completed must be a boolean');
  }

  return errors;
}
