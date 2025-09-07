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
  filter: z
    .object({
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
              message: 'filter.completed must be "true" or "false"',
              path: ['filter', 'completed'],
            },
          ]);
        }),
    })
    .optional(),
  page: z
    .object({
      limit: z
        .string()
        .optional()
        .transform((val) => {
          if (val === undefined) return undefined;
          const num = parseInt(val, 10);
          if (isNaN(num) || num < 1 || num > 100) {
            throw new z.ZodError([
              {
                code: 'custom',
                message: 'page.limit must be a number between 1 and 100',
                path: ['page', 'limit'],
              },
            ]);
          }
          return num;
        }),
      offset: z
        .string()
        .optional()
        .transform((val) => {
          if (val === undefined) return undefined;
          const num = parseInt(val, 10);
          if (isNaN(num) || num < 0) {
            throw new z.ZodError([
              {
                code: 'custom',
                message: 'page.offset must be a non-negative number',
                path: ['page', 'offset'],
              },
            ]);
          }
          return num;
        }),
    })
    .optional(),
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
