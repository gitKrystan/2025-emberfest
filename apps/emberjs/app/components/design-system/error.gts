import Component from '@glimmer/component';

import { toast } from '#/helpers/toast';
import { reportError } from '#/helpers/error';

interface Signature<E> {
  Element: HTMLDivElement;
  Args: { error: E; toast?: string };
  Blocks: { default?: [error: E] };
}

export class HandleError<E> extends Component<Signature<E>> {
  <template>
    {{reportError @error}}

    {{#if (has-block)}}
      <div class="error">
        {{yield @error}}
      </div>
    {{/if}}

    {{#if @toast}}{{toast "error" @toast}}{{/if}}
  </template>
}
