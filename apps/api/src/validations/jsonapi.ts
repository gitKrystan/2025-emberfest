import { z } from 'zod';

/**
 * Base JSONAPI resource schema
 */
const baseResourceSchema = z.object({
  type: z.string(),
  id: z.string().optional(),
  attributes: z.record(z.string(), z.unknown()).optional(),
  relationships: z.record(z.string(), z.unknown()).optional(),
  links: z.record(z.string(), z.string()).optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
});

/**
 * JSONAPI request body schema for creation
 */
export const jsonApiCreateRequestSchema = z.object({
  data: baseResourceSchema,
  included: z.array(baseResourceSchema).optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
});

/**
 * JSONAPI request body schema for updates
 */
export const jsonApiUpdateRequestSchema = z.object({
  data: baseResourceSchema.extend({
    id: z.string(), // ID is required for updates
  }),
  included: z.array(baseResourceSchema).optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Create a schema for a specific resource type creation
 */
export function createResourceCreateSchema(resourceType: string) {
  return jsonApiCreateRequestSchema.refine(
    (data) => data.data.type === resourceType,
    {
      message: `Resource type must be '${resourceType}'`,
      path: ['data', 'type'],
    },
  );
}

/**
 * Create a schema for a specific resource type update with ID validation
 */
export function createResourceUpdateSchema(
  resourceType: string,
  expectedId: string,
) {
  return jsonApiUpdateRequestSchema
    .refine((data) => data.data.type === resourceType, {
      message: `Resource type must be '${resourceType}'`,
      path: ['data', 'type'],
    })
    .refine((data) => data.data.id === expectedId, {
      message: `Resource id must match URL parameter. Expected '${expectedId}'`,
      path: ['data', 'id'],
    });
}

/**
 * Types for JSONAPI requests
 */
export type JsonApiCreateRequest = z.infer<typeof jsonApiCreateRequestSchema>;
export type JsonApiUpdateRequest = z.infer<typeof jsonApiUpdateRequestSchema>;
