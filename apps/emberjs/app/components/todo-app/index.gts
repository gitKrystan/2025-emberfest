import type { TOC } from '@ember/component/template-only';

import type { Future } from '@warp-drive/core/request';

import type { ReactiveTodosDocument } from '@workspace/shared-data/builders';

import { CreateTodo } from '#/components/todo-app/create-todo';
import { TodoAppState } from '#/components/todo-app/state.gts';
import { TodoList } from '#/components/todo-app/todo-list';
import { TodoProvider } from '#/components/todo-app/todo-provider';
import { ToggleAllTodos } from '#/components/todo-app/toggle-all-todos';

interface Signature {
  Args: {
    todoFuture: Future<ReactiveTodosDocument>;
  };
}

export const TodoApp = <template>
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

  </TodoAppState>
</template> satisfies TOC<Signature>;
