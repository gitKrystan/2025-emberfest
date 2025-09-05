import { assert } from '@ember/debug';
import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import {
  deleteTodo,
  patchCacheTodoActivated,
  patchCacheTodoCompleted,
  patchCacheTodoDeleted,
  patchTodo,
} from '@workspace/shared-data/builders';
import type { SavedTodo, TodoAttributes } from '@workspace/shared-data/types';

import { Form } from '#components/form';
import { autofocus } from '#modifiers/autofocus';
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
      class="{{if @todo.completed 'completed'}}
        {{if this.isEditingTitle 'editing'}}"
    >
      {{#if this.isEditingTitle}}
        <TitleForm
          class="edit"
          @todo={{@todo}}
          @onSaveStart={{this.onSaveStart}}
          @onSaveEnd={{this.onSaveEnd}}
          @isSaving={{this.isSaving}}
          {{on "keyup" this.onTitleKeyup}}
          {{autofocus}}
        />
      {{else}}
        <div class="view">
          <CompletedForm
            class="toggle"
            @todo={{@todo}}
            @onSaveStart={{this.onSaveStart}}
            @onSaveEnd={{this.onSaveEnd}}
            @isSaving={{this.isSaving}}
            {{on "keyup" this.onToggleKeyup}}
          >
            {{! This must live within the "completed" form for compat with TodoMVC CSS }}
            <label class="view" {{on "dblclick" this.onTitleDblClick}}>
              {{@todo.title}}
            </label>
          </CompletedForm>

          {{! This must live in the view div for compat with TodoMVC CSS }}
          <DestroyForm
            class="destroy"
            @todo={{@todo}}
            @onSaveStart={{this.onSaveStart}}
            @onSaveEnd={{this.onSaveEnd}}
            @isSaving={{this.isSaving}}
          />
        </div>
      {{/if}}
    </li>
  </template>

  /** Whether we are in title-editing mode */
  @tracked private isEditingTitle = false;
  @tracked private isSaving = false;

  /** Start title-editing mode */
  private readonly startEditing = (): void => {
    this.args.onStartEdit();
    this.isEditingTitle = true;
  };

  /** End title-editing mode */
  private readonly endEditing = (): void => {
    this.args.onEndEdit();
    this.isEditingTitle = false;
  };

  /** Start title-editing mode */
  private readonly onSaveStart = (): void => {
    // FIXME: Ensure we disable upstream async during saves that occur when
    // `this.editing` is false, which happens due to requirements of TodoMVC CSS.
    // Will need custom CSS to resolve.
    if (!this.isEditingTitle) {
      this.args.onStartEdit();
    }
    this.isSaving = true;
  };

  /** End title-editing mode */
  private readonly onSaveEnd = (): void => {
    this.isSaving = false;
    this.endEditing();
  };

  /** Start editing on double-click */
  private readonly onTitleDblClick = (event: MouseEvent): void => {
    event.preventDefault();
    this.startEditing();
  };

  /** Reset on Escape */
  private readonly onTitleKeyup = (event: KeyboardEvent) => {
    assert(
      'Expected event target to be an HTMLInputElement',
      event.target instanceof HTMLInputElement
    );
    if (event.key === 'Escape') {
      event.target.value = this.args.todo.title;
      this.endEditing();
    }
  };

  /** Start Editing on Enter */
  private readonly onToggleKeyup = (event: KeyboardEvent) => {
    assert(
      'Expected event target to be an HTMLInputElement',
      event.target instanceof HTMLInputElement
    );
    if (event.key === 'Enter') {
      this.startEditing();
    }
  };
}

class CompletedForm extends Component<{
  Element: HTMLInputElement;
  Args: {
    todo: SavedTodo;
    onSaveStart: () => void;
    onSaveEnd: () => void;
    isSaving: boolean;
  };
  Blocks: { default: [] };
}> {
  <template>
    <Form {{on "submit" this.onSubmit}} as |form|>
      <input
        ...attributes
        aria-label="Toggle the completion state of this todo"
        name="completed"
        type="checkbox"
        checked={{@todo.completed}}
        {{on "change" form.dispatchSubmit}}
      />

      {{yield}}
    </Form>
  </template>

  @service declare private readonly store: Store;

  private readonly onSubmit = (event: SubmitEvent) => {
    event.preventDefault();

    if (this.args.isSaving) {
      return;
    }

    const { attributes, submitType } = processSubmitEvent(event);
    assert('Expected submit type to be completed', submitType === 'completed');
    assert(
      'Expected attributes to have completed',
      typeof attributes.completed === 'boolean'
    );

    return this.updateCompleted(attributes.completed);
  };

  private readonly updateCompleted = async (completed: boolean) => {
    this.args.onSaveStart();

    await this.store.request(patchTodo(this.args.todo, { completed }));

    if (completed) {
      patchCacheTodoCompleted(this.store, this.args.todo);
    } else {
      patchCacheTodoActivated(this.store, this.args.todo);
    }

    this.args.onSaveEnd();
  };
}

class DestroyForm extends Component<{
  Element: HTMLButtonElement;
  Args: {
    todo: SavedTodo;
    onSaveStart: () => void;
    onSaveEnd: () => void;
    isSaving: boolean;
  };
}> {
  <template>
    <Form {{on "submit" this.onSubmit}} as |form|>
      <button
        ...attributes
        aria-label="Delete this todo"
        name="destroy"
        type="button"
        {{on "click" form.dispatchSubmit}}
      />
    </Form>
  </template>

  @service declare private readonly store: Store;

  private readonly onSubmit = (event: SubmitEvent) => {
    event.preventDefault();

    if (this.args.isSaving) {
      return;
    }

    const { submitType } = processSubmitEvent(event);
    assert('Expected submit type to be destroy', submitType !== 'destroy');

    return this.deleteTodo();
  };

  private readonly deleteTodo = async () => {
    this.args.onSaveStart();

    await this.store.request(deleteTodo(this.args.todo));

    patchCacheTodoDeleted(this.store, this.args.todo);

    this.args.onSaveEnd();
  };
}

class TitleForm extends Component<{
  Args: {
    todo: SavedTodo;
    onSaveStart: () => void;
    onSaveEnd: () => void;
    isSaving: boolean;
  };
}> {
  <template>
    <Form {{on "submit" this.onSubmit}} as |form|>
      <input
        aria-label="Edit this todo"
        name="title"
        type="text"
        value={{@todo.title}}
        ...attributes
        {{on "blur" form.dispatchSubmit}}
      />
    </Form>
  </template>

  @service declare private readonly store: Store;

  private readonly onSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    if (this.args.isSaving) {
      return;
    }

    const { attributes } = processSubmitEvent(event);
    assert(
      'Expected attributes to have title',
      typeof attributes.title === 'string'
    );

    if (attributes.title.length === 0) {
      return this.deleteTodo();
    } else if (attributes.title !== this.args.todo.title) {
      return this.patchTodoTitle(attributes.title);
    }
  };

  private readonly deleteTodo = async () => {
    this.args.onSaveStart();

    await this.store.request(deleteTodo(this.args.todo));

    patchCacheTodoDeleted(this.store, this.args.todo);

    this.args.onSaveEnd();
  };

  private readonly patchTodoTitle = async (title: string) => {
    this.args.onSaveStart();

    await this.store.request(patchTodo(this.args.todo, { title }));

    this.args.onSaveEnd();
  };
}

