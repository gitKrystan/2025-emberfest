import type { Request, Response } from 'express';

import { JSONAPI_CONTENT_TYPE } from '@workspace/shared-data/const';
import type { UnsavedTodo } from '@workspace/shared-data/types';
import { asType } from '@workspace/shared-data/types';

import { flagStore } from '../db/flag-store.ts';
import { todoStore } from '../db/todo-store.ts';
import { BadRequestError, InternalServerError } from '../errors.ts';
import { handleError } from '../serializers/error.ts';
import {
  createTodoDocument,
  createTodosDocument,
} from '../serializers/todo.ts';
import { getBaseUrl } from '../utils/url.ts';
import {
  validateCreateRequest,
  validateRequiredParam,
  validateUpdateRequest,
} from '../validations/request-helpers.ts';
import {
  todoCreationSchema,
  todoQuerySchema,
  todoUpdateSchema,
} from '../validations/todo.ts';
import { validateWithZod } from '../validations/utils.ts';

/**
 * Check if the shouldError flag is set to true and throw an error if so
 */
function checkShouldError() {
  const shouldErrorFlag = flagStore.safeFindById('shouldError');
  if (shouldErrorFlag?.value === true) {
    throw new InternalServerError({
      detail: ['Todo operations are currently disabled'],
    });
  }
}

/**
 * GET /todo - List all todos
 */
export function getTodos(req: Request, res: Response) {
  try {
    checkShouldError();

    const queryParams = validateWithZod(todoQuerySchema, req.query);

    // Filter out undefined values to create a clean query object
    const cleanQuery: Record<string, unknown> = {};
    if (queryParams.completed !== undefined) {
      cleanQuery['completed'] = queryParams.completed;
    }

    const hasQueryParams = Object.keys(cleanQuery).length > 0;
    const todos = hasQueryParams
      ? todoStore.query(cleanQuery)
      : todoStore.findAll();

    const baseUrl = getBaseUrl(req);
    const document = createTodosDocument(todos, baseUrl);

    res.setHeader('Content-Type', JSONAPI_CONTENT_TYPE);
    res.json(document);
  } catch (error) {
    return handleError(res, error);
  }
}

/**
 * GET /todo/:id - Get a specific todo
 */
export function getTodo(req: Request, res: Response) {
  try {
    checkShouldError();
    const id = validateRequiredParam('todo id', req.params['id']);
    const todo = todoStore.findById(id);

    const baseUrl = getBaseUrl(req);
    const document = createTodoDocument(todo, baseUrl);

    res.setHeader('Content-Type', JSONAPI_CONTENT_TYPE);
    return res.json(document);
  } catch (error) {
    return handleError(res, error);
  }
}

/**
 * POST /todos - Create a new todo
 */
export function createTodo(req: Request, res: Response) {
  try {
    checkShouldError();
    const validationResult = validateCreateRequest(
      'todo',
      todoCreationSchema,
      req.body,
    );

    // Create the todo
    const newTodo = todoStore.create(
      asType<UnsavedTodo>({
        title: validationResult.title,
        completed: validationResult.completed,
      }),
    );

    const baseUrl = getBaseUrl(req);
    const document = createTodoDocument(newTodo, baseUrl);

    res.setHeader('Content-Type', JSONAPI_CONTENT_TYPE);
    res.setHeader('Location', `${baseUrl}/todos/${newTodo.id}`);
    return res.status(201).json(document);
  } catch (error) {
    return handleError(res, error);
  }
}

/**
 * PATCH /todos/:id - Update an existing todo
 */
export function updateTodo(req: Request, res: Response) {
  try {
    checkShouldError();
    const id = validateRequiredParam('todo id', req.params['id']);

    // Validate the request using Zod
    const validationResult = validateUpdateRequest(
      'todo',
      id,
      todoUpdateSchema,
      req.body,
    );

    // Update the todo
    // @ts-expect-error YOLO oh well
    const updatedTodo = todoStore.update(id, {
      ...(validationResult.title !== undefined && {
        title: validationResult.title,
      }),
      ...(validationResult.completed !== undefined && {
        completed: validationResult.completed,
      }),
    });

    const baseUrl = getBaseUrl(req);
    const document = createTodoDocument(updatedTodo, baseUrl);

    res.setHeader('Content-Type', JSONAPI_CONTENT_TYPE);
    return res.json(document);
  } catch (error) {
    return handleError(res, error);
  }
}

/**
 * DELETE /todos/:id - Delete a todo
 */
export function deleteTodo(req: Request, res: Response) {
  try {
    checkShouldError();
    const id = validateRequiredParam('todo id', req.params['id']);

    todoStore.delete(id);

    return res.status(204).send();
  } catch (error) {
    return handleError(res, error);
  }
}
