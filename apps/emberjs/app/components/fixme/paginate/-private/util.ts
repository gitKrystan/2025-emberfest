import type { Link } from '@warp-drive/core/types/spec/json-api-raw';

export function getHref(link?: Link | null): string | null {
  if (!link) {
    return null;
  }
  if (typeof link === 'string') {
    return link;
  }
  return link.href;
}
