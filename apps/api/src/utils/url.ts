import type { Request } from 'express';

interface ExistingRecord<T extends string> {
  id: string;
  $type: T;
}

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
