import { on } from '@ember/modifier';
import { service } from '@ember/service';
import { isBlank } from '@ember/utils';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import type { SavedTodo } from '@workspace/shared-data/types';

import type Repo from '#services/repo';

interface Signature {
  Args: {
    onEndEdit: () => void;
    onStartEdit: () => void;
    todo: SavedTodo;
  };
}

export default class TodoItem extends Component<Signature> {
  <template>
    <li
      class="{{if @todo.completed 'completed'}} {{if this.editing 'editing'}}"
    >
      <div class="view">
        <input
          class="toggle"
          type="checkbox"
          aria-label="Toggle the completion state of this todo"
          checked={{@todo.completed}}
          {{on "change" this.toggleCompleted}}
        />
        <label {{on "dblclick" this.startEditing}}>{{@todo.title}}</label>
        <button
          class="destroy"
          {{on "click" this.removeTodo}}
          type="button"
          aria-label="Delete this todo"
        ></button>
      </div>
      <input
        class="edit"
        aria-label="Edit this todo"
        value={{@todo.title}}
        {{on "blur" this.doneEditing}}
        {{on "keydown" this.handleKeydown}}
        {{! template-lint-disable no-autofocus-attribute }}
        autofocus
      />
    </li>
  </template>

  @service declare repo: Repo;

  @tracked editing = false;

  removeTodo = () => {
    this.repo.delete(this.args.todo);
  };

  toggleCompleted = (event: Event) => {
    const target = event.target as HTMLInputElement;
    this.args.todo.completed = target.checked;
    this.repo.persist();
  };

  handleKeydown = (event: KeyboardEvent) => {
    const target = event.target as HTMLInputElement;
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    if (event.keyCode === 13) {
      target.blur();
      // eslint-disable-next-line @typescript-eslint/no-deprecated
    } else if (event.keyCode === 27) {
      this.editing = false;
    }
  };

  startEditing = (event: Event) => {
    this.args.onStartEdit();
    this.editing = true;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    (event.target as HTMLLabelElement)
      .closest('li')
      ?.querySelector('input.edit')
      // @ts-expect-error - TS doesn't know about the `focus` method on HTMLInputElement
      ?.focus();
  };

  doneEditing = (event: FocusEvent) => {
    if (!this.editing) {
      return;
    }

    const todoTitle = (event.target as HTMLInputElement).value.trim();

    if (isBlank(todoTitle)) {
      this.removeTodo();
    } else {
      this.args.todo.title = todoTitle;
      this.editing = false;
      this.args.onEndEdit();
    }
  };
}
