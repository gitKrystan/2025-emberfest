import Route from '@ember/routing/route';
import { service } from '@ember/service';

import type { Future } from '@warp-drive/core/request';

import type { Store } from '@workspace/shared-data';
import type { ReactiveTodosDocument } from '@workspace/shared-data/builders';
import { getActiveTodos } from '@workspace/shared-data/builders';

export default class ActiveTodos extends Route {
  @service declare private readonly store: Store;

  model(params: { page: number }): { todos: Future<ReactiveTodosDocument> } {
    return { todos: this.store.request(getActiveTodos(params.page)) };
  }
}
