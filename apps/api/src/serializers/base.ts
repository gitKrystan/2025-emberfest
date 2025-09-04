import type {
  CollectionResourceDocument,
  ExistingResourceObject,
  SingleResourceDocument,
} from '@warp-drive/core/types/spec/json-api-raw';

const JSONAPI_VERSION = {
  version: '1.1',
} as const;

interface ExistingRecord<T extends string> {
  id: string;
  $type: T;
}

export function serializeSingleResourceDocument<T extends string>(
  type: T,
  record: ExistingRecord<T>,
  baseUrl: string,
  patchAttrs?: Partial<Omit<ExistingRecord<T>, 'id' | '$type'>>,
): SingleResourceDocument<T> {
  return {
    data: serializeExistingResourceObject(type, record, baseUrl, patchAttrs),
    jsonapi: JSONAPI_VERSION,
    links: {
      self: `${baseUrl}/${type}/${record.id}`,
    },
  };
}

function serializeExistingResourceObject<T extends string>(
  type: T,
  record: ExistingRecord<T>,
  baseUrl: string,
  patchAttrs?: Partial<Omit<ExistingRecord<T>, 'id' | '$type'>>,
): ExistingResourceObject<T> {
  const { id, $type, ...attributes } = record;

  return {
    type: $type,
    id,
    attributes: patchAttrs ?? attributes,
    links: {
      self: `${baseUrl}/${type}/${id}`,
    },
  };
}

export function serializeCollectionResourceDocument<T extends string>(
  type: T,
  records: ExistingRecord<T>[],
  baseUrl: string,
): CollectionResourceDocument<T> {
  return {
    data: serializeExistingResourceCollection(type, records, baseUrl),
    jsonapi: JSONAPI_VERSION,
    links: {
      self: `${baseUrl}/${type}`,
    },
  };
}

function serializeExistingResourceCollection<T extends string>(
  type: T,
  records: ExistingRecord<T>[],
  baseUrl: string,
): ExistingResourceObject<T>[] {
  return records.map((record) =>
    serializeExistingResourceObject(type, record, baseUrl),
  );
}
