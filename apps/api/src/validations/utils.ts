import { z } from 'zod';

/**
 * Utility function to handle Zod validation and return errors in a consistent format
 */
export function validateWithZod<T>(
  schema: z.ZodType<T>,
  data: unknown,
): {
  success: boolean;
  data?: T;
  errors: string[];
} {
  try {
    const result = schema.parse(data);
    return {
      success: true,
      data: result,
      errors: [],
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map((issue) => issue.message),
      };
    }
    return {
      success: false,
      errors: ['Validation failed'],
    };
  }
}

/**
 * Safe parse that returns errors as strings instead of throwing
 */
export function safeValidate<T>(schema: z.ZodType<T>, data: unknown): string[] {
  const result = validateWithZod(schema, data);
  return result.errors;
}
