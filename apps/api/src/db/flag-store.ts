import type { ApiFlag } from '@workspace/shared-data/types';
import { asType } from '@workspace/shared-data/types';

import { Store } from './base-store.ts';

/**
 * Flag store implementation
 */
export class FlagStore extends Store<ApiFlag> {
  /**
   * Seed the store with initial data
   */
  seed(): ApiFlag[] {
    return [
      asType<ApiFlag>({ id: 'shouldError' as const, value: false }),
      asType<ApiFlag>({ id: 'initialTodoCount' as const, value: 3 }),
    ];
  }

  /**
   * Create a new flag (not supported)
   */
  create(): ApiFlag {
    throw new Error('unimplemented');
  }
}

// Export a singleton instance
export const flagStore = new FlagStore();
