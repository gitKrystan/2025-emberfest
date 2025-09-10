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
      {{#each this.todos as |immutableTodo|}}
        <Await @promise={{this.checkout immutableTodo}}>

          {{! On success, we have a mutable copy of the todo }}
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

      {{#if this.remaining}}
        <li><label class="view"><div class="do-not-crash">
              +
              {{this.remaining}}
              todos we couldn't load without crashing
            </div></label></li>
      {{/if}}
    </ul>
  </template>

  @service declare private readonly appState: AppState;

  checkout(todo: Todo): Promise<EditableTodo> {
    return checkout<EditableTodo>(todo);
  }

  get todos(): Todo[] {
    return this.args.todos.slice(0, 99);
  }

  get remaining() {
    return Math.max(this.args.todos.length - 100, 0);
  }
}
