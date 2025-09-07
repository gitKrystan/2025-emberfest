import { withReactiveResponse } from '@warp-drive/core/request';
import type { RequestInfo } from '@warp-drive/core/types/request';
import { buildBaseURL } from '@warp-drive/utilities';

import type { Todo, TodoAttributes } from '../../types/index.ts';
import type { ReactiveTodoDocument } from './types.ts';

/**
 * POST /todo
 */
export function createTodo(
  attributes: TodoAttributes,
): RequestInfo<ReactiveTodoDocument> {
  return withReactiveResponse<Todo>({
    method: 'POST',
    url: buildBaseURL({ resourcePath: 'todo' }),
    body: JSON.stringify({
      data: {
        type: 'todo',
        attributes,
      },
    }),

    // Adding the 'createRecord' OpCode and specifying the 'todo' type in
    // `cacheOptions` tells the `DefaultCachePolicy` in our store to
    // automatically invalidate any requests with the 'query' OpCode + 'todo'
    // in their `cacheOptions.type` when this request succeeds.
    op: 'createRecord',
    cacheOptions: { types: ['todo', 'todo-count'] },
  });
}
