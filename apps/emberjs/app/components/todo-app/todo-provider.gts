import { service } from '@ember/service';
import Component from '@glimmer/component';
import { consume } from 'ember-provide-consume-context';

import type { Future } from '@warp-drive/core/request';
import { Request } from '@warp-drive/ember';

import type { ReactiveTodosDocument } from '@workspace/shared-data/builders';
import type { Todo } from '@workspace/shared-data/types';

import { LoadingSpinner } from '#/components/design-system/loading';
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
    <Request @request={{@todoFuture}} @autorefresh={{true}} @autorefreshBehavior="refresh">

      <:content as |content|>
        {{#if content.data.length}}
          {{#if this.appState.isSaving}}
            <LoadingSpinner />
          {{else if this.appState.canToggle}}
            {{yield content.data to="toggle"}}
          {{/if}}

          {{#unless this.appState.error}}
            {{yield content.data to="list"}}
          {{/unless}}
        {{/if}}
      </:content>

      <:loading><LoadingSpinner /></:loading>

      <:error as |error|>{{this.appState.onUnrecoverableError error}}</:error>

    </Request>
  </template>

  @service declare private readonly appState: AppState;
}
