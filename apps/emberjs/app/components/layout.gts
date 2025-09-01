import { service } from '@ember/service';
import Component from '@glimmer/component';
import { Request } from '@warp-drive/ember';

import { getAllTodos } from '@workspace/shared-data/builders';
import type { SavedTodo } from '@workspace/shared-data/types';

import Create from '#components/create';
import { HandleError } from '#components/error.gts';
import Footer from '#components/footer';
import { Loading } from '#components/loading.gts';
import type Store from '#services/store';

interface Signature {
  Blocks: {
    default: [];
  };
}

export default class Layout extends Component<Signature> {
  @service declare private readonly store: Store;

  <template>
    <section class="todoapp">
      <header class="header">
        <h1>todos</h1>

        <Create />
      </header>

      {{yield}}

      <Request
        @query={{(getAllTodos)}}
        @autorefresh={{true}}
        @autorefreshBehavior="refresh"
      >
        <:loading><Loading />footer</:loading>
        <:content as |content|>
          {{#if (hasTodos content.data)}}
            <Footer />
          {{/if}}
        </:content>
        <:error as |error|><HandleError @error={{error}} /></:error>
      </Request>
    </section>
  </template>
}

function hasTodos(todos: SavedTodo[]) {
  return todos.length > 0;
}
