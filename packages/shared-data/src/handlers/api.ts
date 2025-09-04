import type { Future, Handler, NextFn } from '@warp-drive/core/request';
import type { RequestContext } from '@warp-drive/core/types/request';

import { JSONAPI_CONTENT_TYPE } from '../const/index.ts';

const HEADERS = {
  Accept: JSONAPI_CONTENT_TYPE,
  'Content-Type': JSONAPI_CONTENT_TYPE,
};

const API_ROOT = `https://${location.hostname}/api/`;

function isApi(url: string): boolean {
  return url.startsWith(API_ROOT) || url.startsWith('/api');
}

export function useApiHandler(context: RequestContext): boolean {
  const { request } = context;
  if (!request.url || !isApi(request.url)) {
    return false;
  }
  return true;
}

export const ApiHandler: Handler = {
  request<T>(context: RequestContext, next: NextFn<T>): Future<T> {
    const { request } = context;
    const headers = new Headers(request.headers);
    for (const [key, value] of Object.entries(HEADERS)) {
      headers.set(key, value);
    }
    const req = Object.assign({}, request, { headers });

    return next(req);
  },
};
