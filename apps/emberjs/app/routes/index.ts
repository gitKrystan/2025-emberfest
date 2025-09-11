import Route from '@ember/routing/route';
import { service } from '@ember/service';

import type { Future } from '@warp-drive/core/request';

import type { Store } from '@workspace/shared-data';
import type {
  ReactiveTodosDocument,
  ResourceCountDocument,
} from '@workspace/shared-data/builders';
import {
  getActiveTodosCount,
  getAllTodos,
  getAllTodosCount,
  getCompletedTodosCount,
} from '@workspace/shared-data/builders';

export default class AllTodos extends Route {
  @service declare private readonly store: Store;

  model(params: { page: number }): {
    todos: Future<ReactiveTodosDocument>;
    counts: Future<ResourceCountDocument>[];
  } {
    return {
      todos: this.store.request(getAllTodos(params.page)),
      counts: [
        this.store.request(getAllTodosCount()),
        this.store.request(getCompletedTodosCount()),
        this.store.request(getActiveTodosCount()),
      ],
    };
  }
}
