import type { Request, Response } from 'express';

import { JSONAPI_CONTENT_TYPE } from '@workspace/shared-data/const';
import type { SavedTodo, UnsavedTodo } from '@workspace/shared-data/types';
import { asType } from '@workspace/shared-data/types';

import { todoStore } from '../db/todo-store.ts';
import { createSingleErrorDocument } from '../serializers/error.ts';
import {
  createTodoDocument,
  createTodosDocument,
  deserializeTodo,
  type TodoResource,
  validateTodoForCreation,
  validateTodoForUpdate,
} from '../serializers/todo.ts';
import { getBaseUrl } from '../utils/url.ts';

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
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json(
          createSingleErrorDocument(
            '400',
            'Bad Request',
            'Request must include a todo id',
          ),
        );
    }

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
    const { data } = req.body as { data?: TodoResource };

    if (!data) {
      return res
        .status(400)
        .json(
          createSingleErrorDocument(
            '400',
            'Bad Request',
            'Request must include a data object',
          ),
        );
    }

    // Deserialize the request data
    let todoData;
    try {
      todoData = deserializeTodo(data);
    } catch (error) {
      return res
        .status(400)
        .json(
          createSingleErrorDocument(
            '400',
            'Bad Request',
            error instanceof Error ? error.message : 'Invalid resource data',
          ),
        );
    }

    // Validate the todo data
    const validationErrors = validateTodoForCreation(todoData);
    if (validationErrors.length > 0) {
      return res
        .status(400)
        .json(
          createSingleErrorDocument(
            '400',
            'Validation Error',
            validationErrors.join(', '),
          ),
        );
    }

    // Create the todo
    const newTodo = todoStore.create(
      asType<UnsavedTodo>({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        title: todoData.title!,
        completed: todoData.completed ?? false,
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
    const { id } = req.params;
    const { data } = req.body as { data?: TodoResource };

    if (!id) {
      return res
        .status(400)
        .json(
          createSingleErrorDocument(
            '400',
            'Bad Request',
            'Request must include a todo id',
          ),
        );
    }

    if (!data) {
      return res
        .status(400)
        .json(
          createSingleErrorDocument(
            '400',
            'Bad Request',
            'Request must include a data object',
          ),
        );
    }

    // Validate the resource type and id match
    if (data.type !== 'todo') {
      return res
        .status(409)
        .json(
          createSingleErrorDocument(
            '409',
            'Conflict',
            `Resource type must be 'todo', got '${data.type}'`,
          ),
        );
    }

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

    if (data.id !== id) {
      return res
        .status(409)
        .json(
          createSingleErrorDocument(
            '409',
            'Conflict',
            `Resource id must match URL parameter. Expected '${id}', got '${data.id}'`,
          ),
        );
    }

    // Deserialize the request data
    let todoData: Partial<SavedTodo>;
    try {
      todoData = deserializeTodo(data);
    } catch (error) {
      return res
        .status(400)
        .json(
          createSingleErrorDocument(
            '400',
            'Bad Request',
            error instanceof Error ? error.message : 'Invalid resource data',
          ),
        );
    }

    // Validate the todo data
    const validationErrors = validateTodoForUpdate(todoData);
    if (validationErrors.length > 0) {
      return res
        .status(400)
        .json(
          createSingleErrorDocument(
            '400',
            'Validation Error',
            validationErrors.join(', '),
          ),
        );
    }

    // Update the todo
    // @ts-expect-error YOLO oh well
    const updatedTodo = todoStore.update(id, {
      ...(todoData.title !== undefined && { title: todoData.title }),
      ...(todoData.completed !== undefined && {
        completed: todoData.completed,
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
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json(
          createSingleErrorDocument(
            '400',
            'Bad Request',
            'Request must include a todo id',
          ),
        );
    }

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
