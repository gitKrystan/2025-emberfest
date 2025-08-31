import { Request, Response } from 'express';
import { flagStore, todoStore } from './store';
import { JsonApiSerializer } from './serializer';
import { FlagResource, TodoResource } from './types';
import {
  ApiFlag,
  asType,
  SavedTodo,
  UnsavedTodo,
} from '@workspace/shared-data/types';

// JSONAPI media type constant
export const JSONAPI_CONTENT_TYPE = 'application/vnd.api+json';

/**
 * Get the base URL for generating links
 */
function getBaseUrl(req: Request): string {
  return `${req.protocol}://${req.get('host')}`;
}

/**
 * Middleware to validate JSONAPI content type for POST/PATCH requests
 */
export function validateJsonApiContentType(
  req: Request,
  res: Response,
  next: Function,
) {
  if (['POST', 'PATCH'].includes(req.method)) {
    const contentType = req.get('Content-Type');
    if (contentType !== JSONAPI_CONTENT_TYPE) {
      return res
        .status(415)
        .json(
          JsonApiSerializer.createSingleErrorDocument(
            '415',
            'Unsupported Media Type',
            `Content-Type must be ${JSONAPI_CONTENT_TYPE}`,
          ),
        );
    }
  }
  next();
}

/**
 * GET /todos - List all todos
 */
