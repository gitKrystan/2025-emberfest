import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';

import type { Future } from '@warp-drive/core/request';

import type { ReactiveTodosDocument } from '@workspace/shared-data/builders';
import type { Todo } from '@workspace/shared-data/types';

import { LoadingDots, LoadingSpinner } from '#/components/design-system/loading';
import { Paginate } from '#/components/fixme/paginate';
import type AppState from '#/services/app-state';

interface Signature {
  Args: {
    todoFuture: Future<ReactiveTodosDocument>;
  };
  Blocks: {
    toggle: [todos: Todo[]];
    list: [todos: Todo[]];
  };
}

export class TodoProvider extends Component<Signature> {
  <template>
    <Paginate @request={{@todoFuture}} @autorefresh={{true}} @autorefreshBehavior="refresh">

      <:prev><LoadingDots /></:prev>

      <:content as |pages|>
        {{#if pages.data.length}}
          {{#if this.appState.isSaving}}
            <LoadingSpinner />
          {{else if this.appState.canToggle}}
            {{yield pages.data to="toggle"}}
          {{/if}}

          {{#unless this.appState.error}}
            {{yield pages.data to="list"}}
          {{/unless}}
        {{/if}}
      </:content>

      <:loading><LoadingSpinner /></:loading>

      <:next><LoadingDots /></:next>

      <:error as |error|>{{this.appState.onUnrecoverableError error}}</:error>

      <:always as |_state features|>
        {{#if (or features.loadPrev features.loadNext)}}
          <div class="pagination-controls">
            {{#if features.loadPrev}}
              <button type="button" class="pagination-button prev" {{on "click" features.loadPrev}}>
                ←
                <span class="pagination-button-text">Load previous</span>
              </button>
            {{else}}
              <div></div>
            {{/if}}
            {{#if features.loadNext}}
              <button type="button" class="pagination-button next" {{on "click" features.loadNext}}>
                <span class="pagination-button-text">Load next</span>
                →
              </button>
            {{else}}
              <div></div>
            {{/if}}
          </div>
        {{/if}}
      </:always>

    </Paginate>
  </template>

  @service declare private readonly appState: AppState;
}

function or(a: unknown, b: unknown): boolean {
  return Boolean(a || b);
}
