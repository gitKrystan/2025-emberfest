import { assert } from '@ember/debug';
import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { cached, tracked } from '@glimmer/tracking';

import { getRequestState, Request } from '@warp-drive/ember';

import { createTodo } from '@workspace/shared-data/builders';
import type { UnsavedTodo } from '@workspace/shared-data/types';

import { HandleError } from '#components/error';
import { Loading } from '#components/loading';
import type Store from '#services/store';

export class Create extends Component {
  <template>
    <form {{on "submit" this.createTodo}} class="new-todo-form">
      <input
        class="new-todo"
        aria-label="What needs to be done?"
        placeholder="What needs to be done?"
        type="text"
        name="title"
        required
        pattern=".*\S.*"
        title="Todo cannot be empty"
        {{! This is a legitimate case for autofocus }}
        {{! template-lint-disable no-autofocus-attribute }}
        autofocus
      />
    </form>
    <Request @request={{this.createTodoRequest}}>
      <:idle></:idle>
      <:loading><Loading /></:loading>
      <:error as |error|><HandleError @error={{error}} /></:error>
    </Request>
  </template>

  @service declare store: Store;

  @tracked newestTodo: UnsavedTodo | null = null;

  @cached
  get createTodoRequest() {
    if (!this.newestTodo) {
      return null;
    }
    return this.store.request(createTodo(this.newestTodo));
  }

  @cached
  get isSaving() {
    if (!this.createTodoRequest) {
      return false;
    }
    const state = getRequestState(this.createTodoRequest);
    return state.isPending;
  }

  createTodo = (event: SubmitEvent) => {
    event.preventDefault();

    const form = event.target;
    assert(
      'Expected event target to be an HTMLFormElement',
      form instanceof HTMLFormElement
    );

    const formData = new FormData(form);
    const rawTitle = formData.get('title');
    assert('Expected title to be a string', typeof rawTitle === 'string');

    const title = rawTitle.trim();
    assert('Expected title to have a length', title.length > 0);

    this.newestTodo = this.store.createRecord<UnsavedTodo>('todo', {
      title,
      completed: false,
    });
    form.reset();
  };
}
