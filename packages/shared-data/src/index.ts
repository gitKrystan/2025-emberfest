import type { ResourceKey } from '@warp-drive/core/types';
import type { PersistedResourceKey } from '@warp-drive/core/types/identifier';

export { setDefaultBuildURLConfig } from './configs/url.ts';
export { default as Store } from './stores/index.ts';

export function isExisting(
  identifier: ResourceKey,
): identifier is PersistedResourceKey {
  return (
    'id' in identifier &&
    identifier.id !== null &&
    'type' in identifier &&
    !!identifier.type
  );
}
