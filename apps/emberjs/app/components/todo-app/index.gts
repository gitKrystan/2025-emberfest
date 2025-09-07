import Component from '@glimmer/component';
import { provide } from 'ember-provide-consume-context';

import type { Future } from '@warp-drive/core/request';
import { Request } from '@warp-drive/ember';

import type { ReactiveTodosDocument } from '@workspace/shared-data/builders';

import { LoadingSpinner } from '#/components/design-system/loading.gts';
import { AppError } from '#/components/todo-app/app-error';
import { CreateTodo } from '#/components/todo-app/create-todo';
import { Footer } from '#/components/todo-app/footer';
import { TodoList } from '#/components/todo-app/todo-list';
import { ToggleAllTodos } from '#/components/todo-app/toggle-all-todos';
import AppState from '#/util/app-state';

interface Signature {
  Args: {
    todoFuture: Future<ReactiveTodosDocument>;
  };
}

export class TodoApp extends Component<Signature> {
  <template>
    <section>
      {{#if this.appState.error}}
        <div class="new-todo">OH NO</div>
      {{else}}
        <CreateTodo />
      {{/if}}
    </section>
    <section class="main">
      {{#if this.appState.error}}
        <AppError />
      {{else}}
        <Request @request={{@todoFuture}} @autorefresh={{true}} @autorefreshBehavior="refresh">
          <:content as |content|>
            {{#if content.data.length}}
              {{#if this.appState.isSaving}}
                <LoadingSpinner />
              {{else if this.appState.canToggle}}
                <ToggleAllTodos @todos={{content.data}} />
              {{/if}}

              {{#unless this.appState.error}}
                <TodoList @todos={{content.data}} />
              {{/unless}}
            {{/if}}
          </:content>

          <:loading><LoadingSpinner /></:loading>
          <:error as |error|>{{this.appState.onUnrecoverableError error}}</:error>
        </Request>
      {{/if}}
    </section>

    {{#unless this.appState.error}}
      <Footer />
    {{/unless}}
  </template>

  @provide('app-state')
  private readonly appState = new AppState();
}
