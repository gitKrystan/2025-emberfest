import { withReactiveResponse } from '@warp-drive/core/request';
import type { RequestInfo } from '@warp-drive/core/types/request';
import { buildBaseURL } from '@warp-drive/utilities';

import type { Todo, TodoAttributes } from '../../types/index.ts';
import type { ReactiveTodoDocument } from './types.ts';

/** POST /api/todo */
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

    op: 'createRecord',
    cacheOptions: { types: ['todo', 'todo-count'] },
  });
}
