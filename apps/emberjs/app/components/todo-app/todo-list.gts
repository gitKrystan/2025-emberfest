import { service } from '@ember/service';
import Component from '@glimmer/component';

import { checkout } from '@warp-drive/core/reactive';
import { Await } from '@warp-drive/ember';

import type { EditableTodo, Todo } from '@workspace/shared-data/types';

import { HandleError } from '#/components/design-system/error';
import { TodoItem } from '#/components/todo-app/todo-item';
import type AppState from '#/services/app-state';

interface Signature {
  Args: { todos: Todo[] };
  Blocks: { default: [mutableTodoCopy: EditableTodo] };
}

export class TodoList extends Component<Signature> {
  <template>
    <ul class="todo-list">
      {{#each @todos as |immutableTodo|}}
        <Await @promise={{this.checkout immutableTodo}}>

          {{! On success, check out a mutable copy of the todo }}
          <:success as |mutableTodoCopy|>
            <TodoItem
              @todo={{mutableTodoCopy}}
              @onEditStart={{this.appState.onEditStart}}
              @onEditEnd={{this.appState.onEditEnd}}
            />
          </:success>

          {{! On error, pass to HandleError }}
          <:error as |error|><HandleError @error={{error}} /></:error>

        </Await>
      {{/each}}
    </ul>
  </template>

  @service declare private readonly appState: AppState;

  checkout(todo: Todo): Promise<EditableTodo> {
    return checkout<EditableTodo>(todo);
  }
}
