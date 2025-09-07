import Component from '@glimmer/component';

import { toast } from '#/helpers/toast';

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

    {{#if this.toastMsg}}{{toast "error" this.toastMsg}}{{/if}}
  </template>

  get toastMsg() {
    if (this.args.toast) {
      return `Something went wrong. ${this.args.toast} Please contact TodoMVC support.`;
    }
    return null;
  }
}

function reportError(error: unknown) {
  if (error instanceof Error) {
    console.error(error);
  } else {
    console.error(error);
  }
}
