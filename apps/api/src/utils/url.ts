import type { Request } from 'express';

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
