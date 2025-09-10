import type { ApiFlag } from '@workspace/shared-data/types';
import { asType } from '@workspace/shared-data/types';

import { Store } from './base-store.ts';

/**
 * Flag store implementation
 */
export class FlagStore extends Store<ApiFlag> {
  constructor() {
    super([
      asType<ApiFlag>({
        $type: 'flag',
        id: 'shouldError' as const,
        value: false,
      }),
      asType<ApiFlag>({
        $type: 'flag',
        id: 'initialTodoCount' as const,
        value: 3,
      }),
      asType<ApiFlag>({
        $type: 'flag',
        id: 'shouldPaginateFlag' as const,
        value: false,
      }),
      asType<ApiFlag>({
        $type: 'flag',
        id: 'latency' as const,
        value: 0,
      }),
    ]);
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
