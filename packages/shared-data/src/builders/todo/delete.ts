import { withReactiveResponse } from '@warp-drive/core/request';
import { buildBaseURL } from '@warp-drive/utilities';

import type { Todo } from '../../types/todo.ts';
import { keyForSavedResource } from './utils.ts';

/**
 * DELETE /todo/:id
 *
 * @param todo - The todo to delete
 */
export function deleteTodo(todo: Todo) {
  const key = keyForSavedResource(todo);

  const url = buildBaseURL({
    op: 'deleteRecord',
    resourcePath: 'todo',
    identifier: key,
  });

  return withReactiveResponse<Todo>({
    url,
    method: 'DELETE',

    // Adding the 'deleteRecord' OpCode and specifying the `ResourceKey` for
    // this todo in the `records` array tells the cache that when this
    // request succeeds it should automatically remove any matching resources
    // from any cached documents for any requests that include this record
    // in their results.
    op: 'deleteRecord',
    records: [key],
  });
}
