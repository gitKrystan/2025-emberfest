import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';
import { Request } from '@warp-drive/ember';

import {
  getActiveTodos,
  getCompletedTodos,
} from '@workspace/shared-data/builders';

import { HandleError } from '#components/error.gts';
import Filters from '#components/filters';
import { Loading } from '#components/loading.gts';
import type Store from '#services/store';

export default class Footer extends Component {
  @service declare store: Store;

  <template>
    <footer class="footer">
      <span class="todo-count">
        <Request @request={{this.activeTodosRequest}}>
          <:content as |content|>
            {{#let content.data as |remaining|}}
              <strong>{{remaining.length}}</strong>
              {{itemLabel remaining.length}}
              left
            {{/let}}
          </:content>
          <:loading><Loading />loading active request count</:loading>
          <:error as |error|><HandleError @error={{error}} /></:error>
        </Request>
      </span>

      <Filters />

      <Request @request={{this.completedTodosRequest}}>
        <:content as |content|>
          {{#let content.data as |completed|}}
            {{#if completed.length}}
              <button
                class="clear-completed"
                type="button"
                {{on "click" this.clearCompleted}}
              >
                Clear completed
              </button>
            {{/if}}
          {{/let}}
        </:content>
        <:error as |error|><HandleError @error={{error}} /></:error>
      </Request>
    </footer>
  </template>

  @cached get activeTodosRequest() {
    return this.store.request(getActiveTodos());
  }

  @cached get completedTodosRequest() {
    return this.store.request(getCompletedTodos());
  }

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
