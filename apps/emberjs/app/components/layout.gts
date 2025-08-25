import { service } from '@ember/service';
import Component from '@glimmer/component';

import Create from '#components/create';
import Footer from '#components/footer';
import type Repo from '#services/repo';
import type { SavedTodo } from '#services/repo';

interface Signature {
  Blocks: {
    default: [];
  };
}

function hasTodos(todos: SavedTodo[]) {
  return todos.length > 0;
}

export default class Layout extends Component<Signature> {
  @service declare repo: Repo;

  <template>
    <section class="todoapp">
      <header class="header">
        <h1>todos</h1>

        <Create />
      </header>

      {{yield}}

      {{#if (hasTodos this.repo.all)}}
        <Footer />
      {{/if}}
    </section>
  </template>
}
