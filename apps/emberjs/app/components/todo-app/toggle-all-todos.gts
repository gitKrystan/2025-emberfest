import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';

import type { Store } from '@workspace/shared-data';
import {
  bulkPatchAllTodosToActive,
  bulkPatchAllTodosToCompleted,
  invalidateAllTodoQueries,
} from '@workspace/shared-data/builders';
import type { Todo } from '@workspace/shared-data/types';

import { reportError } from '#/helpers/error';
import type AppState from '#/services/app-state';

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

  // HACK: This probably isn't amazing UX. If this were a real company I would fix it.
  @cached
  private get areViewableCompleted(): boolean {
    const { todos } = this.args;
    return todos.filter((todo) => todo.completed).length === todos.length;
  }

  private readonly toggleAll = async () => {
    this.appState.onSaveStart();
    const shouldCompleteAllActive = !this.areViewableCompleted;

    try {
      if (shouldCompleteAllActive) {
        await this.store.request(bulkPatchAllTodosToCompleted());
      } else {
        await this.store.request(bulkPatchAllTodosToActive());
      }

      invalidateAllTodoQueries(this.store);
    } catch (e) {
      reportError(new Error('Could not toggle all todos', { cause: e }), { toast: true });
    }

    this.appState.onSaveEnd();
  };
}
