import type { Request } from 'express';

import type {
  CollectionResourceDocument,
  ExistingResourceObject,
  SingleResourceDocument,
} from '@warp-drive/core/types/spec/json-api-raw';

import type { PaginatedResult } from '../db/base-store.ts';
import type { ExistingRecord } from '../types.ts';
import {
  buildPaginationLinks,
  getRequestUrl,
  getResourceUrl,
} from '../utils/url.ts';

const JSONAPI_VERSION = {
  version: '1.1',
} as const;

/**
 * Serialize a single resource document
 *
 * @example
 * ```json
 * {
 *   "data": {
 *     "type": "todo",
 *     "id": "1",
 *     "attributes": {
 *       "title": "Sample Todo",
 *       "completed": false
 *     }
 *   },
 *   "links": {
 *     "self": "http://example.com/api/todo/1"
 *   },
 *   "jsonapi": {
 *     "version": "1.1"
 *   }
 * }
 * ```
 */
export function serializeSingleResourceDocument<T extends string>(
  req: Request,
  type: T,
  record: ExistingRecord<T>,
  patchAttrs?: Partial<Omit<ExistingRecord<T>, 'id' | '$type'>>,
): SingleResourceDocument<T> {
  return {
    data: serializeExistingResourceObject(req, type, record, patchAttrs),
    links: {
      self: getRequestUrl(req),
    },
    jsonapi: JSONAPI_VERSION,
  };
}

/**
 * Serialize a collection resource document
 *
 * @example
 * ```json
 * {
 *   "data": [
 *     {
 *       "type": "todo",
 *       "id": "1",
 *       "attributes": {
 *         "title": "Sample Todo",
 *         "completed": false
 *       },
 *       "links": {
 *         "self": "http://example.com/api/todo/1"
 *       }
 *     }
 *     // ... more items
 *   ],
 *   "links": {
 *     "self": "http://example.com/api/todo"
 *   },
 *   "jsonapi": {
 *     "version": "1.1"
 *   }
 * }
 * ```
 */
export function serializeCollectionResourceDocument<T extends string>(
  req: Request,
  type: T,
  records: ExistingRecord<T>[],
): CollectionResourceDocument<T> {
  return {
    data: serializeExistingResourceCollection(req, type, records),
    links: {
      self: getRequestUrl(req),
    },
    jsonapi: JSONAPI_VERSION,
  };
}

/**
 * Serialize a paginated collection resource document
 *
 * @example
 * ```json
 * {
 *   "data": [
 *     {
 *       "type": "todo",
 *       "id": "1",
 *       "attributes": {
 *         "title": "Sample Todo",
 *         "completed": false
 *       },
 *       "links": {
 *         "self": "http://example.com/api/todo/1"
 *       }
 *     }
 *     // ... up to X more items
 *   ],
 *   "links": {
 *     "self": "http://example.com/api/todo",
 *     "first": "http://example.com/api/todo?page[limit]=25&page[offset]=0",
 *     "next": "http://example.com/api/todo?page[limit]=25&page[offset]=25",
 *     "last": "http://example.com/api/todo?page[limit]=25&page[offset]=75"
 *   },
 *   "jsonapi": {
 *     "version": "1.1"
 *   }
 * }
 * ```
 */
export function serializePaginatedCollectionResourceDocument<T extends string>(
  req: Request,
  type: T,
  paginatedResult: PaginatedResult<ExistingRecord<T>>,
): CollectionResourceDocument<T> {
  const paginationLinks = buildPaginationLinks(req, paginatedResult);

  return {
    data: serializeExistingResourceCollection(req, type, paginatedResult.data),
    links: {
      self: getRequestUrl(req),
      ...paginationLinks,
    },
    jsonapi: JSONAPI_VERSION,
  };
}

/** @private */
function serializeExistingResourceObject<T extends string>(
  req: Request,
  type: T,
  record: ExistingRecord<T>,
  patchAttrs?: Partial<Omit<ExistingRecord<T>, 'id' | '$type'>>,
): ExistingResourceObject<T> {
  const { id, $type, ...attributes } = record;

  return {
    type: $type,
    id,
    attributes: patchAttrs ?? attributes,
    links: {
      self: getResourceUrl(req, type, record),
    },
  };
}

/** @private */
function serializeExistingResourceCollection<T extends string>(
  req: Request,
  type: T,
  records: ExistingRecord<T>[],
): ExistingResourceObject<T>[] {
  return records.map((record) =>
    serializeExistingResourceObject(req, type, record),
  );
}
