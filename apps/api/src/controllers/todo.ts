import type { Request, Response } from 'express';

import type { ResourceCountDocument } from '@workspace/shared-data/builders';
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
  serializeCountDocument,
  serializeEmptyDocument,
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
  todoBulkPatchAllSchema,
  todoBulkPatchSchema,
  todoCreationSchema,
  todoUpdateSchema,
  validateQueryParams,
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
 * Apply latency delay if the latency flag is set to a positive value
 */
async function applyLatencyDelay(): Promise<void> {
  const latencyFlag = flagStore.safeFindById('latency');
  const latencyMs =
    typeof latencyFlag?.value === 'number' ? latencyFlag.value : 0;

  if (latencyMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, latencyMs));
  }
}

/**
 * GET /todo - List all todos
 */
export async function getTodos(
  req: Request,
  res: Response,
): Promise<
  | Response<CollectionResourceDataDocument<'todo'>>
  | Response<ResourceErrorDocument>
> {
  try {
    await applyLatencyDelay();
    checkShouldError();

    const { query, filter, hasFilter, hasPageParams } =
      validateQueryParams(req);

    // Check if pagination is disabled via flag
    const shouldPaginateFlag = flagStore.safeFindById('shouldPaginate');
    const paginationEnabled = shouldPaginateFlag?.value !== false;

    if (hasPageParams && paginationEnabled) {
      const limit = query.page?.limit ?? 25;
      const offset = query.page?.offset ?? 0;

      const paginatedResult = hasFilter
        ? todoStore.queryPaginated(filter, { limit, offset })
        : todoStore.findAllPaginated({ limit, offset });

      const document = serializePaginatedCollectionResourceDocument(
        req,
        'todo',
        paginatedResult,
      );

      res.setHeader('Content-Type', JSONAPI_CONTENT_TYPE);
      return res.json(document);
    } else {
      // "Find all" behavior when pagination is disabled or no pagination requested
      // Still respects filters
      const todos = hasFilter ? todoStore.query(filter) : todoStore.findAll();

      const document = serializeCollectionResourceDocument(req, 'todo', todos);

      res.setHeader('Content-Type', JSONAPI_CONTENT_TYPE);
      return res.json(document);
    }
  } catch (error) {
    return handleError(res, error);
  }
}

/**
 * GET /todo/ops.count - Get count of todos
 */
export async function getTodosCount(
  req: Request,
  res: Response,
): Promise<Response<ResourceCountDocument> | Response<ResourceErrorDocument>> {
  try {
    await applyLatencyDelay();
    checkShouldError();

    const { filter, hasFilter } = validateQueryParams(req);

    const count = hasFilter ? todoStore.query(filter).length : todoStore.count;

    const document = serializeCountDocument(req, count);

    res.setHeader('Content-Type', JSONAPI_CONTENT_TYPE);
    return res.json(document);
  } catch (error) {
    return handleError(res, error);
  }
}

/**
 * GET /todo/:id - Get a specific todo
 */
export async function getTodo(
  req: Request,
  res: Response,
): Promise<
  Response<SingleResourceDocument<'todo'>> | Response<ResourceErrorDocument>
> {
  try {
    await applyLatencyDelay();
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
export async function createTodo(
  req: Request,
  res: Response,
): Promise<
  Response<SingleResourceDocument<'todo'>> | Response<ResourceErrorDocument>
> {
  try {
    await applyLatencyDelay();
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
export async function patchTodo(
  req: Request,
  res: Response,
): Promise<
  Response<SingleResourceDocument<'todo'>> | Response<ResourceErrorDocument>
> {
  try {
    await applyLatencyDelay();
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
export async function bulkPatchTodos(
  req: Request,
  res: Response,
): Promise<Response<void> | Response<ResourceErrorDocument>> {
  try {
    await applyLatencyDelay();
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
 * PATCH /todo/ops.bulk.patchAll - Bulk patch all todos (or filtered todos)
 */
export async function bulkPatchAllTodos(
  req: Request,
  res: Response,
): Promise<Response<void> | Response<ResourceErrorDocument>> {
  try {
    await applyLatencyDelay();
    checkShouldError();

    const { filter, hasFilter } = validateQueryParams(req);
    const requestData = validateWithZod(todoBulkPatchAllSchema, req.body);

    const patchAttributes: Partial<TodoAttributes> = extractTodoPatchAttributes(
      requestData.attributes,
    );

    if (hasFilter) {
      // Update only filtered todos
      const todosToUpdate = todoStore.query(filter);
      for (const todo of todosToUpdate) {
        todoStore.update(todo.id, patchAttributes);
      }
    } else {
      // Update all todos if no filter is provided
      const allTodos = todoStore.findAll();
      for (const todo of allTodos) {
        todoStore.update(todo.id, patchAttributes);
      }
    }

    // Return an empty document to ensure the cache updates in the frontend
    const document = serializeEmptyDocument(req);

    res.setHeader('Content-Type', JSONAPI_CONTENT_TYPE);
    return res.json(document);
  } catch (error) {
    return handleError(res, error);
  }
}

/**
 * DELETE /todos/:id - Delete a todo
 */
export async function deleteTodo(
  req: Request,
  res: Response,
): Promise<Response<void> | Response<ResourceErrorDocument>> {
  try {
    await applyLatencyDelay();
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
export async function bulkDeleteTodos(
  req: Request,
  res: Response,
): Promise<Response<void> | Response<ResourceErrorDocument>> {
  try {
    await applyLatencyDelay();
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

/**
 * DELETE /todo/ops.bulk.deleteAll - Delete all todos (or filtered todos)
 */
export async function bulkDeleteAllTodos(
  req: Request,
  res: Response,
): Promise<Response<void> | Response<ResourceErrorDocument>> {
  try {
    await applyLatencyDelay();
    checkShouldError();

    const { filter, hasFilter } = validateQueryParams(req);

    if (hasFilter) {
      // Delete only filtered todos
      const todosToDelete = todoStore.query(filter);
      for (const todo of todosToDelete) {
        todoStore.delete(todo.id);
      }
    } else {
      // Delete all todos if no filter is provided
      todoStore.clear();
    }

    // Return an empty document to ensure the cache updates in the frontend
    const document = serializeEmptyDocument(req);

    res.setHeader('Content-Type', JSONAPI_CONTENT_TYPE);
    return res.json(document);
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
