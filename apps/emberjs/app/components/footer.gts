import type { TOC } from '@ember/component/template-only';
import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';
import { Request } from '@warp-drive/ember';

import {
  getActiveTodos,
  getCompletedTodos,
} from '@workspace/shared-data/builders';
import type { SavedTodo } from '@workspace/shared-data/types';

import { HandleError } from '#components/error.gts';
import Filters from '#components/filters';
import { Loading } from '#components/loading.gts';
import type Store from '#services/store';

export default class Footer extends Component {
  @service declare store: Store;

  <template>
    <footer class="footer">
      <span class="todo-count">
        <Request @query={{(getActiveTodos)}} @autorefresh={{true}}>
          <:content as |content|>
            <Remaining @remaining={{content.data}} />
          </:content>
          <:loading><Loading /></:loading>
          <:error as |error|><HandleError @error={{error}} /></:error>
        </Request>
      </span>

      <Filters />

      <Request @query={{(getCompletedTodos)}} @autorefresh={{true}}>
        <:content as |content|>
          <Completed @completed={{content.data}} />
        </:content>
        <:error as |error|><HandleError @error={{error}} /></:error>
      </Request>
    </footer>
  </template>
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
