export const JSONAPI_CONTENT_TYPE = 'application/vnd.api+json';

export const defaultHeaders = new Headers({
  Accept: JSONAPI_CONTENT_TYPE,
  'Content-Type': JSONAPI_CONTENT_TYPE,
});
