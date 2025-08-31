import type { ApiFlag } from '@workspace/shared-data/types';

import type { FlagDocument, FlagResource } from '../types.ts';
import { FLAG_TYPE, JSONAPI_VERSION } from './base.ts';

/**
 * Serialize a single Flag to JSONAPI format
 */
export function serializeFlag(flag: ApiFlag, baseUrl = ''): FlagResource {
  const { id, ...attributes } = flag;

  return {
    type: FLAG_TYPE,
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
  };
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
  };
}

/**
 * Deserialize a JSONAPI Flag resource to a Flag object
 */
export function deserializeFlag(resource: FlagResource): Partial<ApiFlag> {
  if (resource.type !== FLAG_TYPE) {
    throw new Error(
      `Expected resource type '${FLAG_TYPE}', got '${resource.type}'`,
    );
  }

  const flag: Partial<ApiFlag> = {};

  if (resource.id) {
    flag.id = resource.id as ApiFlag['id'];
  }

  if (resource.attributes) {
    flag.value = resource.attributes.value;
  }

  return flag;
}

/**
 * Validate Flag data for updates
 */
export function validateFlagForUpdate(data: Partial<ApiFlag>): string[] {
  const errors: string[] = [];

  if ('value' in data && !data.value) {
    errors.push('value cannot be empty if provided');
  }

  return errors;
}