export function getTodos(req: Request, res: Response) {
  try {
    const todos = todoStore.findAll();
    const baseUrl = getBaseUrl(req);
    const document = JsonApiSerializer.createTodosDocument(todos, baseUrl);

    res.setHeader('Content-Type', JSONAPI_CONTENT_TYPE);
    res.json(document);
  } catch (error) {
    console.error('Error getting todos:', error);
    res
      .status(500)
      .json(
        JsonApiSerializer.createSingleErrorDocument(
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
    const todo = todoStore.findById(id);

    if (!todo) {
      return res
        .status(404)
        .json(
          JsonApiSerializer.createSingleErrorDocument(
            '404',
            'Not Found',
            `Todo with id '${id}' not found`,
          ),
        );
    }

    const baseUrl = getBaseUrl(req);
    const document = JsonApiSerializer.createTodoDocument(todo, baseUrl);

    res.setHeader('Content-Type', JSONAPI_CONTENT_TYPE);
    res.json(document);
  } catch (error) {
    console.error('Error getting todo:', error);
    res
      .status(500)
      .json(
        JsonApiSerializer.createSingleErrorDocument(
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
    const { data } = req.body;

    if (!data) {
      return res
        .status(400)
        .json(
          JsonApiSerializer.createSingleErrorDocument(
            '400',
            'Bad Request',
            'Request must include a data object',
          ),
        );
    }

    // Deserialize the request data
    let todoData;
    try {
      todoData = JsonApiSerializer.deserializeTodo(data as TodoResource);
    } catch (error) {
      return res
        .status(400)
        .json(
          JsonApiSerializer.createSingleErrorDocument(
            '400',
            'Bad Request',
            error instanceof Error ? error.message : 'Invalid resource data',
          ),
        );
    }

    // Validate the todo data
    const validationErrors =
      JsonApiSerializer.validateTodoForCreation(todoData);
    if (validationErrors.length > 0) {
      return res
        .status(400)
        .json(
          JsonApiSerializer.createSingleErrorDocument(
            '400',
            'Validation Error',
            validationErrors.join(', '),
          ),
        );
    }

    // Create the todo
    const newTodo = todoStore.create(
      asType<UnsavedTodo>({
        title: todoData.title!,
        completed: todoData.completed ?? false,
      }),
    );

    const baseUrl = getBaseUrl(req);
    const document = JsonApiSerializer.createTodoDocument(newTodo, baseUrl);

    res.setHeader('Content-Type', JSONAPI_CONTENT_TYPE);
    res.setHeader('Location', `${baseUrl}/todos/${newTodo.id}`);
    res.status(201).json(document);
  } catch (error) {
    console.error('Error creating todo:', error);
    res
      .status(500)
      .json(
        JsonApiSerializer.createSingleErrorDocument(
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
    const { data } = req.body;

    if (!data) {
      return res
        .status(400)
        .json(
          JsonApiSerializer.createSingleErrorDocument(
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
          JsonApiSerializer.createSingleErrorDocument(
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
          JsonApiSerializer.createSingleErrorDocument(
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
          JsonApiSerializer.createSingleErrorDocument(
            '409',
            'Conflict',
            `Resource id must match URL parameter. Expected '${id}', got '${data.id}'`,
          ),
        );
    }

    // Deserialize the request data
    let todoData: Partial<SavedTodo>;
    try {
      todoData = JsonApiSerializer.deserializeTodo(data as TodoResource);
    } catch (error) {
      return res
        .status(400)
        .json(
          JsonApiSerializer.createSingleErrorDocument(
            '400',
            'Bad Request',
            error instanceof Error ? error.message : 'Invalid resource data',
          ),
        );
    }

    // Validate the todo data
    const validationErrors = JsonApiSerializer.validateTodoForUpdate(todoData);
    if (validationErrors.length > 0) {
      return res
        .status(400)
        .json(
          JsonApiSerializer.createSingleErrorDocument(
            '400',
            'Validation Error',
            validationErrors.join(', '),
          ),
        );
    }

    // Update the todo
    // @ts-expect-error YOLO
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
          JsonApiSerializer.createSingleErrorDocument(
            '404',
            'Not Found',
            `Todo with id '${id}' not found`,
          ),
        );
    }

    const baseUrl = getBaseUrl(req);
    const document = JsonApiSerializer.createTodoDocument(updatedTodo, baseUrl);

    res.setHeader('Content-Type', JSONAPI_CONTENT_TYPE);
    res.json(document);
  } catch (error) {
    console.error('Error updating todo:', error);
    res
      .status(500)
      .json(
        JsonApiSerializer.createSingleErrorDocument(
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

    const deleted = todoStore.delete(id);

    if (!deleted) {
      return res
        .status(404)
        .json(
          JsonApiSerializer.createSingleErrorDocument(
            '404',
            'Not Found',
            `Todo with id '${id}' not found`,
          ),
        );
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting todo:', error);
    res
      .status(500)
      .json(
        JsonApiSerializer.createSingleErrorDocument(
          '500',
          'Internal Server Error',
          'An unexpected error occurred while deleting the todo',
        ),
      );
  }
}

/**
 * GET /todos - List all flags
 */
export function getFlags(req: Request, res: Response) {
  try {
    const flags = flagStore.findAll();
    const baseUrl = getBaseUrl(req);
    const document = JsonApiSerializer.createFlagsDocument(flags, baseUrl);

    res.setHeader('Content-Type', JSONAPI_CONTENT_TYPE);
    res.json(document);
  } catch (error) {
    console.error('Error getting flags:', error);
    res
      .status(500)
      .json(
        JsonApiSerializer.createSingleErrorDocument(
          '500',
          'Internal Server Error',
          'An unexpected error occurred while fetching flags',
        ),
      );
  }
}

/**
 * PATCH /flag/:id - Update an existing todo
 */
export function updateFlag(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { data } = req.body;

    if (!data) {
      return res
        .status(400)
        .json(
          JsonApiSerializer.createSingleErrorDocument(
            '400',
            'Bad Request',
            'Request must include a data object',
          ),
        );
    }

    // Validate the resource type and id match
    if (data.type !== 'flag') {
      return res
        .status(409)
        .json(
          JsonApiSerializer.createSingleErrorDocument(
            '409',
            'Conflict',
            `Resource type must be 'flag', got '${data.type}'`,
          ),
        );
    }

    if (!flagStore.exists(id)) {
      return res
        .status(404)
        .json(
          JsonApiSerializer.createSingleErrorDocument(
            '404',
            'Not Found',
            `Flag with id '${id}' not found`,
          ),
        );
    }

    if (data.id !== id) {
      return res
        .status(409)
        .json(
          JsonApiSerializer.createSingleErrorDocument(
            '409',
            'Conflict',
            `Resource id must match URL parameter. Expected '${id}', got '${data.id}'`,
          ),
        );
    }

    // Deserialize the request data
    let flagData: Partial<ApiFlag>;
    try {
      flagData = JsonApiSerializer.deserializeFlag(data as FlagResource);
    } catch (error) {
      return res
        .status(400)
        .json(
          JsonApiSerializer.createSingleErrorDocument(
            '400',
            'Bad Request',
            error instanceof Error ? error.message : 'Invalid resource data',
          ),
        );
    }

    // Validate the todo data
    const validationErrors = JsonApiSerializer.validateFlagForUpdate(flagData);
    if (validationErrors.length > 0) {
      return res
        .status(400)
        .json(
          JsonApiSerializer.createSingleErrorDocument(
            '400',
            'Validation Error',
            validationErrors.join(', '),
          ),
        );
    }

    // Update the todo
    const updatedFlag = flagStore.update(id, {
      // @ts-expect-error YOLO
      value: flagData.value,
    });

    if (!updatedFlag) {
      return res
        .status(404)
        .json(
          JsonApiSerializer.createSingleErrorDocument(
            '404',
            'Not Found',
            `Flag with id '${id}' not found`,
          ),
        );
    }

    const baseUrl = getBaseUrl(req);
    const document = JsonApiSerializer.createFlagDocument(updatedFlag, baseUrl);

    res.setHeader('Content-Type', JSONAPI_CONTENT_TYPE);
    res.json(document);
  } catch (error) {
    console.error('Error updating flag:', error);
    res
      .status(500)
      .json(
        JsonApiSerializer.createSingleErrorDocument(
          '500',
          'Internal Server Error',
          'An unexpected error occurred while updating the flag',
        ),
      );
  }
}
