import type { Request } from 'express';

import type {
  CollectionResourceDocument,
  ExistingResourceObject,
  SingleResourceDocument,
} from '@warp-drive/core/types/spec/json-api-raw';

import { getRequestUrl, getResourceUrl } from '../utils/url.ts';

const JSONAPI_VERSION = {
  version: '1.1',
} as const;

interface ExistingRecord<T extends string> {
  id: string;
  $type: T;
}

export function serializeSingleResourceDocument<T extends string>(
  req: Request,
  type: T,
  record: ExistingRecord<T>,
  patchAttrs?: Partial<Omit<ExistingRecord<T>, 'id' | '$type'>>,
): SingleResourceDocument<T> {
  return {
    data: serializeExistingResourceObject(req, type, record, patchAttrs),
    jsonapi: JSONAPI_VERSION,
    links: {
      self: getRequestUrl(req),
    },
  };
}

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

export function serializeCollectionResourceDocument<T extends string>(
  req: Request,
  type: T,
  records: ExistingRecord<T>[],
): CollectionResourceDocument<T> {
  return {
    data: serializeExistingResourceCollection(req, type, records),
    jsonapi: JSONAPI_VERSION,
    links: {
      self: getRequestUrl(req),
    },
  };
}

function serializeExistingResourceCollection<T extends string>(
  req: Request,
  type: T,
  records: ExistingRecord<T>[],
): ExistingResourceObject<T>[] {
  return records.map((record) =>
    serializeExistingResourceObject(req, type, record),
  );
}
