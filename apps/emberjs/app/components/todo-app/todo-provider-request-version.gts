import type { TOC } from '@ember/component/template-only';
import { on } from '@ember/modifier';

import { Request } from '@warp-drive/ember';

import { getAllTodos } from '@workspace/shared-data/builders';
import type { Todo } from '@workspace/shared-data/types';

import { HandleError } from '#/components/design-system/error';
import { LoadingSpinner } from '#/components/design-system/loading';

import { Button } from '../design-system/button.gts';

export const TodoProvider = <template>
  <Request
    {{! Our request builder }}
    @query={{(getAllTodos)}}
    {{! Refresh settings }}
    @autorefresh={{true}}
    @autorefreshBehavior="refresh"
  >

    {{! While loading, display a spinner }}
    <:loading><LoadingSpinner /></:loading>

    {{! On success, display the todos }}
    <:content as |content|><Todos @todos={{content.data}} /></:content>

    {{! On error, send the customer to support }}
    <:error as |error state|>
      <HandleError @error={{error}}>
        <h2 class="error-message">Something went wrong.</h2>
        <p class="error-cta">Please contact TodoMVC support.</p>
        <Button {{on "click" state.retry}}>Or DDOS us!</Button>
      </HandleError>
    </:error>

  </Request>
</template>;

const Todos = <template>{{! This is unused and exists only as an example }}</template> satisfies TOC<{
  Args: {
    todos: Todo[];
  };
}>;
