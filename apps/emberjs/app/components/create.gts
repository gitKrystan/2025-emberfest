import { assert } from '@ember/debug';
import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { Request } from '@warp-drive/ember';

import { createTodo } from '@workspace/shared-data/builders';
import type { UnsavedTodo } from '@workspace/shared-data/types';

import { Loading } from '#components/loading';
import type Store from '#services/store';

export default class Create extends Component {
  <template>
    <form {{on "submit" this.createTodo}}>
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
  </template>

  @service declare store: Store;

  createTodo = async (event: SubmitEvent) => {
    event.preventDefault();
    assert(
      'Expected event target to be an HTMLFormElement',
      event.target instanceof HTMLFormElement
    );

    const formData = new FormData(event.target);
    const rawTitle = formData.get('title');
    assert('Expected title to be a string', typeof rawTitle === 'string');

    const title = rawTitle.trim();
    assert('Expected title to have a length', title.length > 0);

    const todo = this.store.createRecord<UnsavedTodo>('todo', {
      title,
      completed: false,
    });
    // FIXME: Handle Request-ness
    await this.store.request(createTodo(todo));
  };
}
