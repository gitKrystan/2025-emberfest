import { assert } from '@ember/debug';
import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';

import { recordIdentifierFor } from '@warp-drive/core';
import type {
  PersistedResourceKey,
  RequestKey,
} from '@warp-drive/core/types/identifier';
import type { RequestInfo } from '@warp-drive/core/types/request';

import {
  deleteTodo,
  getActiveTodos,
  getCompletedTodos,
  updateTodo,
} from '@workspace/shared-data/builders';
import type { SavedTodo } from '@workspace/shared-data/types';

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

  /** Whether we are in title-editing mode */
  @tracked private isEditingTitle = false;

  _form: HTMLFormElement | null = null;
  private get form(): HTMLFormElement {
    assert('Cannot access form before registered', this._form);
    return this._form;
  }
  registerForm = modifier((element: HTMLFormElement) => {
    this._form = element;
  });

  /** Start title-editing mode */
  private startEditing = (): void => {
    this.args.onStartEdit();
    this.isEditingTitle = true;
  };

  /** End title-editing mode */
  private endEditing = (): void => {
    this.args.onEndEdit();
    this.isEditingTitle = false;
  };

  /** Start editing on double-click */
  private onTitleDblClick = (event: MouseEvent): void => {
    event.preventDefault();
    this.startEditing();
  };

  /** Reset on Escape */
  private onTitleKeydown = (event: KeyboardEvent) => {
    assert(
      'Expected event target to be an HTMLInputElement',
      event.target instanceof HTMLInputElement
    );
    if (event.key === 'Escape') {
      event.target.value = this.args.todo.title;
      this.endEditing();
    }
  };

  /** Submit the form with the relevant Element set as the submitter. */
  private dispatchSubmit = (event: Event) => {
    assert(
      'Cannot put autoSubmit on non-HTMLElement',
      event.target instanceof HTMLElement
    );
    const submitEvent = new SubmitEvent('submit', { submitter: event.target });
    this.form.dispatchEvent(submitEvent);
  };

  private onSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    // FIXME: Ensure we disable upstream async during saves that occur when
    // `this.editing` is false, which happens due to requirements of TodoMVC CSS.
    // Will need custom CSS to resolve.
    if (!this.isEditingTitle) {
      this.args.onStartEdit();
    }

    const { attributes, submitType } = processSubmitEvent(event);
    if (submitType === 'destroy' || attributes.title.length === 0) {
      await this.deleteTodo();
      return;
    }

    await this.updateTodo(attributes);
  };

  private deleteTodo = async () => {
    await this.store.request(deleteTodo(this.args.todo));
    this.endEditing();
  };

  private updateTodo = async (attributes: {
    title: string;
    completed: boolean;
  }) => {
    await this.store.request(updateTodo(this.args.todo, attributes));

    const resourceKey = this.keyForResource(this.args.todo);
    const completedRequestKey = this.keyForRequest(getCompletedTodos());
    const activeRequestKey = this.keyForRequest(getActiveTodos());

    // We need this because while these queries are subscribed to notifications
    // for the records they return, they explicitly do not subscribe to changes
    // in the records they don't return. Thus, we need to manually patch the
    // request documents stored in the cache to ensure they update.
    if (attributes.completed) {
      this.store.cache.patch({
        record: completedRequestKey,
        op: 'add',
        value: resourceKey,
        field: 'data',
        index: 0,
      });
      this.store.cache.patch({
        record: activeRequestKey,
        op: 'remove',
        value: resourceKey,
        field: 'data',
      });
    } else {
      this.store.cache.patch({
        record: activeRequestKey,
        op: 'add',
        value: resourceKey,
        field: 'data',
        index: 0,
      });
      this.store.cache.patch({
        record: completedRequestKey,
        op: 'remove',
        value: resourceKey,
        field: 'data',
      });
    }

    this.endEditing();
  };

  private keyForResource = (
    resource: SavedTodo
  ): PersistedResourceKey<'todo'> => {
    const key = recordIdentifierFor(resource);
    assert('Expected key have id', key.id);
    return key as PersistedResourceKey<'todo'>;
  };

  private keyForRequest = (request: RequestInfo): RequestKey => {
    const key =
      this.store.cacheKeyManager.getOrCreateDocumentIdentifier(request);
    assert('Expected key to be defined', key);
    return key;
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
      ? (event.submitter.name as 'completed' | 'destroy' | 'title' | null)
      : null
    : null;

  return { attributes: { title, completed }, submitType, form };
}
