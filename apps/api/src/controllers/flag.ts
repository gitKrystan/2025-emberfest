import type { Request, Response } from 'express';

import { JSONAPI_CONTENT_TYPE } from '@workspace/shared-data/const';

import { flagStore } from '../db/flag-store.ts';
import { handleError } from '../serializers/error.ts';
import {
  createFlagDocument,
  createFlagsDocument,
} from '../serializers/flag.ts';
import { getBaseUrl } from '../utils/url.ts';
import { flagUpdateSchema } from '../validations/flag.ts';
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

    // Validate the request using Zod
    const validationResult = validateUpdateRequest(
      'flag',
      id,
      flagUpdateSchema,
      req.body,
    );

    // Update the flag
    const updatedFlag = flagStore.update(id, {
      // @ts-expect-error YOLO oh well
      value: validationResult.value,
    });

    const baseUrl = getBaseUrl(req);
    const document = createFlagDocument(updatedFlag, baseUrl);

    res.setHeader('Content-Type', JSONAPI_CONTENT_TYPE);
    return res.json(document);
  } catch (error) {
    return handleError(res, error);
  }
}
