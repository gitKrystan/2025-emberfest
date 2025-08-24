import { uniqueId } from '@ember/helper';
import Service from '@ember/service';

import { TrackedMap, TrackedObject } from 'tracked-built-ins';

export type UnsavedTodo = {
  title: string;
  completed: boolean;
};

export type SavedTodo = {
  id: string;
  title: string;
  completed: boolean;
};

/** id to Todo */
type IndexedData = TrackedMap<string, SavedTodo>;

function load() {
  // localStorage has to be an array (required by the todomvc repo),
  // so let's convert to an object on id.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const list: SavedTodo[] = JSON.parse(
    window.localStorage.getItem('todos') || '[]'
  );

  return list.reduce((indexed: IndexedData, todo) => {
    indexed.set(todo.id, new TrackedObject(todo));

    return indexed;
  }, new TrackedMap<string, SavedTodo>());
}

function save(indexedData: IndexedData) {
  const data = [...indexedData.values()];

  window.localStorage.setItem('todos', JSON.stringify(data));
}

export default class Repo extends Service {
  data: IndexedData | null = null;

  load = () => {
    this.data = load();
  };

  get all() {
    if (!this.data) {
      this.load();
    }
    return [...this.data!.values()];
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
      this.load();
    }
    this.data!.set(newId, new TrackedObject({ ...attrs, id: newId }));
    this.persist();
  };

  delete = (todo: SavedTodo) => {
    if (!this.data) {
      this.load();
    }
    this.data!.delete(todo.id);
    this.persist();
  };

  persist = () => {
    if (!this.data) {
      this.load();
    }
    save(this.data!);
  };
}
