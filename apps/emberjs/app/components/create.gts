import { assert } from '@ember/debug';
import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { cached, tracked } from '@glimmer/tracking';

import { getRequestState, Request } from '@warp-drive/ember';

import { createTodo } from '@workspace/shared-data/builders';
import type { TodoAttributes } from '@workspace/shared-data/types';

import { HandleError } from '#components/error';
import { Loading } from '#components/loading';
import type Store from '#services/store';

const NameForTitle = 'title';
type NameForTitle = typeof NameForTitle;

export class Create extends Component {
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
    <Request @request={{this.createTodoRequest}}>
      <:idle></:idle>
      <:loading><Loading /></:loading>
      <:error as |error|><HandleError @error={{error}} /></:error>
    </Request>
  </template>

  @service declare private readonly store: Store;

  @tracked attributes: TodoAttributes | null = null;

  @cached
  get createTodoRequest() {
    if (!this.attributes) {
      return null;
    }
    return this.store.request(createTodo(this.attributes));
  }

  @cached
  get isSaving() {
    if (!this.createTodoRequest) {
      return false;
    }
    const state = getRequestState(this.createTodoRequest);
    return state.isPending;
  }

  onSubmit = (event: SubmitEvent) => {
    event.preventDefault();

    const { attributes, form } = processSubmitEvent(event);

    this.attributes = attributes;

    form.reset();
  };
}

function processSubmitEvent(event: SubmitEvent): {
  attributes: TodoAttributes;
  form: HTMLFormElement;
} {
  const form = event.target;
  assert(
    'Expected event target to be an HTMLFormElement',
    form instanceof HTMLFormElement
  );

  const formData = new FormData(form);
  const rawTitle = formData.get(NameForTitle);
  assert('Expected title to be a string', typeof rawTitle === 'string');

  const title = rawTitle.trim();
  assert('Expected title to have a length', title.length > 0);
  return { attributes: { title, completed: false }, form };
}
