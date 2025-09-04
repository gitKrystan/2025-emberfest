import type { Request, Response } from 'express';

import { JSONAPI_CONTENT_TYPE } from '@workspace/shared-data/const';
import type {
  ApiFlag,
  ShouldErrorFlagAttributes,
  TodoCountFlagAttributes,
} from '@workspace/shared-data/types';

import type {
  CollectionResourceDataDocument,
  ResourceErrorDocument,
  SingleResourceDataDocument,
} from '@warp-drive/core/types/spec/document';

import { flagStore } from '../db/flag-store.ts';
import { todoStore } from '../db/todo-store.ts';
import { BadRequestError } from '../errors.ts';
import {
  serializeCollectionResourceDocument,
  serializeSingleResourceDocument,
} from '../serializers/base.ts';
import { handleError } from '../serializers/error.ts';
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
 * GET /flag - List all flags
 */
export function getFlags(
  req: Request,
  res: Response,
):
  | Response<CollectionResourceDataDocument<'flag'>>
  | Response<ResourceErrorDocument> {
  try {
    const flags = flagStore.findAll();
    const baseUrl = getBaseUrl(req);
    const document = serializeCollectionResourceDocument(
      'flag',
      flags,
      baseUrl,
    );

    res.setHeader('Content-Type', JSONAPI_CONTENT_TYPE);
    return res.json(document);
  } catch (error) {
    return handleError(res, error);
  }
}

/**
 * PUT /flag/:id - Update an existing flag
 */
export function updateFlag(
  req: Request,
  res: Response,
):
  | Response<SingleResourceDataDocument<'flag'>>
  | Response<ResourceErrorDocument> {
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
    const document = serializeSingleResourceDocument(
      'flag',
      updatedFlag,
      baseUrl,
    );

    res.setHeader('Content-Type', JSONAPI_CONTENT_TYPE);
    return res.json(document);
  } catch (error) {
    return handleError(res, error);
  }
}

function handleShouldErrorFlag(req: Request, id: 'shouldError'): ApiFlag {
  const attributes: ShouldErrorFlagAttributes = validateUpdateRequest(
    'flag',
    id,
    booleanFlagUpdateSchema,
    req.body,
  );

  return flagStore.update(id, {
    value: attributes.value,
  });
}

function handleInitialTodoCountFlag(
  req: Request,
  id: 'initialTodoCount',
): ApiFlag {
  const attributes: TodoCountFlagAttributes = validateUpdateRequest(
    'flag',
    id,
    positiveNumberFlagUpdateSchema,
    req.body,
  );

  // Update the todo store with the new count and re-seed
  const newCount = attributes.value;
  todoStore.reseed(newCount);

  return flagStore.update(id, {
    value: attributes.value,
  });
}
