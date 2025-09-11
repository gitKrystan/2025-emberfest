import { z } from 'zod';

import { hardCodedLists } from '@workspace/shared-data/types';

/**
 * Schema for validating Flag data for updates
 */
export const booleanFlagUpdateSchema = z.object({
  value: z.boolean(),
});

export const positiveNumberFlagUpdateSchema = z.object({
  value: z.number().gte(0),
});

export const initialTodoCountSchema = z.object({
  value: z.enum(hardCodedLists).or(z.number().gte(0)),
});
