import type { NextFunction, Request, Response } from 'express';

import { JSONAPI_CONTENT_TYPE } from '@workspace/shared-data/const';

import { UnsupportedMediaTypeError } from '../errors.ts';
import { handleError } from '../serializers/error.ts';

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
      return handleError(
        res,
        new UnsupportedMediaTypeError({
          detail: [`Content-Type must be ${JSONAPI_CONTENT_TYPE}`],
        }),
      );
    }
  }
  next();
}
