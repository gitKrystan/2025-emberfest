import { z } from 'zod';

/**
 * Schema for validating Flag data for updates
 */
export const booleanFlagUpdateSchema = z.object({
  value: z.boolean(),
});

export const positiveNumberFlagUpdateSchema = z.object({
  value: z.number().gte(0),
});
