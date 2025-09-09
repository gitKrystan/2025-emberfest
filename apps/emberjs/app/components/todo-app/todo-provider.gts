import { assert } from '@ember/debug';
import { service } from '@ember/service';
import Component from '@glimmer/component';

import type { ReactiveDataDocument } from '@warp-drive/core/reactive';
import type { Future } from '@warp-drive/core/request';

import type { ReactiveTodosDocument } from '@workspace/shared-data/builders';
import type { Todo } from '@workspace/shared-data/types';

import { LoadingSpinner } from '#/components/design-system/loading';
import { Paginate } from '#/components/fixme/paginate';
import type { PaginationState } from '#/components/fixme/paginate/-private/pagination-state';
import type { ContentFeatures } from '#/components/fixme/paginate/-private/pagination-subscription';
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
    <Paginate @request={{@todoFuture}} @autorefresh={{true}} @autorefreshBehavior="refresh" @pageHints={{pageHints}}>

      <:prev><LoadingSpinner /></:prev>

      <:content as |pages state|>
        {{#if pages.activePageData}}
          <ActivePage @pages={{pages}} @state={{state}} @activePageData={{pages.activePageData}}>
            <:toggle as |list|>{{yield list to="toggle"}}</:toggle>
            <:list as |list|>{{yield list to="list"}}</:list>
          </ActivePage>
        {{/if}}
      </:content>

      <:loading><LoadingSpinner /></:loading>

      <:next><LoadingSpinner /></:next>

      <:error as |error|>{{this.appState.onUnrecoverableError error}}</:error>

      <:always as |pages state|><PaginationControls @pages={{pages}} @state={{state}} /></:always>

    </Paginate>
  </template>

  @service declare private readonly appState: AppState;
}

class ActivePage extends Component<{
  Args: {
    pages: PaginationState<Todo>;
    state: ContentFeatures<ReactiveDataDocument<Todo[]>>;
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
    return !this.args.pages.pages.some((p) => p.isLoading) && this.appState.canToggle;
  }
}

function pageHints(doc: ReactiveTodosDocument): { currentPage: number; totalPages: number } {
  assert('cannot generate page hints without meta', doc.meta);
  const hint = { currentPage: 0, totalPages: 0 };

  assert('cannot generate page hints without meta.currentPage', doc.meta.currentPage);
  assert('cannot generate page hints; meta.currentPage is not a number', typeof doc.meta.currentPage === 'number');
  hint.currentPage = doc.meta.currentPage;

  assert('cannot generate page hints without meta.totalPages', doc.meta.totalPages);
  assert('cannot generate page hints; meta.totalPages is not a number', typeof doc.meta.totalPages === 'number');
  hint.totalPages = doc.meta.totalPages;

  return hint;
}
