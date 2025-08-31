// JSONAPI Resource Object interface
export interface JsonApiResource<R extends { id: string } = { id: string }> {
  type: string;
  id: R['id'];
  attributes?: Omit<R, 'id'>;
  relationships?: Record<string, JsonApiRelationship>;
  links?: JsonApiLinks;
  meta?: Record<string, unknown>;
}

// JSONAPI Document interface
export interface JsonApiDocument<T extends { id: string } | null> {
  data?: T extends { id: string }
    ? JsonApiResource<T> | JsonApiResource<T>[] | null
    : null;
  errors?: JsonApiError[];
  meta?: Record<string, unknown>;
  jsonapi?: {
    version?: string;
    meta?: Record<string, unknown>;
  };
  links?: JsonApiLinks;
  included?: JsonApiResource[];
}

// JSONAPI Relationship interface
export interface JsonApiRelationship {
  links?: JsonApiLinks;
  data?: JsonApiResourceIdentifier | JsonApiResourceIdentifier[] | null;
  meta?: Record<string, unknown>;
}

// JSONAPI Resource Identifier interface
export interface JsonApiResourceIdentifier<
  R extends { id: string } = { id: string },
> {
  type: string;
  id: R['id'];
  meta?: Record<string, unknown>;
}

// JSONAPI Links interface
export interface JsonApiLinks {
  self?: string;
  related?: string;
  first?: string;
  last?: string;
  prev?: string;
  next?: string;
  [key: string]: string | undefined;
}

// JSONAPI Error interface
export interface JsonApiError {
  id?: string | undefined;
  links?:
    | {
        about?: string;
        type?: string;
      }
    | undefined;
  status?: string | undefined;
  code?: string | undefined;
  title?: string | undefined;
  detail?: string | undefined;
  source?:
    | {
        pointer?: string;
        parameter?: string;
        header?: string;
      }
    | undefined;
  meta?: Record<string, unknown>;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}
