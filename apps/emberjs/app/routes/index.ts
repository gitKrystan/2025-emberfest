import Route from '@ember/routing/route';
import { service } from '@ember/service';

import type { Future } from '@warp-drive/core/request';
import type { CollectionResourceDataDocument } from '@warp-drive/core/types/spec/document';

import { getAllTodos } from '@workspace/shared-data/builders';
import type { SavedTodo } from '@workspace/shared-data/types';

import type Store from '#services/store';

export default class AllTodos extends Route {
  @service declare store: Store;

  model(): { todos: Future<CollectionResourceDataDocument<SavedTodo>> } {
    return { todos: this.store.request(getAllTodos()) };
  }
}
