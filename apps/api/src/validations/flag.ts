import { z } from 'zod';

/**
 * Schema for validating Flag data for updates
 */
export const booleanFlagUpdateSchema = z.object({
  value: z.boolean(),
});
export type BooleanFlagUpdateData = z.infer<typeof booleanFlagUpdateSchema>;

export const positiveNumberFlagUpdateSchema = z.object({
  value: z.number().gte(0),
});
export type PositiveNumberFlagUpdateData = z.infer<
  typeof positiveNumberFlagUpdateSchema
>;
