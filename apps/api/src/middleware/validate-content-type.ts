import { Request, Response } from 'express';
import { JsonApiSerializer } from '../serializer';
import { JSONAPI_CONTENT_TYPE } from '@workspace/shared-data/const';

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
