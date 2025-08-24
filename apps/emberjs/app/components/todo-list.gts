import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { service } from '@ember/service';

import Item from 'todomvc/components/todo-item';
import type { SavedTodo } from 'todomvc/services/repo';
import type Repo from 'todomvc/services/repo';

interface Signature {
  Args: {
    todos: SavedTodo[];
  };
}

export default class TodoList extends Component<Signature> {
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
            <Item
              @todo={{todo}}
              @onStartEdit={{this.disableToggle}}
              @onEndEdit={{this.enableToggle}}
            />
          {{/each}}
        </ul>
      {{/if}}
    </section>
  </template>

  @service declare repo: Repo;

  @tracked canToggle = true;

  get areViewableCompleted() {
    return (
      this.args.todos.filter((todo) => todo.completed).length ===
      this.args.todos.length
    );
  }

  toggleAll = () => {
    const allCompleted = this.areViewableCompleted;

    this.args.todos.forEach((todo) => (todo.completed = !allCompleted));
    this.repo.persist();
  };

  enableToggle = () => (this.canToggle = true);
  disableToggle = () => (this.canToggle = false);
}
