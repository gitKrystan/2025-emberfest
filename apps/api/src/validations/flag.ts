import { z } from 'zod';

/**
 * Schema for validating Flag data for updates
 */
export const flagUpdateSchema = z.object({
  value: z
    .union([z.string(), z.number(), z.boolean()])
    .refine(
      (val) => {
        // value cannot be empty string
        if (typeof val === 'string') {
          return val.trim().length > 0;
        }
        return true;
      },
      { message: 'value cannot be empty if provided' },
    )
    .optional(),
});

/**
 * Type for Flag update data
 */
export type FlagUpdateData = z.infer<typeof flagUpdateSchema>;
