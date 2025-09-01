import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { checkout } from '@warp-drive/core/reactive';

import { updateTodo } from '@workspace/shared-data/builders';
import type { SavedTodo } from '@workspace/shared-data/types';

import { TodoItem } from '#components/todo-item';
import type Store from '#services/store';

interface Signature {
  Args: {
    todos: SavedTodo[];
  };
}

export class TodoList extends Component<Signature> {
  <template>
    <section class="main">
      {{#if @todos.length}}
        {{#if this.canToggle}}
          <input
            id="toggle-all"
            class="toggle-all"
            type="checkbox"
            checked={{this.areViewableCompleted}}
            {{on "change" this.toggleAll}}
          />
          <label for="toggle-all">Mark all as complete</label>
        {{/if}}
        <ul class="todo-list">
          {{#each @todos as |todo|}}
            <TodoItem
              @todo={{todo}}
              @onStartEdit={{this.disableToggle}}
              @onEndEdit={{this.enableToggle}}
            />
          {{/each}}
        </ul>
      {{/if}}
    </section>
  </template>

  @service declare private readonly store: Store;

  @tracked canToggle = true;

  get areViewableCompleted() {
    return (
      this.args.todos.filter((todo) => todo.completed).length ===
      this.args.todos.length
    );
  }

  toggleAll = async () => {
    const allCompleted = this.areViewableCompleted;

    // FIXME: Implement bulk update; handle async UX
    const futures = [];
    for (const todo of this.args.todos) {
      const editable = await checkout<SavedTodo>(todo);
      editable.completed = !allCompleted;
      futures.push(this.store.request(updateTodo(editable)));
    }
    await Promise.all(futures);
  };

  enableToggle = () => (this.canToggle = true);
  disableToggle = () => (this.canToggle = false);
}
