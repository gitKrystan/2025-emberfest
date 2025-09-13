import { service } from '@ember/service';
import Component from '@glimmer/component';

import type { Future } from '@warp-drive/core/request';

import type { ReactiveTodosDocument } from '@workspace/shared-data/builders';

import { ClearCompletedTodos } from '#/components/todo-app/clear-completed-todos';
import { CreateTodo } from '#/components/todo-app/create-todo';
import { MaybeFooter } from '#/components/todo-app/footer';
import { Nav } from '#/components/todo-app/nav';
import { TodoAppState } from '#/components/todo-app/state';
import { TodoCount } from '#/components/todo-app/todo-count';
import { TodoList } from '#/components/todo-app/todo-list';
import { TodoProvider } from '#/components/todo-app/todo-provider';
import { ToggleAllTodos } from '#/components/todo-app/toggle-all-todos';
import type AppState from '#/services/app-state';

interface Signature {
  Args: {
    todoFuture: Future<ReactiveTodosDocument>;
  };
}

export class TodoApp extends Component<Signature> {
  <template>
    <TodoAppState>

      <:header>
        <CreateTodo />
      </:header>

      <:main>
        <TodoProvider @todoFuture={{@todoFuture}}>

          <:toggle as |todos|>
            <ToggleAllTodos @todos={{todos}} />
          </:toggle>

          <:list as |todos|>
            <TodoList @todos={{todos}} />
          </:list>

        </TodoProvider>
      </:main>

      <:footer>
        <MaybeFooter>

          <TodoCount />
          <Nav />
          <ClearCompletedTodos />

        </MaybeFooter>
      </:footer>

    </TodoAppState>
  </template>

  @service declare private readonly appState: AppState;
}
