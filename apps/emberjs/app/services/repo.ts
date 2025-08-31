import { uniqueId } from '@ember/helper';
import Service, { service } from '@ember/service';
import { TrackedMap, TrackedObject } from 'tracked-built-ins';

import { getAllTodos } from '@workspace/shared-data/builders';
import type { SavedTodo, UnsavedTodo } from '@workspace/shared-data/types';

import type Store from '#services/store';

/** id to Todo */
type IndexedData = TrackedMap<string, SavedTodo>;

export default class Repo extends Service {
  data: IndexedData | null = null;

  @service declare store: Store;

  load = async () => {
    const foo = await this.store.requestManager.request(getAllTodos());
    console.log(foo);
    // localStorage has to be an array (required by the todomvc repo),
    // so let's convert to an object on id.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const list: SavedTodo[] = JSON.parse(
      window.localStorage.getItem('todos') ?? '[]'
    );

    this.data = list.reduce((indexed: IndexedData, todo) => {
      indexed.set(
        todo.id,
        new TrackedObject(
          todo as unknown as Record<string, unknown>
        ) as unknown as SavedTodo
      );

      return indexed;
    }, new TrackedMap<string, SavedTodo>());
  };

  get all() {
    if (!this.data) {
      throw new Error('Data not loaded yet');
    }
    return [...this.data.values()];
  }

  get completed() {
    return this.all.filter((todo) => todo.completed);
  }

  get active() {
    return this.all.filter((todo) => !todo.completed);
  }

  get remaining() {
    // This is an alias
    return this.active;
  }

  clearCompleted = () => {
    this.completed.forEach(this.delete);
  };

  add = (attrs: UnsavedTodo) => {
    const newId = uniqueId();
    if (!this.data) {
      throw new Error('Data not loaded yet');
    }
    this.data.set(newId, new TrackedObject({ ...attrs, id: newId }));
    this.persist();
  };

  delete = (todo: SavedTodo) => {
    if (!this.data) {
      throw new Error('Data not loaded yet');
    }
    this.data.delete(todo.id);
    this.persist();
  };

  persist = () => {
    if (!this.data) {
      throw new Error('Data not loaded yet');
    }
    save(this.data);
  };
}

function save(indexedData: IndexedData) {
  const data = [...indexedData.values()];

  window.localStorage.setItem('todos', JSON.stringify(data));
}
