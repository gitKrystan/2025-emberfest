import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';

import type { Future } from '@warp-drive/core/request';

import type { ReactiveTodosDocument } from '@workspace/shared-data/builders';
import type { Todo } from '@workspace/shared-data/types';

import { LoadingSpinner } from '#/components/design-system/loading';
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

      <:content as |data|>
        {{!-- {{log "content" data}} --}}
        {{#if data.length}}
          {{#if this.appState.isSaving}}
            <LoadingSpinner />
          {{else if this.appState.canToggle}}
            {{yield data to="toggle"}}
          {{/if}}

          {{#unless this.appState.error}}
            {{yield data to="list"}}
          {{/unless}}
        {{/if}}
      </:content>

      <:loading><LoadingSpinner /></:loading>

      <:error as |error|>{{this.appState.onUnrecoverableError error}}</:error>

      <:always as |state features|>
        {{!-- {{log "state" state}}
        {{log "features" features}} --}}
        {{#if features.loadNext}}
          <button type="button" {{on "click" features.loadNext}}>Load more todos...</button>
        {{/if}}
      </:always>

    </Paginate>
  </template>

  @service declare private readonly appState: AppState;
}
