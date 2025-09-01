import { on } from '@ember/modifier';
import { service } from '@ember/service';
import { isBlank } from '@ember/utils';
import Component from '@glimmer/component';

import { createTodo } from '@workspace/shared-data/builders';
import type { UnsavedTodo } from '@workspace/shared-data/types';

import type Store from '#services/store';

export default class Create extends Component {
  <template>
    <input
      class="new-todo"
      {{on "keydown" this.createTodo}}
      aria-label="What needs to be done?"
      placeholder="What needs to be done?"
      {{! template-lint-disable no-autofocus-attribute }}
      autofocus
    />
  </template>

  @service declare store: Store;

  // FIXME: we should use a <form> instead of this.
  //       this logic was copied from "the old way"
  //       which was Ember 3.2, and todomvc has historically
  //       been not great for a11y
  createTodo = async (event: KeyboardEvent) => {
    // eslint-disable-next-line @typescript-eslint/no-deprecated -- FIXME
    const { keyCode } = event;
    const target = event.target as HTMLInputElement;
    const value = target.value.trim();

    if (keyCode === 13 && !isBlank(value)) {
      const todo = this.store.createRecord<UnsavedTodo>('todo', {
        title: value,
        completed: false,
      });
      // FIXME: Handle Request-ness
      await this.store.request(createTodo(todo));
      target.value = '';
    }
  };
}
