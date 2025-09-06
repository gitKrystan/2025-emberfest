import Route from '@ember/routing/route';
import { service } from '@ember/service';

import type { Future } from '@warp-drive/core/request';

import type { ReactiveSavedTodosDocument } from '@workspace/shared-data/builders';
import { getCompletedTodos } from '@workspace/shared-data/builders';

import type Store from '#/services/store';

export default class CompletedTodos extends Route {
  @service declare private readonly store: Store;

  model(): { todos: Future<ReactiveSavedTodosDocument> } {
    return { todos: this.store.request(getCompletedTodos()) };
  }
}
