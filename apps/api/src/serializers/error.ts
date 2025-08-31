import type { Response } from 'express';

import { BaseApiError, type ErrorStatusCode } from '../errors.js';
import type { JsonApiDocument, JsonApiError } from '../types.ts';
import { JSONAPI_VERSION } from './base.ts';

export function handleError(res: Response, error: unknown) {
  if (error instanceof BaseApiError) {
    console.error('Error:', error);
    return res.status(error.status).json(createSingleErrorDocument(error));
  }

  const status =
    (error as { status?: ErrorStatusCode }).status ?? (500 as const);
  const detail = (error as { detail?: string[] }).detail ?? [
    'An unexpected error occurred',
  ];

  const e = new BaseApiError({ status, detail, cause: error });
  console.error('Error:', e);
  return res.status(e.status).json(createSingleErrorDocument(e));
}

/**
 * Create a single error document
 */
function createSingleErrorDocument(error: BaseApiError): JsonApiDocument<null> {
  return createErrorDocument([
    {
      status: error.status.toString(),
      title: error.message,
      detail: error.detail.join(', '),
      code: error.status.toString(),
    },
  ]);
}

/**
 * Create a JSONAPI error document
 */
function createErrorDocument(errors: JsonApiError[]): JsonApiDocument<null> {
  return {
    errors,
    jsonapi: JSONAPI_VERSION,
  };
}
