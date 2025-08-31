import type { Request, Response } from 'express';

import { JSONAPI_CONTENT_TYPE } from '@workspace/shared-data/const';
import type { UnsavedTodo } from '@workspace/shared-data/types';
import { asType } from '@workspace/shared-data/types';

import { todoStore } from '../db/todo-store.ts';
import { createSingleErrorDocument } from '../serializers/error.ts';
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
import { todoCreationSchema, todoUpdateSchema } from '../validations/todo.ts';

/**
 * GET /todos - List all todos
 */
export function getTodos(req: Request, res: Response) {
  try {
    const todos = todoStore.findAll();
    const baseUrl = getBaseUrl(req);
    const document = createTodosDocument(todos, baseUrl);

    res.setHeader('Content-Type', JSONAPI_CONTENT_TYPE);
    res.json(document);
  } catch (error) {
    console.error('Error getting todos:', error);
    res
      .status(500)
      .json(
        createSingleErrorDocument(
          '500',
          'Internal Server Error',
          'An unexpected error occurred while fetching todos',
        ),
      );
  }
}

/**
 * GET /todos/:id - Get a specific todo
 */
export function getTodo(req: Request, res: Response) {
  try {
    const idValidation = validateRequiredParam('todo id', req.params['id']);
    if (!idValidation.success) {
      return res.status(idValidation.status).json(idValidation.error);
    }

    const id = idValidation.data;
    const todo = todoStore.findById(id);

    if (!todo) {
      return res
        .status(404)
        .json(
          createSingleErrorDocument(
            '404',
            'Not Found',
            `Todo with id '${id}' not found`,
          ),
        );
    }

    const baseUrl = getBaseUrl(req);
    const document = createTodoDocument(todo, baseUrl);

    res.setHeader('Content-Type', JSONAPI_CONTENT_TYPE);
    return res.json(document);
  } catch (error) {
    console.error('Error getting todo:', error);
    return res
      .status(500)
      .json(
        createSingleErrorDocument(
          '500',
          'Internal Server Error',
          'An unexpected error occurred while fetching the todo',
        ),
      );
  }
}

/**
 * POST /todos - Create a new todo
 */
export function createTodo(req: Request, res: Response) {
  try {
    const validationResult = validateCreateRequest(
      'todo',
      todoCreationSchema,
      req.body,
    );

    if (!validationResult.success) {
      return res.status(validationResult.status).json(validationResult.error);
    }

    // Create the todo
    const newTodo = todoStore.create(
      asType<UnsavedTodo>({
        title: validationResult.data.title,
        completed: validationResult.data.completed,
      }),
    );

    const baseUrl = getBaseUrl(req);
    const document = createTodoDocument(newTodo, baseUrl);

    res.setHeader('Content-Type', JSONAPI_CONTENT_TYPE);
    res.setHeader('Location', `${baseUrl}/todos/${newTodo.id}`);
    return res.status(201).json(document);
  } catch (error) {
    console.error('Error creating todo:', error);
    return res
      .status(500)
      .json(
        createSingleErrorDocument(
          '500',
          'Internal Server Error',
          'An unexpected error occurred while creating the todo',
        ),
      );
  }
}

/**
 * PATCH /todos/:id - Update an existing todo
 */
export function updateTodo(req: Request, res: Response) {
  try {
    // Validate the id parameter
    const idValidation = validateRequiredParam('todo id', req.params['id']);
    if (!idValidation.success) {
      return res.status(idValidation.status).json(idValidation.error);
    }

    const id = idValidation.data;

    // Check if the todo exists
    if (!todoStore.exists(id)) {
      return res
        .status(404)
        .json(
          createSingleErrorDocument(
            '404',
            'Not Found',
            `Todo with id '${id}' not found`,
          ),
        );
    }

    // Validate the request using Zod
    const validationResult = validateUpdateRequest(
      'todo',
      id,
      todoUpdateSchema,
      req.body,
    );

    if (!validationResult.success) {
      return res.status(validationResult.status).json(validationResult.error);
    }

    // Update the todo
    // @ts-expect-error YOLO oh well
    const updatedTodo = todoStore.update(id, {
      ...(validationResult.data.title !== undefined && {
        title: validationResult.data.title,
      }),
      ...(validationResult.data.completed !== undefined && {
        completed: validationResult.data.completed,
      }),
    });

    if (!updatedTodo) {
      return res
        .status(404)
        .json(
          createSingleErrorDocument(
            '404',
            'Not Found',
            `Todo with id '${id}' not found`,
          ),
        );
    }

    const baseUrl = getBaseUrl(req);
    const document = createTodoDocument(updatedTodo, baseUrl);

    res.setHeader('Content-Type', JSONAPI_CONTENT_TYPE);
    return res.json(document);
  } catch (error) {
    console.error('Error updating todo:', error);
    return res
      .status(500)
      .json(
        createSingleErrorDocument(
          '500',
          'Internal Server Error',
          'An unexpected error occurred while updating the todo',
        ),
      );
  }
}

/**
 * DELETE /todos/:id - Delete a todo
 */
export function deleteTodo(req: Request, res: Response) {
  try {
    // Validate the id parameter
    const idValidation = validateRequiredParam('todo id', req.params['id']);
    if (!idValidation.success) {
      return res.status(idValidation.status).json(idValidation.error);
    }

    const id = idValidation.data;
    const deleted = todoStore.delete(id);

    if (!deleted) {
      return res
        .status(404)
        .json(
          createSingleErrorDocument(
            '404',
            'Not Found',
            `Todo with id '${id}' not found`,
          ),
        );
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting todo:', error);
    return res
      .status(500)
      .json(
        createSingleErrorDocument(
          '500',
          'Internal Server Error',
          'An unexpected error occurred while deleting the todo',
        ),
      );
  }
}
