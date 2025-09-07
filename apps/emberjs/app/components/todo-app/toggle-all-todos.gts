import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';

import { bulkPatchCacheTodos, bulkPatchTodos } from '@workspace/shared-data/builders';
import type { Todo } from '@workspace/shared-data/types';

import { reportError } from '#/helpers/error';
import type AppState from '#/services/app-state';
import type Store from '#/services/store';

export class ToggleAllTodos extends Component<{
  Args: {
    todos: Todo[];
  };
}> {
  <template>
    <input
      id="toggle-all"
      class="toggle-all"
      type="checkbox"
      checked={{this.areViewableCompleted}}
      {{on "change" this.toggleAll}}
    />
    <label for="toggle-all">Mark all as complete</label>
  </template>

  @service declare private readonly store: Store;
  @service declare private readonly appState: AppState;

  @cached
  private get areViewableCompleted(): boolean {
    const { todos } = this.args;
    return todos.filter((todo) => todo.completed).length === todos.length;
  }

  private readonly toggleAll = async () => {
    this.appState.onSaveStart();

    const attributes = { completed: !this.areViewableCompleted };

    try {
      await this.store.request(bulkPatchTodos(this.args.todos, attributes));

      bulkPatchCacheTodos(this.store, this.args.todos, attributes);
    } catch (e) {
      reportError(new Error('Could not toggle all todos', { cause: e }), { toast: true });
    }

    this.appState.onSaveEnd();
  };
}
