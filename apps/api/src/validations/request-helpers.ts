import type { z } from 'zod';

import { BadRequestError } from '../errors.ts';
import {
  createResourceCreateSchema,
  createResourceUpdateSchema,
} from './jsonapi.ts';
import { validateWithZod } from './utils.ts';

/**
 * Validate a JSONAPI create request and extract the resource data
 */
export function validateCreateRequest<T>(
  resourceType: string,
  dataSchema: z.ZodType<T>,
  requestBody: unknown,
): T {
  // First validate the JSONAPI structure
  const requestSchema = createResourceCreateSchema(resourceType);
  const requestResult = validateWithZod(requestSchema, requestBody);

  // Then validate the actual data payload
  return validateWithZod(dataSchema, requestResult.data.attributes);
}

/**
 * Validate a JSONAPI update request and extract the resource data
 */
export function validateUpdateRequest<T>(
  resourceType: string,
  expectedId: string,
  dataSchema: z.ZodType<T>,
  requestBody: unknown,
): T {
  // First validate the JSONAPI structure
  const requestSchema = createResourceUpdateSchema(resourceType, expectedId);
  const requestResult = validateWithZod(requestSchema, requestBody);

  // Then validate the actual data payload
  return validateWithZod(dataSchema, requestResult.data.attributes);
}

/**
 * Validate that a required parameter exists
 */
export function validateRequiredParam(
  paramName: string,
  paramValue: unknown,
): string {
  if (!paramValue || typeof paramValue !== 'string') {
    throw new BadRequestError({
      detail: [`Request must include a ${paramName}`],
    });
  }

  return paramValue;
}
