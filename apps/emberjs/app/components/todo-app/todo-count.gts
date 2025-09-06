import type { TOC } from '@ember/component/template-only';

import { Request } from '@warp-drive/ember';

import { getActiveTodos } from '@workspace/shared-data/builders';
import type { Todo } from '@workspace/shared-data/types';

import { Error } from '#/components/design-system/error';

export const TodoCount = <template>
  <span class="todo-count">
    <Request @query={{(getActiveTodos)}} @autorefresh={{true}} @autorefreshBehavior="refresh">
      <:content as |content|>
        <Remaining @remaining={{content.data}} />
      </:content>
      <:error as |error|>
        <Error @error={{error}} @display={{false}} />
      </:error>
    </Request>
  </span>
</template>;

const Remaining = <template>
  <strong>{{@remaining.length}}</strong>
  {{itemLabel @remaining.length}}
  left
</template> satisfies TOC<{
  Args: { remaining: Todo[] };
}>;

function itemLabel(count: number) {
  if (count === 0 || count > 1) {
    return 'items';
  }

  return 'item';
}
