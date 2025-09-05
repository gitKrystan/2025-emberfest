import { z } from 'zod';

/**
 * Schema for validating Todo data for creation
 */
export const todoCreationSchema = z.object({
  title: z.string().min(1, 'title is required and must be a non-empty string'),
  completed: z.boolean(),
});

/**
 * Schema for validating Todo data for updates
 */
export const todoUpdateSchema = z.object({
  title: z.string().min(1, 'title cannot be empty if provided').optional(),
  completed: z.boolean().optional(),
});

/**
 * Schema for validating query parameters for getTodos
 */
export const todoQuerySchema = z.object({
  completed: z
    .string()
    .optional()
    .transform((val) => {
      if (val === undefined) return undefined;
      if (val === 'true') return true;
      if (val === 'false') return false;
      throw new z.ZodError([
        {
          code: 'custom',
          message: 'completed must be "true" or "false"',
          path: ['completed'],
        },
      ]);
    }),
});
export type TodoQuery = z.infer<typeof todoQuerySchema>;

/**
 * Schema for validating bulk delete request
 */
export const todoBulkDeleteSchema = z.object({
  data: z
    .array(
      z.object({
        type: z.literal('todo'),
        id: z.string().min(1, 'id is required and must be a non-empty string'),
      }),
    )
    .min(1, 'At least one todo must be provided for bulk delete'),
});
export type TodoBulkDelete = z.infer<typeof todoBulkDeleteSchema>;

/**
 * Schema for validating bulk patch request
 */
export const todoBulkPatchSchema = z.object({
  data: z
    .array(
      z.object({
        type: z.literal('todo'),
        id: z.string().min(1, 'id is required and must be a non-empty string'),
      }),
    )
    .min(1, 'At least one todo must be provided for bulk delete'),
  attributes: todoUpdateSchema,
});
export type TodoBulkPatch = z.infer<typeof todoBulkPatchSchema>;
