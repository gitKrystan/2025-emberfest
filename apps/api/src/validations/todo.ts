import { z } from 'zod';

/**
 * Schema for validating Todo data for creation
 */
export const todoCreationSchema = z.object({
  title: z.string().min(1, 'title is required and must be a non-empty string'),
  completed: z.boolean().optional().default(false),
});

/**
 * Schema for validating Todo data for updates
 */
export const todoUpdateSchema = z.object({
  title: z.string().min(1, 'title cannot be empty if provided').optional(),
  completed: z.boolean().optional(),
});

/**
 * Type for Todo creation data
 */
export type TodoCreationData = z.infer<typeof todoCreationSchema>;

/**
 * Type for Todo update data
 */
export type TodoUpdateData = z.infer<typeof todoUpdateSchema>;
