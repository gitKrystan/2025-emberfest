import type { Request, Response } from 'express';

import { JSONAPI_CONTENT_TYPE } from '@workspace/shared-data/const';
import type { ApiFlag } from '@workspace/shared-data/types';

import { createSingleErrorDocument } from '../serializers/error.ts';
import {
  createFlagDocument,
  createFlagsDocument,
  deserializeFlag,
  validateFlagForUpdate,
} from '../serializers/flag.ts';
import { flagStore } from '../store.ts';
import type { FlagResource } from '../types.ts';
import { getBaseUrl } from '../utils/url.ts';

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
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json(
          createSingleErrorDocument(
            '400',
            'Bad Request',
            'Request must include a flag id',
          ),
        );
    }

    const { data } = req.body as { data?: FlagResource };

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
    if (data.type !== 'flag') {
      return res
        .status(409)
        .json(
          createSingleErrorDocument(
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
          createSingleErrorDocument(
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
          createSingleErrorDocument(
            '409',
            'Conflict',
            `Resource id must match URL parameter. Expected '${id}', got '${data.id}'`,
          ),
        );
    }

    // Deserialize the request data
    let flagData: Partial<ApiFlag>;
    try {
      flagData = deserializeFlag(data);
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

    // Validate the flag data
    const validationErrors = validateFlagForUpdate(flagData);
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

    // Update the flag
    const updatedFlag = flagStore.update(id, {
      // @ts-expect-error YOLO oh well
      value: flagData.value,
    });

    if (!updatedFlag) {
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
