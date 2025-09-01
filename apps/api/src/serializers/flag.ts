import type {
  ExistingResourceObject,
  JsonApiDocument,
} from '@warp-drive/core/types/spec/json-api-raw';

import type { ApiFlag } from '@workspace/shared-data/types';

import { JSONAPI_VERSION } from './base.ts';

// Flag-specific JSONAPI types
type FlagResource = ExistingResourceObject<'flag'>;
export type FlagDocument = JsonApiDocument<'flag'>;

/**
 * Serialize a single Flag to JSONAPI format
 */
function serializeFlag(flag: ApiFlag, baseUrl = ''): FlagResource {
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
function serializeFlags(flags: ApiFlag[], baseUrl = ''): FlagResource[] {
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
