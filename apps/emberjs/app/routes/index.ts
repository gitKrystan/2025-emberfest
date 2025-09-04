import Route from '@ember/routing/route';
import { service } from '@ember/service';

import type { Future } from '@warp-drive/core/request';

import type { GetTodosResult } from '@workspace/shared-data/builders';
import { getAllTodos } from '@workspace/shared-data/builders';

import type Store from '#services/store';

export default class AllTodos extends Route {
  @service declare private readonly store: Store;

  model(): { todos: Future<GetTodosResult> } {
    return { todos: this.store.request(getAllTodos()) };
  }
}
