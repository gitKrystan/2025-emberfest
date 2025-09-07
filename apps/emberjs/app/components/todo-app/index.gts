import type { TOC } from '@ember/component/template-only';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import type { Future } from '@warp-drive/core/request';
import type { CollectionResourceDataDocument } from '@warp-drive/core/types/spec/document';
import { Request } from '@warp-drive/ember';

import { getAllTodos } from '@workspace/shared-data/builders';
import type { Todo } from '@workspace/shared-data/types';

import { HandleError } from '#/components/design-system/error';
import { LoadingSpinner } from '#/components/design-system/loading.gts';
import { ClearCompletedTodos } from '#/components/todo-app/clear-completed-todos';
import { CreateTodo } from '#/components/todo-app/create-todo';
import { Nav } from '#/components/todo-app/nav.gts';
import { TodoCount } from '#/components/todo-app/todo-count';
import { TodoItem } from '#/components/todo-app/todo-item';
import { ToggleAllTodos } from '#/components/todo-app/toggle-all-todos';
import type AppState from '#/services/app-state';

interface Signature {
  Args: {
    todoFuture: Future<CollectionResourceDataDocument<Todo>>;
  };
}

export class TodoApp extends Component<Signature> {
  <template>
    <section><CreateTodo /></section>
    <section class="main">
      <Request @request={{@todoFuture}} @autorefresh={{true}} @autorefreshBehavior="refresh">
        <:content as |content|>
          {{#if content.data.length}}
            {{#if this.appState.isSaving}}
              <LoadingSpinner />
            {{else if this.canToggle}}
              <ToggleAllTodos @todos={{content.data}} />
            {{/if}}

            <TodoList @todos={{content.data}} as |todo|>
              <TodoItem @todo={{todo}} @onEditStart={{this.onEditStart}} @onEditEnd={{this.onEditEnd}} />
            </TodoList>
          {{/if}}
        </:content>

        <:loading><LoadingSpinner /></:loading>

        <:error as |error|>
          <HandleError @error={{error}}>
            <h2 class="error-message">Something went wrong.</h2>
            <p class="error-cta">Please contact TodoMVC support.</p>
          </HandleError>
        </:error>
      </Request>
    </section>

    <Request @query={{(getAllTodos)}} @autorefresh={{true}} @autorefreshBehavior="refresh">
      <:content as |content|>
        <Footer @todos={{content.data}}>
          <TodoCount />
          <Nav />
          <ClearCompletedTodos />
        </Footer>
      </:content>
      <:error as |error|>
        <HandleError @error={{error}} @toast="Could not get all todos for Footer." />
      </:error>
    </Request>
  </template>

  @service declare private readonly appState: AppState;

  @tracked canToggle = true;

  readonly onEditStart = () => {
    this.canToggle = false;
  };

  readonly onEditEnd = () => {
    this.canToggle = true;
  };
}

const TodoList = <template>
  <ul class="todo-list">
    {{#each @todos as |todo|}}
      {{yield todo}}
    {{/each}}
  </ul>
</template> satisfies TOC<{
  Args: { todos: Todo[] };
  Blocks: { default: [todo: Todo] };
}>;

const Footer = <template>
  {{#if @todos.length}}
    <footer class="footer">
      {{yield}}
    </footer>
  {{/if}}
</template> satisfies TOC<{
  Args: { todos: Todo[] };
  Blocks: { default: [] };
}>;
