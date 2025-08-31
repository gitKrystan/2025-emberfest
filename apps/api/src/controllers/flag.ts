import type { Request, Response } from 'express';

import { JSONAPI_CONTENT_TYPE } from '@workspace/shared-data/const';

import { flagStore } from '../db/flag-store.ts';
import { todoStore } from '../db/todo-store.ts';
import { BadRequestError } from '../errors.ts';
import { handleError } from '../serializers/error.ts';
import {
  createFlagDocument,
  createFlagsDocument,
} from '../serializers/flag.ts';
import { getBaseUrl } from '../utils/url.ts';
import {
  booleanFlagUpdateSchema,
  positiveNumberFlagUpdateSchema,
} from '../validations/flag.ts';
import {
  validateRequiredParam,
  validateUpdateRequest,
} from '../validations/request-helpers.ts';

/**
 * GET /flags - List all flags
 */
export function getFlags(req: Request, res: Response) {
  try {
    const flags = flagStore.findAll();
    const baseUrl = getBaseUrl(req);
    const document = createFlagsDocument(flags, baseUrl);

    res.setHeader('Content-Type', JSONAPI_CONTENT_TYPE);
    res.json(document);
  } catch (error) {
    return handleError(res, error);
  }
}

/**
 * PUT /flag/:id - Update an existing flag
 */
export function updateFlag(req: Request, res: Response) {
  try {
    const id = validateRequiredParam('flag id', req.params['id']);

    const updatedFlag =
      id === 'shouldError'
        ? handleShouldErrorFlag(req, id)
        : id === 'initialTodoCount'
          ? handleInitialTodoCountFlag(req, id)
          : null;

    if (!updatedFlag) {
      throw new BadRequestError({ detail: [`Unknown flag id ${id}`] });
    }

    const baseUrl = getBaseUrl(req);
    const document = createFlagDocument(updatedFlag, baseUrl);

    res.setHeader('Content-Type', JSONAPI_CONTENT_TYPE);
    return res.json(document);
  } catch (error) {
    return handleError(res, error);
  }
}

function handleShouldErrorFlag(req: Request, id: 'shouldError') {
  const validationResult = validateUpdateRequest(
    'flag',
    id,
    booleanFlagUpdateSchema,
    req.body,
  );

  // @ts-expect-error YOLO oh well
  return flagStore.update(id, {
    value: validationResult.value,
  });
}

function handleInitialTodoCountFlag(req: Request, id: 'initialTodoCount') {
  const validationResult = validateUpdateRequest(
    'flag',
    id,
    positiveNumberFlagUpdateSchema,
    req.body,
  );

  // Update the todo store with the new count and re-seed
  const newCount = validationResult.value;
  todoStore.reseed(newCount);

  // @ts-expect-error YOLO oh well
  return flagStore.update(id, {
    value: validationResult.value,
  });
}
