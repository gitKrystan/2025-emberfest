import type { TOC } from '@ember/component/template-only';
import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { cached, tracked } from '@glimmer/tracking';

import type { Future } from '@warp-drive/core/request';
import type { CollectionResourceDataDocument } from '@warp-drive/core/types/spec/document';
import { Request } from '@warp-drive/ember';

import {
  bulkPatchCacheTodos,
  bulkPatchTodos,
} from '@workspace/shared-data/builders';
import type { SavedTodo } from '@workspace/shared-data/types';

import { Create } from '#components/create';
import { HandleError } from '#components/error';
import { Loading } from '#components/loading';
import { TodoItem } from '#components/todo-item';
import type Store from '#services/store';
import { Footer } from '#components/footer';

interface Signature {
  Args: {
    todoFuture: Future<CollectionResourceDataDocument<SavedTodo>>;
  };
}

export class Main extends Component<Signature> {
  <template>
    <section><Create /></section>
    <section class="main">
      <Request
        @request={{@todoFuture}}
        @autorefresh={{true}}
        @autorefreshBehavior="refresh"
      >
        <:content as |content|>
          {{#if content.data.length}}
            {{#if this.canToggle}}
              <ToggleAll @todos={{content.data}} />
            {{/if}}
            <TodoList
              @todos={{content.data}}
              @onStartEdit={{this.disableToggle}}
              @onEndEdit={{this.enableToggle}}
            />
          {{/if}}
        </:content>
        <:loading><Loading /></:loading>
        <:error as |error|><HandleError @error={{error}} /></:error>
      </Request>
    </section>
    <Footer />
  </template>

  @tracked private canToggle = true;

  private readonly enableToggle = () => {
    this.canToggle = true;
  };

  private readonly disableToggle = () => {
    this.canToggle = false;
  };
}

class ToggleAll extends Component<{
  Args: { todos: SavedTodo[] };
}> {
  <template>
    <input
      id="toggle-all"
      class="toggle-all"
      type="checkbox"
      checked={{this.areViewableCompleted}}
      {{on "change" this.toggleAll}}
    />
    <label for="toggle-all">Mark all as complete</label>
  </template>

  @service declare private readonly store: Store;

  @cached
  private get areViewableCompleted(): boolean {
    const { todos } = this.args;
    return todos.filter((todo) => todo.completed).length === todos.length;
  }

  private readonly toggleAll = async () => {
    const attributes = { completed: !this.areViewableCompleted };

    await this.store.request(bulkPatchTodos(this.args.todos, attributes));

    bulkPatchCacheTodos(this.store, this.args.todos, attributes);
  };
}

const TodoList = <template>
  <ul class="todo-list">
    {{#each @todos as |todo|}}
      <TodoItem
        @todo={{todo}}
        @onStartEdit={{@onStartEdit}}
        @onEndEdit={{@onEndEdit}}
      />
    {{/each}}
  </ul>
</template> satisfies TOC<{
  Args: {
    todos: SavedTodo[];
    onEndEdit: () => void;
    onStartEdit: () => void;
  };
}>;
