import { z } from 'zod';

import { BadRequestError, InternalServerError } from '../errors.ts';

/**
 * Utility function to handle Zod validation and return errors in a consistent format
 */
export function validateWithZod<T>(schema: z.ZodType<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new BadRequestError({
        detail: error.issues.map((issue) => issue.message),
      });
    }
    throw new InternalServerError({
      detail: ['Validation failed in an unexpected manner'],
    });
  }
}
