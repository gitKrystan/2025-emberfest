import { assert } from '@ember/debug';
import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';

import { checkout, commit } from '@warp-drive/core/reactive';

import { deleteTodo, updateTodo } from '@workspace/shared-data/builders';
import type {
  EditableSavedTodo,
  SavedTodo,
} from '@workspace/shared-data/types';

import type Store from '#services/store';

interface Signature {
  Args: {
    onEndEdit: () => void;
    onStartEdit: () => void;
    todo: SavedTodo;
  };
}

export class TodoItem extends Component<Signature> {
  <template>
    <li
      class="{{if @todo.completed 'completed'}} {{if this.editing 'editing'}}"
    >
      <form {{this.registerForm}} {{on "submit" this.onSubmit}}>
        <div class="view">
          <input
            class="toggle"
            aria-label="Toggle the completion state of this todo"
            name="completed"
            type="checkbox"
            checked={{@todo.completed}}
            {{on "change" this.dispatchSubmit}}
          />

          <label class="view" {{on "dblclick" this.onTitleDblClick}}>
            {{@todo.title}}
          </label>

          <button
            class="destroy"
            aria-label="Delete this todo"
            name="destroy"
            type="button"
            {{on "click" this.dispatchSubmit}}
          />
        </div>
        <input
          class="edit"
          aria-label="Edit this todo"
          name="title"
          type="text"
          value={{@todo.title}}
          {{on "blur" this.dispatchSubmit}}
          {{on "keydown" this.onTitleKeydown}}
          autofocus
        />
      </form>
    </li>
  </template>

  @service declare private readonly store: Store;

  @tracked editing = false;

  _form: HTMLFormElement | null = null;
  get form() {
    assert('Cannot access form before registered', this._form);
    return this._form;
  }
  registerForm = modifier((element: HTMLFormElement) => {
    this._form = element;
  });

  startEditing = () => {
    this.args.onStartEdit();
    this.editing = true;
  };

  endEditing = () => {
    this.args.onEndEdit();
    this.editing = false;
  };

  onTitleDblClick = (event: MouseEvent) => {
    event.preventDefault();
    this.startEditing();
  };

  onTitleKeydown = (event: KeyboardEvent) => {
    assert(
      'Expected event target to be an HTMLInputElement',
      event.target instanceof HTMLInputElement
    );
    if (event.key === 'Escape') {
      event.target.value = this.args.todo.title;
      this.endEditing();
    }
  };

  dispatchSubmit = (event: Event) => {
    assert(
      'Cannot put autoSubmit on non-HTMLElement',
      event.target instanceof HTMLElement
    );
    const submitEvent = new SubmitEvent('submit', { submitter: event.target });
    this.form.dispatchEvent(submitEvent);
  };

  onSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    const { attributes, submitType } = processSubmitEvent(event);
    if (submitType === 'destroy' || attributes.title.length === 0) {
      await this.deleteTodo();
      return;
    }

    await this.updateTodo(attributes);
  };

  deleteTodo = async () => {
    await this.store.request(deleteTodo(this.args.todo));
    this.endEditing();
  };

  updateTodo = async (attributes: { title: string; completed: boolean }) => {
    const editableTodo = await checkout<EditableSavedTodo>(this.args.todo);

    editableTodo.title = attributes.title;
    editableTodo.completed = attributes.completed;

    const identifier = this.store.cacheKeyManager.getOrCreateRecordIdentifier({
      type: 'todo',
      id: editableTodo.id,
    });
    const changedAttrs = this.store.cache.changedAttrs(identifier);

    if (Object.keys(changedAttrs).length === 0) {
      this.endEditing();
      return;
    }

    await this.store.request(updateTodo(editableTodo));
    this.endEditing();
  };
}

function processSubmitEvent(event: SubmitEvent): {
  attributes: {
    title: string;
    completed: boolean;
  };
  submitType: 'completed' | 'destroy' | 'title' | null;
  form: HTMLFormElement;
} {
  const form = event.target;
  assert(
    'Expected event target to be an HTMLFormElement',
    form instanceof HTMLFormElement
  );

  const formData = new FormData(form);
  const rawTitle = formData.get('title');
  assert('Expected title to be a string', typeof rawTitle === 'string');
  const title = rawTitle.trim();

  const rawCompleted = formData.get('completed');
  assert('Expected completed to be a string', typeof rawCompleted === 'string');
  const completed = rawCompleted === 'on';

  const submitType = event.submitter
    ? 'name' in event.submitter
      ? (event.submitter?.name as 'completed' | 'destroy' | 'title' | null)
      : null
    : null;

  return { attributes: { title, completed }, submitType, form };
}
