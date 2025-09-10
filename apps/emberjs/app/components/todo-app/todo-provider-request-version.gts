import type { TOC } from '@ember/component/template-only';

import { Request } from '@warp-drive/ember';

import { getAllTodos } from '@workspace/shared-data/builders';
import type { Todo } from '@workspace/shared-data/types';

import { LoadingSpinner } from '#/components/design-system/loading';
import { HandleError } from '#/components/design-system/error';

export const TodoProvider = <template>
  <Request @query={{(getAllTodos)}} @autorefresh={{true}} @autorefreshBehavior="refresh">

    {{! On success, display the todos }}
    <:content as |content|><Todos @todos={{content.data}} /></:content>

    {{! While loading, display a spinner }}
    <:loading><LoadingSpinner /></:loading>

    {{! On error, send the customer to support }}
    <:error as |error|>
      <HandleError @error={{error}}>
        <h2 class="error-message">Something went wrong.</h2>
        <p class="error-cta">Please contact TodoMVC support.</p>
      </HandleError>
    </:error>

  </Request>
</template>;

const Todos = <template>{{! This is unused and exists only as an example }}</template> satisfies TOC<{
  Args: {
    todos: Todo[];
  };
}>;
