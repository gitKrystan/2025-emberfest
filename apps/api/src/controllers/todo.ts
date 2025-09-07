import type { Request, Response } from 'express';

import { JSONAPI_CONTENT_TYPE } from '@workspace/shared-data/const';
import type { TodoAttributes } from '@workspace/shared-data/types';
import type { ExactPartial } from '@workspace/shared-utils/types';

import type {
  CollectionResourceDataDocument,
  ResourceErrorDocument,
} from '@warp-drive/core/types/spec/document';
import type { SingleResourceDocument } from '@warp-drive/core/types/spec/json-api-raw';

import { flagStore } from '../db/flag-store.ts';
import { todoStore } from '../db/todo-store.ts';
import { InternalServerError } from '../errors.ts';
import {
  serializeCollectionResourceDocument,
  serializePaginatedCollectionResourceDocument,
  serializeSingleResourceDocument,
} from '../serializers/base.ts';
import { handleError } from '../serializers/error.ts';
import { getResourceUrl } from '../utils/url.ts';
import {
  validateCreateRequest,
  validateRequiredParam,
  validateUpdateRequest,
} from '../validations/request-helpers.ts';
import {
  todoBulkDeleteSchema,
  todoBulkPatchSchema,
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
export function getTodos(
  req: Request,
  res: Response,
):
  | Response<CollectionResourceDataDocument<'todo'>>
  | Response<ResourceErrorDocument> {
  try {
    checkShouldError();

    const queryParams = validateWithZod(todoQuerySchema, req.query);

    // Filter out undefined values to create a clean query object
    const cleanQuery: Record<string, unknown> = {};
    if (queryParams.filter?.completed !== undefined) {
      cleanQuery['completed'] = queryParams.filter.completed;
    }

    // Use pagination if page parameters are provided
    const hasPageParams =
      queryParams.page?.limit !== undefined ||
      queryParams.page?.offset !== undefined;

    if (hasPageParams) {
      const limit = queryParams.page?.limit ?? 25;
      const offset = queryParams.page?.offset ?? 0;

      const hasQueryParams = Object.keys(cleanQuery).length > 0;
      const paginatedResult = hasQueryParams
        ? todoStore.queryPaginated(cleanQuery, { limit, offset })
        : todoStore.findAllPaginated({ limit, offset });

      const document = serializePaginatedCollectionResourceDocument(
        req,
        'todo',
        paginatedResult,
      );

      res.setHeader('Content-Type', JSONAPI_CONTENT_TYPE);
      return res.json(document);
    } else {
      // Legacy behavior when no pagination is requested
      const hasQueryParams = Object.keys(cleanQuery).length > 0;
      const todos = hasQueryParams
        ? todoStore.query(cleanQuery)
        : todoStore.findAll();

      const document = serializeCollectionResourceDocument(req, 'todo', todos);

      res.setHeader('Content-Type', JSONAPI_CONTENT_TYPE);
      return res.json(document);
    }
  } catch (error) {
    return handleError(res, error);
  }
}

/**
 * GET /todo/:id - Get a specific todo
 */
export function getTodo(
  req: Request,
  res: Response,
): Response<SingleResourceDocument<'todo'>> | Response<ResourceErrorDocument> {
  try {
    checkShouldError();
    const id = validateRequiredParam('todo id', req.params['id']);
    const todo = todoStore.findById(id);

    const document = serializeSingleResourceDocument(req, 'todo', todo);

    res.setHeader('Content-Type', JSONAPI_CONTENT_TYPE);
    return res.json(document);
  } catch (error) {
    return handleError(res, error);
  }
}

/**
 * POST /todos - Create a new todo
 */
export function createTodo(
  req: Request,
  res: Response,
): Response<SingleResourceDocument<'todo'>> | Response<ResourceErrorDocument> {
  try {
    checkShouldError();
    const attributes: TodoAttributes = validateCreateRequest(
      'todo',
      todoCreationSchema,
      req.body,
    );

    // Create the todo
    const newTodo = todoStore.create({
      title: attributes.title,
      completed: attributes.completed,
    });

    const document = serializeSingleResourceDocument(req, 'todo', newTodo);

    res.setHeader('Content-Type', JSONAPI_CONTENT_TYPE);
    res.setHeader('Location', getResourceUrl(req, 'todo', newTodo));
    return res.status(201).json(document);
  } catch (error) {
    return handleError(res, error);
  }
}

/**
 * PATCH /todos/:id - Update an existing todo
 */
export function patchTodo(
  req: Request,
  res: Response,
): Response<SingleResourceDocument<'todo'>> | Response<ResourceErrorDocument> {
  try {
    checkShouldError();
    const id = validateRequiredParam('todo id', req.params['id']);

    const patchAttributes: Partial<TodoAttributes> = extractTodoPatchAttributes(
      validateUpdateRequest('todo', id, todoUpdateSchema, req.body),
    );

    const updatedTodo = todoStore.update(id, patchAttributes);

    const document = serializeSingleResourceDocument(
      req,
      'todo',
      updatedTodo,
      patchAttributes,
    );

    res.setHeader('Content-Type', JSONAPI_CONTENT_TYPE);
    return res.json(document);
  } catch (error) {
    return handleError(res, error);
  }
}

/**
 * PATCH /todo/ops.bulk.patch - Bulk patch todos by identifier
 */
export function bulkPatchTodos(
  req: Request,
  res: Response,
): Response<void> | Response<ResourceErrorDocument> {
  try {
    checkShouldError();

    const requestData = validateWithZod(todoBulkPatchSchema, req.body);

    const todoIds = requestData.data.map((resource) => resource.id);

    // HACK to ensure we 404 if any todo doesn't exist before we start patching
    for (const id of todoIds) {
      todoStore.findById(id);
    }

    const patchAttributes: Partial<TodoAttributes> = extractTodoPatchAttributes(
      requestData.attributes,
    );

    for (const id of todoIds) {
      todoStore.update(id, patchAttributes);
    }

    return res.status(204).send();
  } catch (error) {
    return handleError(res, error);
  }
}

/**
 * DELETE /todos/:id - Delete a todo
 */
export function deleteTodo(
  req: Request,
  res: Response,
): Response<void> | Response<ResourceErrorDocument> {
  try {
    checkShouldError();
    const id = validateRequiredParam('todo id', req.params['id']);
    todoStore.delete(id);
    return res.status(204).send();
  } catch (error) {
    return handleError(res, error);
  }
}

/**
 * DELETE /todo/ops.bulk.delete - Bulk delete todos by identifier
 */
export function bulkDeleteTodos(
  req: Request,
  res: Response,
): Response<void> | Response<ResourceErrorDocument> {
  try {
    checkShouldError();

    const requestData = validateWithZod(todoBulkDeleteSchema, req.body);

    const todoIds = requestData.data.map((resource) => resource.id);

    // HACK to ensure we 404 if any todo doesn't exist before we start deleting
    for (const id of todoIds) {
      todoStore.findById(id);
    }

    for (const id of todoIds) {
      todoStore.delete(id);
    }

    return res.status(204).send();
  } catch (error) {
    return handleError(res, error);
  }
}

function extractTodoPatchAttributes(
  partialAttributes: ExactPartial<TodoAttributes>,
): Partial<TodoAttributes> {
  return {
    ...(partialAttributes.title !== undefined && {
      title: partialAttributes.title,
    }),
    ...(partialAttributes.completed !== undefined && {
      completed: partialAttributes.completed,
    }),
  };
}
