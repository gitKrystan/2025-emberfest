import { assert } from '@warp-drive/core/build-config/macros';
import {
  withReactiveResponse,
  withResponseType,
} from '@warp-drive/core/request';
import type { RequestInfo } from '@warp-drive/core/types/request';
import type { EmptyResourceDocument } from '@warp-drive/core/types/spec/json-api-raw';
import { buildBaseURL, buildQueryParams } from '@warp-drive/utilities';

import type Store from '../../stores/index.ts';
import type { Todo, TodoAttributes } from '../../types/index.ts';
import type { ReactiveTodosDocument } from './types';
import { patchCacheTodoActivated, patchCacheTodoCompleted } from './update.ts';
import { keyForSavedResource } from './utils.ts';

// UPDATE

export function bulkPatchTodos(
  todos: Todo[],
  attributes: Partial<TodoAttributes>,
): RequestInfo<ReactiveTodosDocument> {
  assert('No todos passed to bulk patch', todos.length > 0);
  const keys = todos.map((todo) => keyForSavedResource(todo));

  const url = buildBaseURL({ resourcePath: 'todo' });

  return withReactiveResponse<Todo[]>({
    method: 'PATCH',
    url: `${url}/ops.bulk.patch`,
    body: JSON.stringify({
      data: keys.map((key) => ({
        type: key.type,
        id: key.id,
      })),
      attributes,
    }),

    // Adding the 'updateRecord' OpCode and specifying the `ResourceKey`s for
    // these todos in the `records` array tells the `DefaultCachePolicy` in our
    // store that when this request succeeds it should automatically patch
    // the returned attributes into any matching resources in any cached
    // documents for requests with the 'query' OpCode that include these
    // records in their results when this request succeeds.
    op: 'updateRecord',
    records: keys,
  });
}

export function bulkPatchAllTodosToActive(): RequestInfo<ReactiveTodosDocument> {
  const url = buildBaseURL({ resourcePath: 'todo' });
  // filter to active so we only activate completed
  const queryString = buildQueryParams({
    'filter[completed]': true,
  });

  return withReactiveResponse<Todo[]>({
    method: 'PATCH',
    url: `${url}/ops.bulk.patchAll?${queryString}`,
    body: JSON.stringify({
      attributes: { completed: false },
    }),

    // Adding the 'updateRecord' OpCode and specifying the 'todo' type in
    // `cacheOptions` tells the `DefaultCachePolicy` in our store to
    // automatically invalidate this request when this bulk operation succeeds.
    op: 'updateRecord',
    cacheOptions: { types: ['todo'] },
  });
}

export function bulkPatchAllTodosToCompleted(): RequestInfo<EmptyResourceDocument> {
  const url = buildBaseURL({ resourcePath: 'todo' });
  // filter to active so we only complete active
  const queryString = buildQueryParams({
    'filter[completed]': false,
  });

  return withResponseType<EmptyResourceDocument>({
    method: 'PATCH',
    url: `${url}/ops.bulk.patchAll?${queryString}`,
    body: JSON.stringify({
      attributes: { completed: true },
    }),
  });
}

// FIXME: Check w/ @runspired that this isn't totally ridiculous
export function bulkPatchCacheTodos(
  store: Store,
  todos: Todo[],
  attributes: Partial<TodoAttributes>,
  options?: { invalidateCounts?: boolean },
) {
  for (const todo of todos.toReversed()) {
    const resourceKey = keyForSavedResource(todo);

    // If the `completed` attribute is being changed, we need to move the
    // todo between the "active" and "completed" lists as needed.
    if ('completed' in attributes) {
      const wasCompleted = todo.completed;
      const isCompleted = attributes.completed;

      if (isCompleted && !wasCompleted) {
        patchCacheTodoCompleted(store, todo, { invalidateCounts: false });
      } else if (!isCompleted && wasCompleted) {
        patchCacheTodoActivated(store, todo, { invalidateCounts: false });
      }
    }

    // Finally, patch the attributes into the cached resource
    store.cache.upsert(resourceKey, { ...resourceKey, attributes }, true);
  }

  if (options?.invalidateCounts ?? true) {
    store.lifetimes.invalidateRequestsForType('todo-count', store);
  }
}

// DELETE

/**
 * DELETE /api/todo/ops.bulk.delete
 *
 * @param todos - The todos to delete
 */
export function bulkDeleteTodos(
  todos: Todo[],
): RequestInfo<ReactiveTodosDocument> {
  assert('No todos passed to bulk delete', todos.length > 0);
  const keys = todos.map(keyForSavedResource);

  const url = buildBaseURL({ resourcePath: 'todo' });

  return withReactiveResponse<Todo[]>({
    method: 'DELETE',
    url: `${url}/ops.bulk.delete`,
    body: JSON.stringify({
      data: keys.map((key) => ({
        type: key.type,
        id: key.id,
      })),
    }),

    // Adding the 'deleteRecord' OpCode and specifying the `ResourceKey`s for
    // these todos in the `records` array tells the cache that when this
    // request succeeds it should automatically remove any matching resources
    // from any cached documents for any requests that include these records
    // in their results.
    op: 'deleteRecord',
    records: keys,
  });
}

/**
 * DELETE /api/todo/ops.bulk.deleteAll?filter[completed]=true
 */
export function bulkDeleteCompletedTodos(): RequestInfo<EmptyResourceDocument> {
  const url = buildBaseURL({ resourcePath: 'todo' });
  const queryString = buildQueryParams({
    'filter[completed]': true,
  });

  return withResponseType<EmptyResourceDocument>({
    method: 'DELETE',
    url: `${url}/ops.bulk.deleteAll?${queryString}`,
  });
}

/*













Comment so that Slidev can scroll bulkDeleteCompletedTodos to the middle
*/
