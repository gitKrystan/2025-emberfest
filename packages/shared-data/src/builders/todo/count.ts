import { withResponseType } from '@warp-drive/core/request';
import type { RequestInfo } from '@warp-drive/core/types/request';
import type { ResourceMetaDocument } from '@warp-drive/core/types/spec/document';
import { buildBaseURL, buildQueryParams } from '@warp-drive/utilities';

export interface ResourceCountDocument extends ResourceMetaDocument {
  meta: {
    count: number;
  };
}

/**
 * GET /todo/ops.count
 */
export function getAllTodosCount(): RequestInfo<ResourceCountDocument> {
  const url = buildBaseURL({ resourcePath: 'todo' });

  return withResponseType<ResourceCountDocument>({
    method: 'GET',
    url: `${url}/ops.count`,

    // Adding the 'query' OpCode and specifying the 'todo' type in
    // `cacheOptions` tells the `DefaultCachePolicy` in our store to
    // automatically invalidate this request when any request with the
    // 'createRecord' OpCode + 'todo' in `cacheOptions.type` succeeds.
    op: 'query',
    cacheOptions: { types: ['todo', 'todo-count'] },
  });
}

/**
 * GET /todo/ops.count?filter[completed]=true
 */
export function getCompletedTodosCount(): RequestInfo<ResourceCountDocument> {
  const url = buildBaseURL({ resourcePath: 'todo' });
  const queryString = buildQueryParams({
    'filter[completed]': true,
  });

  return withResponseType<ResourceCountDocument>({
    method: 'GET',
    url: `${url}/ops.count?${queryString}`,

    // Adding the 'query' OpCode and specifying the 'todo' type in
    // `cacheOptions` tells the `DefaultCachePolicy` in our store to
    // automatically invalidate this request when any request with the
    // 'createRecord' OpCode + 'todo' in `cacheOptions.type` succeeds.
    op: 'query',
    cacheOptions: { types: ['todo', 'todo-count'] },
  });
}

/**
 * GET /todo/ops.count?filter[completed]=false
 */
export function getActiveTodosCount(): RequestInfo<ResourceCountDocument> {
  const url = buildBaseURL({ resourcePath: 'todo' });
  const queryString = buildQueryParams({
    'filter[completed]': false,
  });

  return withResponseType<ResourceCountDocument>({
    method: 'GET',
    url: `${url}/ops.count?${queryString}`,

    // Adding the 'query' OpCode and specifying the 'todo' type in
    // `cacheOptions` tells the `DefaultCachePolicy` in our store to
    // automatically invalidate this request when any request with the
    // 'createRecord' OpCode + 'todo' in `cacheOptions.type` succeeds.
    op: 'query',
    cacheOptions: { types: ['todo', 'todo-count'] },
  });
}
