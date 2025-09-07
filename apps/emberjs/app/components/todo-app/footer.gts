import { Request } from '@warp-drive/ember';

import { getAllTodos } from '@workspace/shared-data/builders';

import { HandleError } from '#/components/design-system/error';
import { ClearCompletedTodos } from '#/components/todo-app/clear-completed-todos';
import { Nav } from '#/components/todo-app/nav.gts';
import { TodoCount } from '#/components/todo-app/todo-count';

/** Ensures all Todos are loaded before displaying the footer elements. */
export const Footer = <template>
  <Request @query={{(getAllTodos)}} @autorefresh={{true}} @autorefreshBehavior="refresh">

    {{! On success, render the footer content }}
    <:content as |content|>
      {{#if content.data.length}}
        <footer class="footer">
          <TodoCount />
          <Nav />
          <ClearCompletedTodos />
        </footer>
      {{/if}}
    </:content>

    {{! On error, display a toast via HandleError. }}
    <:error as |error|>
      <HandleError @error={{error}} @toast="Could not get all todos for Footer." />
    </:error>

  </Request>
</template>;
