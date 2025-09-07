import type { Request } from 'express';

import type { PaginationLinks } from '@warp-drive/core/types/spec/json-api-raw';

import type { PaginatedResult } from '../db/base-store.ts';
import type { ExistingRecord } from '../types.ts';

/**
 * Get the base URL for generating links
 */
export function getBaseUrl(req: Request): string {
  const host = req.get('host');
  if (!host) {
    throw new Error('Host header is missing');
  }
  return `${req.protocol}://${host}`;
}

/**
 * Get the URL for a resource
 */
export function getResourceUrl<T extends string>(
  req: Request,
  type: T,
  record: ExistingRecord<T>,
): string {
  const baseUrl = getBaseUrl(req);
  return `${baseUrl}/api/${type}/${record.id}`;
}

/**
 * Get the complete request URL including query parameters
 * This is used for the `self` link in top-level links objects
 */
export function getRequestUrl(req: Request): string {
  const baseUrl = getBaseUrl(req);
  return `${baseUrl}${req.originalUrl}`;
}

/**
 * Build valid JSONAPI pagination links
 */
export function buildPaginationLinks<T>(
  request: Request,
  paginatedResult: PaginatedResult<T>,
): PaginationLinks {
  const { limit, offset, total } = paginatedResult;
  const baseUrl = getBaseUrl(request);
  const url = new URL(`${baseUrl}${request.path}`);

  // Copy existing query parameters except pagination
  // Express parses nested query params like filter[completed] into nested objects
  const addQueryParam = (key: string, value: unknown) => {
    if (typeof value === 'string') {
      url.searchParams.set(key, value);
    } else if (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value)
    ) {
      // Handle nested query parameters like filter[completed]
      for (const [nestedKey, nestedValue] of Object.entries(
        value as Record<string, unknown>,
      )) {
        if (typeof nestedValue === 'string') {
          url.searchParams.set(`${key}[${nestedKey}]`, nestedValue);
        }
      }
    }
  };

  for (const [key, value] of Object.entries(request.query)) {
    if (!key.startsWith('page[')) {
      addQueryParam(key, value);
    }
  }

  const links: PaginationLinks = {};

  // First page
  url.searchParams.set('page[limit]', limit.toString());
  url.searchParams.set('page[offset]', '0');
  links.first = url.toString();

  // Last page
  const lastOffset = Math.max(0, Math.floor((total - 1) / limit) * limit);
  url.searchParams.set('page[offset]', lastOffset.toString());
  links.last = url.toString();

  // Previous page
  if (offset > 0) {
    const prevOffset = Math.max(0, offset - limit);
    url.searchParams.set('page[offset]', prevOffset.toString());
    links.prev = url.toString();
  }

  // Next page
  if (offset + limit < total) {
    const nextOffset = offset + limit;
    url.searchParams.set('page[offset]', nextOffset.toString());
    links.next = url.toString();
  }

  return links;
}
