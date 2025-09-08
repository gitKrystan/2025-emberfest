import { assert } from '@ember/debug';
import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';

import type { Future } from '@warp-drive/core/request';

import type { ReactiveTodosDocument } from '@workspace/shared-data/builders';
import type { Todo } from '@workspace/shared-data/types';

import { LoadingDots, LoadingSpinner } from '#/components/design-system/loading';
import { EachLink, Paginate } from '#/components/fixme/paginate';
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

      <:always as |pages state|>
        {{#if (or state.loadPrev state.loadNext)}}
          <div class="pagination-controls">
            {{#if state.loadPrev}}
              <button type="button" class="pagination-button prev" {{on "click" state.loadPrev}}>
                ←
                <span class="pagination-button-text">Load previous</span>
              </button>
            {{else}}
              <div></div>
            {{/if}}

            <EachLink @pages={{pages}}>
              <:placeholder as |link|>{{link.text}}</:placeholder>
              <:link as |link|>
                <button type="button" {{on "click" link.setActive}}>{{link.index}}</button>
              </:link>
            </EachLink>

            {{#if state.loadNext}}
              <button type="button" class="pagination-button next" {{on "click" state.loadNext}}>
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
