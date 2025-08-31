import type { z } from 'zod';

import { createSingleErrorDocument } from '../serializers/error.ts';
import type { JsonApiDocument } from '../types.ts';
import {
  createResourceCreateSchema,
  createResourceUpdateSchema,
} from './jsonapi.ts';
import { validateWithZod } from './utils.ts';

/**
 * Result type for validation operations
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; status: number; error: JsonApiDocument<null> };

/**
 * Validate a JSONAPI create request and extract the resource data
 */
export function validateCreateRequest<T>(
  resourceType: string,
  dataSchema: z.ZodType<T>,
  requestBody: unknown,
): ValidationResult<T> {
  // First validate the JSONAPI structure
  const requestSchema = createResourceCreateSchema(resourceType);
  const requestResult = validateWithZod(requestSchema, requestBody);

  if (!requestResult.success) {
    return {
      success: false,
      status: 400,
      error: createSingleErrorDocument(
        '400',
        'Bad Request',
        requestResult.errors.join(', '),
      ),
    };
  }

  // Then validate the actual data payload
  const dataResult = validateWithZod(
    dataSchema,
    requestResult.data?.data.attributes,
  );

  if (!dataResult.success) {
    return {
      success: false,
      status: 400,
      error: createSingleErrorDocument(
        '400',
        'Validation Error',
        dataResult.errors.join(', '),
      ),
    };
  }

  if (!dataResult.data) {
    return {
      success: false,
      status: 400,
      error: createSingleErrorDocument(
        '400',
        'Validation Error',
        'Invalid data format',
      ),
    };
  }

  return {
    success: true,
    data: dataResult.data,
  };
}

/**
 * Validate a JSONAPI update request and extract the resource data
 */
export function validateUpdateRequest<T>(
  resourceType: string,
  expectedId: string,
  dataSchema: z.ZodType<T>,
  requestBody: unknown,
): ValidationResult<T> {
  // First validate the JSONAPI structure
  const requestSchema = createResourceUpdateSchema(resourceType, expectedId);
  const requestResult = validateWithZod(requestSchema, requestBody);

  if (!requestResult.success) {
    return {
      success: false,
      status: 400,
      error: createSingleErrorDocument(
        '400',
        'Bad Request',
        requestResult.errors.join(', '),
      ),
    };
  }

  // Then validate the actual data payload
  const dataResult = validateWithZod(
    dataSchema,
    requestResult.data?.data.attributes,
  );

  if (!dataResult.success) {
    return {
      success: false,
      status: 400,
      error: createSingleErrorDocument(
        '400',
        'Validation Error',
        dataResult.errors.join(', '),
      ),
    };
  }

  if (!dataResult.data) {
    return {
      success: false,
      status: 400,
      error: createSingleErrorDocument(
        '400',
        'Validation Error',
        'Invalid data format',
      ),
    };
  }

  return {
    success: true,
    data: dataResult.data,
  };
}

/**
 * Validate that a required parameter exists
 */
export function validateRequiredParam(
  paramName: string,
  paramValue: unknown,
): ValidationResult<string> {
  if (!paramValue || typeof paramValue !== 'string') {
    return {
      success: false,
      status: 400,
      error: createSingleErrorDocument(
        '400',
        'Bad Request',
        `Request must include a ${paramName}`,
      ),
    };
  }

  return {
    success: true,
    data: paramValue,
  };
}
