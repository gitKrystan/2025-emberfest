import { recordIdentifierFor } from '@warp-drive/core';
import { assert } from '@warp-drive/core/build-config/macros';
import type {
  PersistedResourceKey,
  RequestKey,
} from '@warp-drive/core/types/identifier';
import type { RequestInfo } from '@warp-drive/core/types/request';

import { isExisting } from '../../index.ts';
import type Store from '../../stores/index.ts';
import type { Todo } from '../../types/todo.ts';

export function keyForSavedResource(
  resource: Todo,
): PersistedResourceKey<'todo'> {
  const key = recordIdentifierFor(resource);
  assert('Expected key to have type and id', isExisting(key));
  return key;
}

export function keyForRequest(store: Store, request: RequestInfo): RequestKey {
  const key = store.cacheKeyManager.getOrCreateDocumentIdentifier(request);
  assert('Expected key to be defined', key);
  return key;
}
