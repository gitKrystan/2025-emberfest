import type { TOC } from '@ember/component/template-only';
import { on } from '@ember/modifier';
import Component from '@glimmer/component';

import { Request } from '@warp-drive/ember';

import { bulkDeleteTodos, getAllTodos } from '@workspace/shared-data/builders';
import {
  getActiveTodos,
  getCompletedTodos,
} from '@workspace/shared-data/builders';
import type { SavedTodo } from '@workspace/shared-data/types';

import { HandleError } from '#components/error';
import Filters from '#components/filters';
import { Loading } from '#components/loading';
import Store from '#services/store';
import { service } from '@ember/service';

export const Footer = <template>
  <Request
    @query={{(getAllTodos)}}
    @autorefresh={{true}}
    @autorefreshBehavior="refresh"
  >
    <:content as |content|>
      {{#if (hasTodos content.data)}}
        <footer class="footer">
          <span class="todo-count">
            <Request
              @query={{(getActiveTodos)}}
              @autorefresh={{true}}
              @autorefreshBehavior="refresh"
            >
              <:content as |content|>
                <Remaining @remaining={{content.data}} />
              </:content>
              <:loading><Loading /></:loading>
              <:error as |error|><HandleError @error={{error}} /></:error>
            </Request>
          </span>

          <Filters />

          <Request
            @query={{(getCompletedTodos)}}
            @autorefresh={{true}}
            @autorefreshBehavior="refresh"
          >
            <:content as |content|>
              <ClearCompleted @completed={{content.data}} />
            </:content>
            <:loading><Loading /></:loading>
            <:error as |error|><HandleError @error={{error}} /></:error>
          </Request>
        </footer>
      {{/if}}
    </:content>
    <:loading><Loading /></:loading>
    <:error as |error|><HandleError @error={{error}} /></:error>
  </Request>
</template>;

function hasTodos(todos: SavedTodo[]) {
  return todos.length > 0;
}

const Remaining = <template>
  <strong>{{@remaining.length}}</strong>
  {{itemLabel @remaining.length}}
  left
</template> satisfies TOC<{
  Args: { remaining: SavedTodo[] };
}>;

class ClearCompleted extends Component<{
  Args: { completed: SavedTodo[] };
}> {
  <template>
    {{#if @completed.length}}
      <button
        class="clear-completed"
        type="button"
        {{on "click" this.clearCompleted}}
      >
        Clear completed
      </button>
    {{/if}}
  </template>

  @service declare private readonly store: Store;

  clearCompleted = async () => {
    await this.store.request(bulkDeleteTodos(this.args.completed));
  };
}

function itemLabel(count: number) {
  if (count === 0 || count > 1) {
    return 'items';
  }

  return 'item';
}
