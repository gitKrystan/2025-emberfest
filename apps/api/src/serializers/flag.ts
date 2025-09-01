import type {
  ApiFlag,
  CollectionFlagDocument,
  ExistingFlagResource,
  SingleFlagDocument,
} from '@workspace/shared-data/types';

import { JSONAPI_VERSION } from './base.ts';

/**
 * Serialize a single Flag to JSONAPI format
 */
function serializeFlag(flag: ApiFlag, baseUrl = ''): ExistingFlagResource {
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
function serializeFlags(
  flags: ApiFlag[],
  baseUrl = '',
): ExistingFlagResource[] {
  return flags.map((flag) => serializeFlag(flag, baseUrl));
}

/**
 * Create a JSONAPI document for a single Flag
 */
export function createFlagDocument(
  flag: ApiFlag,
  baseUrl = '',
): SingleFlagDocument {
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
): CollectionFlagDocument {
  return {
    data: serializeFlags(flags, baseUrl),
    jsonapi: JSONAPI_VERSION,
    links: {
      self: `${baseUrl}/flag`,
    },
  };
}
