import { assert } from '@ember/debug';
import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { consume } from 'ember-provide-consume-context';

import { createTodo } from '@workspace/shared-data/builders';
import type { TodoAttributes } from '@workspace/shared-data/types';

import { reportError } from '#/helpers/error';
import type AppState from '#/services/app-state';
import type Store from '#/services/store';

const NameForTitle = 'title';
type NameForTitle = typeof NameForTitle;

/**
 * Renders a form to create a new todo.
 * On submit, it will create a new todo with the given title.
 * While the todo is being created, the app state is updated to reflect that
 * a save is in progress.
 */
export class CreateTodo extends Component {
  <template>
    <form {{on "submit" this.onSubmit}} class="new-todo-form">
      <input
        class="new-todo"
        aria-label="What needs to be done?"
        placeholder="What needs to be done?"
        type="text"
        name={{NameForTitle}}
        required
        pattern=".*\S.*"
        title="Todo cannot be empty"
        autofocus
      />
    </form>
  </template>

  @service declare private readonly store: Store;
  @service declare private readonly appState: AppState;

  private readonly onSubmit = async (event: SubmitEvent) => {
    this.appState.onSaveStart();

    event.preventDefault();

    const { attributes, form } = processSubmitEvent(event);

    try {
      await this.store.request(createTodo(attributes));

      form.reset();
    } catch (e) {
      reportError(new Error('Could not create todo', { cause: e }), { toast: true });
    }

    this.appState.onSaveEnd();
  };
}

function processSubmitEvent(event: SubmitEvent): {
  attributes: TodoAttributes;
  form: HTMLFormElement;
} {
  const form = event.target;
  assert('Expected event target to be an HTMLFormElement', form instanceof HTMLFormElement);

  const formData = new FormData(form);
  const rawTitle = formData.get(NameForTitle);
  assert('Expected title to be a string', typeof rawTitle === 'string');

  const title = rawTitle.trim();
  assert('Expected title to have a length', title.length > 0);
  return { attributes: { title, completed: false }, form };
}
