import { JSONAPI_CONTENT_TYPE } from '../const/index.ts';

export const defaultHeaders = new Headers({
  Accept: JSONAPI_CONTENT_TYPE,
  'Content-Type': JSONAPI_CONTENT_TYPE,
});
