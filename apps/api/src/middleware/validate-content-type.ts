import type { NextFunction, Request, Response } from 'express';

import { JSONAPI_CONTENT_TYPE } from '@workspace/shared-data/const';

import { JsonApiSerializer } from '../serializer.ts';

/**
 * Middleware to validate JSONAPI content type for POST/PATCH requests
 */
export function validateJsonApiContentType(
  req: Request,
  res: Response,
  next: NextFunction,
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
