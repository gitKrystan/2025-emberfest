import type { Request, Response } from 'express';

import { JSONAPI_CONTENT_TYPE } from '@workspace/shared-data/const';

import { flagStore } from '../db/flag-store.ts';
import { createSingleErrorDocument } from '../serializers/error.ts';
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
    console.error('Error getting flags:', error);
    res
      .status(500)
      .json(
        createSingleErrorDocument(
          '500',
          'Internal Server Error',
          'An unexpected error occurred while fetching flags',
        ),
      );
  }
}

/**
 * PUT /flag/:id - Update an existing flag
 */
export function updateFlag(req: Request, res: Response) {
  try {
    const idValidation = validateRequiredParam('flag id', req.params['id']);
    if (!idValidation.success) {
      return res.status(idValidation.status).json(idValidation.error);
    }

    const id = idValidation.data;

    if (!flagStore.exists(id)) {
      return res
        .status(404)
        .json(
          createSingleErrorDocument(
            '404',
            'Not Found',
            `Flag with id '${id}' not found`,
          ),
        );
    }

    // Validate the request using Zod
    const validationResult = validateUpdateRequest(
      'flag',
      id,
      flagUpdateSchema,
      req.body,
    );

    if (!validationResult.success) {
      return res.status(validationResult.status).json(validationResult.error);
    }

    // Update the flag
    const updatedFlag = flagStore.update(id, {
      // @ts-expect-error YOLO oh well
      value: validationResult.data.value,
    });

    if (!updatedFlag) {
      throw new Error(
        `Flag with id '${id}' not found even though flagStore.exists returned true`,
      );
    }

    const baseUrl = getBaseUrl(req);
    const document = createFlagDocument(updatedFlag, baseUrl);

    res.setHeader('Content-Type', JSONAPI_CONTENT_TYPE);
    return res.json(document);
  } catch (error) {
    console.error('Error updating flag:', error);
    return res
      .status(500)
      .json(
        createSingleErrorDocument(
          '500',
          'Internal Server Error',
          'An unexpected error occurred while updating the flag',
        ),
      );
  }
}
