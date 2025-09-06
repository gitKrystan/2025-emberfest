import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';

import { Request } from '@warp-drive/ember';

import { bulkDeleteTodos } from '@workspace/shared-data/builders';
import { getCompletedTodos } from '@workspace/shared-data/builders';
import type { Todo } from '@workspace/shared-data/types';

import { HandleError } from '#/components/design-system/error';
import type Store from '#/services/store';

export const ClearCompletedTodos = <template>
  <Request @query={{(getCompletedTodos)}} @autorefresh={{true}} @autorefreshBehavior="refresh">
    <:content as |content|>
      <ClearCompleted @completed={{content.data}} />
    </:content>
    <:error as |error|><HandleError @error={{error}} @display={{false}} /></:error>
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

  clearCompleted = async () => {
    await this.store.request(bulkDeleteTodos(this.args.completed));
  };
}
