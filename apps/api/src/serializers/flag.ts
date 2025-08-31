import type { ApiFlag } from '@workspace/shared-data/types';

import type { JsonApiDocument, JsonApiResource } from '../types.ts';
import { flagUpdateSchema } from '../validations/flag.ts';
import { safeValidate } from '../validations/utils.ts';
import { JSONAPI_VERSION } from './base.ts';

// Flag-specific JSONAPI types
export type FlagResource = JsonApiResource<ApiFlag>;
export type FlagDocument = JsonApiDocument<ApiFlag>;

/**
 * Serialize a single Flag to JSONAPI format
 */
export function serializeFlag(flag: ApiFlag, baseUrl = ''): FlagResource {
  const { id, ...attributes } = flag;

  return {
    type: 'flag',
    id,
    attributes,
    links: {
      self: `${baseUrl}/flag/${id}`,
    },
  };
}

/**
 * Serialize multiple Flags to JSONAPI format
 */
export function serializeFlags(flags: ApiFlag[], baseUrl = ''): FlagResource[] {
  return flags.map((flag) => serializeFlag(flag, baseUrl));
}

/**
 * Create a JSONAPI document for a single Flag
 */
export function createFlagDocument(flag: ApiFlag, baseUrl = ''): FlagDocument {
  return {
    data: serializeFlag(flag, baseUrl),
    jsonapi: JSONAPI_VERSION,
    links: {
      self: `${baseUrl}/flag/${flag.id}`,
    },
  } as FlagDocument;
}

/**
 * Create a JSONAPI document for multiple Flags
 */
export function createFlagsDocument(
  flags: ApiFlag[],
  baseUrl = '',
): FlagDocument {
  return {
    data: serializeFlags(flags, baseUrl),
    jsonapi: JSONAPI_VERSION,
    links: {
      self: `${baseUrl}/flag`,
    },
  } as FlagDocument;
}

/**
 * Deserialize a JSONAPI Flag resource to a Flag object
 */
export function deserializeFlag(resource: FlagResource): Partial<ApiFlag> {
  if (resource.type !== 'flag') {
    throw new Error(`Expected resource type 'flag', got '${resource.type}'`);
  }

  const flag: Partial<ApiFlag> = {};

  flag.id = resource.id;

  if (resource.attributes) {
    flag.value = resource.attributes.value;
  }

  return flag;
}

/**
 * Validate Flag data for updates using Zod
 */
export function validateFlagForUpdate(data: Partial<ApiFlag>): string[] {
  return safeValidate(flagUpdateSchema, data);
}
