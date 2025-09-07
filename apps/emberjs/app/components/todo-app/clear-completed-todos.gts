import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { consume } from 'ember-provide-consume-context';

import { Request } from '@warp-drive/ember';

import { bulkDeleteTodos } from '@workspace/shared-data/builders';
import { getCompletedTodos } from '@workspace/shared-data/builders';
import type { Todo } from '@workspace/shared-data/types';

import { HandleError } from '#/components/design-system/error';
import { reportError } from '#/helpers/error';
import type Store from '#/services/store';
import type AppState from '#/util/app-state';

export const ClearCompletedTodos = <template>
  <Request @query={{(getCompletedTodos)}} @autorefresh={{true}} @autorefreshBehavior="refresh">
    <:content as |content|>
      <ClearCompleted @completed={{content.data}} />
    </:content>
    <:error as |error|>
      <HandleError @error={{error}} @toast="Could not get completed todos for 'Clear Completed'." />
    </:error>
  </Request>
</template>;

class ClearCompleted extends Component<{
  Args: { completed: Todo[] };
}> {
  <template>
    {{#if @completed.length}}
      <button class="clear-completed" type="button" {{on "click" this.clearCompleted}}>
        Clear completed
      </button>
    {{/if}}
  </template>

  @service declare private readonly store: Store;

  @consume('app-state')
  declare private readonly appState: AppState;

  clearCompleted = async () => {
    try {
      await this.store.request(bulkDeleteTodos(this.args.completed));
    } catch (e) {
      reportError(new Error('Could not clear completed todos', { cause: e }), { toast: true });
    }
  };
}
