import type { JsonApiError, TodoDocument } from '../types.ts';
import { JSONAPI_VERSION } from './base.ts';

/**
 * Create a JSONAPI error document
 */
export function createErrorDocument(errors: JsonApiError[]): TodoDocument {
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
): TodoDocument {
  return createErrorDocument([
    {
      status,
      title,
      detail,
      code,
    },
  ]);
}
