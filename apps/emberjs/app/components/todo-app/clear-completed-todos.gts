import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';

import { Request } from '@warp-drive/ember';

import {
  bulkDeleteCompletedTodos,
  getCompletedTodosCount,
  invalidateAllTodoQueries,
} from '@workspace/shared-data/builders';

import { HandleError } from '#/components/design-system/error';
import { reportError } from '#/helpers/error';
import type AppState from '#/services/app-state';
import type Store from '#/services/store';

/**
 * Renders a button to clear completed todos if there are any.
 * On click, it will delete all completed todos.
 * If there are no completed todos, nothing is rendered.
 */
export const ClearCompletedTodos = <template>
  <Request @query={{(getCompletedTodosCount)}} @autorefresh={{true}} @autorefreshBehavior="refresh">
    <:content as |content|>
      <ClearCompleted @completed={{content.meta.count}} />
    </:content>
    <:error as |error|>
      <HandleError @error={{error}} @toast="Could not get completed todos for 'Clear Completed'." />
    </:error>
  </Request>
</template>;

class ClearCompleted extends Component<{
  Args: { completed: number };
}> {
  <template>
    {{#if @completed}}
      <button class="clear-completed" type="button" {{on "click" this.clearCompleted}}>
        Clear completed
      </button>
    {{/if}}
  </template>

  @service declare private readonly store: Store;
  @service declare private readonly appState: AppState;

  clearCompleted = async () => {
    try {
      await this.store.request(bulkDeleteCompletedTodos());
      invalidateAllTodoQueries(this.store);
    } catch (e) {
      reportError(new Error('Could not clear completed todos', { cause: e }), { toast: true });
    }
  };
}
