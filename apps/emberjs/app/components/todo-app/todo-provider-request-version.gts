import type { TOC } from '@ember/component/template-only';
import { on } from '@ember/modifier';

import { Request } from '@warp-drive/ember';

import { getAllTodos } from '@workspace/shared-data/builders';
import type { Todo } from '@workspace/shared-data/types';

import { HandleError } from '#/components/design-system/error';
import { LoadingSpinner } from '#/components/design-system/loading';

import { Button } from '../design-system/button.gts';

export const TodoProvider = <template>
  <Request @query={{(getAllTodos)}} @autorefresh={{true}} @autorefreshBehavior="refresh">

    <:loading><LoadingSpinner /></:loading>

    <:content as |content|><Todos @todos={{content.data}} /></:content>

    <:error as |error state|>
      <HandleError @error={{error}}>Please contact TodoMVC support.</HandleError>
      <Button {{on "click" state.retry}}>Or DDOS us!</Button>
    </:error>

  </Request>
</template>;

/*









*/

const Todos = <template>{{! This is unused and exists only as an example }}</template> satisfies TOC<{
  Args: {
    todos: Todo[];
  };
}>;
