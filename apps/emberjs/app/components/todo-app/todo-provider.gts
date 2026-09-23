import { service } from '@ember/service';
import Component from '@glimmer/component';

import type { Future } from '@warp-drive/core/request';
import type { PagedPaginationContentFeatures, PagedPaginationState } from '@warp-drive/ember/experiments';
import { Paginate } from '@warp-drive/ember/experiments';

import type { ReactiveTodosDocument } from '@workspace/shared-data/builders';
import type { Todo } from '@workspace/shared-data/types';

import { LoadingSpinner } from '#/components/design-system/loading';
import { PaginationControls } from '#/components/todo-app/pagination-controls';
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

      <:loading><LoadingSpinner /></:loading>

      <:content as |pages state|>
        {{#if pages.activePage.data}}
          <ActivePage @pages={{pages}} @state={{state}} @activePageData={{pages.activePage.data}}>
            <:toggle as |list|>{{yield list to="toggle"}}</:toggle>
            <:list as |list|>{{yield list to="list"}}</:list>
          </ActivePage>
        {{/if}}

        <PaginationControls @pages={{pages}} @state={{state}} />
      </:content>

      <:error as |error|>{{this.appState.onUnrecoverableError error}}</:error>

    </Paginate>
  </template>

  @service declare private readonly appState: AppState;
}

class ActivePage extends Component<{
  Args: {
    pages: PagedPaginationState<ReactiveTodosDocument>;
    state: PagedPaginationContentFeatures<ReactiveTodosDocument>;
    activePageData: Todo[];
  };
  Blocks: {
    toggle: [todos: Todo[]];
    list: [todos: Todo[]];
  };
}> {
  <template>
    {{#if this.showInternalLoading}}
      <LoadingSpinner />
    {{else if this.showToggle}}
      {{yield @activePageData to="toggle"}}
    {{/if}}

    {{#unless this.showInternalError}}
      {{yield @activePageData to="list"}}
    {{/unless}}
  </template>

  @service declare private readonly appState: AppState;

  get showInternalLoading() {
    return this.appState.isSaving;
  }

  get showInternalError() {
    return this.appState.error;
  }

  get showToggle() {
    return !this.args.pages.activePage?.isLoading && this.appState.canToggle;
  }
}
