import type { JsonApiDocument, JsonApiError } from '../types.ts';
import { JSONAPI_VERSION } from './base.ts';

/**
 * Create a JSONAPI error document
 */
export function createErrorDocument(errors: JsonApiError[]): JsonApiDocument {
  return {
    errors,
    jsonapi: JSONAPI_VERSION,
  };
}

/**
 * Create a single error document
 */
export function createSingleErrorDocument(
  status: string,
  title: string,
  detail?: string,
  code?: string,
): JsonApiDocument {
  return createErrorDocument([
    {
      status,
      title,
      detail,
      code,
    },
  ]);
}
