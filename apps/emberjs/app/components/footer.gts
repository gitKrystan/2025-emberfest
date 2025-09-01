import type { TOC } from '@ember/component/template-only';
import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';

import { Request } from '@warp-drive/ember';

import { getAllTodos } from '@workspace/shared-data/builders';
import {
  getActiveTodos,
  getCompletedTodos,
} from '@workspace/shared-data/builders';
import type { SavedTodo } from '@workspace/shared-data/types';

import { HandleError } from '#components/error';
import Filters from '#components/filters';
import { Loading } from '#components/loading';

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
              <Completed @completed={{content.data}} />
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

class Completed extends Component<{
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

  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  @cached get clearCompletedRequest() {
    // FIXME: implement
    return null;
  }

  clearCompleted = () => {
    throw new Error('unimplemented');
  };
}

function itemLabel(count: number) {
  if (count === 0 || count > 1) {
    return 'items';
  }

  return 'item';
}