/** Hacks to avoid building a form library */
function processSubmitEvent(event: SubmitEvent): {
  attributes: Partial<TodoAttributes>;
  submitType: 'completed' | 'destroy' | 'submit';
  form: HTMLFormElement;
} {
  const form = event.target;
  assert(
    'Expected event target to be an HTMLFormElement',
    form instanceof HTMLFormElement
  );
  const formData = new FormData(form);

  if (event.submitter) {
    if (isDestroyButton(event.submitter)) {
      return { attributes: {}, submitType: 'destroy', form };
    }

    if (isCompleteButton(event.submitter)) {
      const completed = event.submitter.checked;
      return { attributes: { completed }, submitType: 'completed', form };
    }
  }

  const attributes: Partial<TodoAttributes> = {};

  const rawTitle = formData.get('title');
  if (rawTitle !== null) {
    assert('Expected title to be a string', typeof rawTitle === 'string');
    attributes.title = rawTitle.trim();
  }

  return { attributes, submitType: 'submit', form };
}

function isDestroyButton(element: HTMLElement): element is HTMLButtonElement {
  return element instanceof HTMLButtonElement && element.name === 'destroy';
}

function isCompleteButton(element: HTMLElement): element is HTMLInputElement {
  return (
    element instanceof HTMLInputElement &&
    element.type === 'checkbox' &&
    element.name === 'completed'
  );
}
