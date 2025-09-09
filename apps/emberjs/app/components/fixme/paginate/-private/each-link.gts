import Component from '@glimmer/component';

import type { PaginationLink, PlaceholderPaginationLink, RealPaginationLink } from './pagination-links';
import type { PaginationState } from './pagination-state';

interface EachLinkSignature<T, E> {
  Args: {
    pages: PaginationState<T, E>;
  };
  Blocks: {
    default: [link: PaginationLink];
    placeholder: [placeholder: PlaceholderPaginationLink];
    link: [link: RealPaginationLink];
  };
}

/**
 * A thin wrapper around PaginationLinks that yields each link in the `links` array.
 */
export class EachLink<T, E> extends Component<EachLinkSignature<T, E>> {
  <template>
    {{#if @pages.links.links}}
      {{#each @pages.links.links as |link|}}
        {{#if (has-block)}}
          {{yield link}}
        {{else}}
          {{#if link.isReal}}
            {{yield link to="link"}}
          {{else}}
            {{yield link to="placeholder"}}
          {{/if}}
        {{/if}}
      {{/each}}
    {{/if}}
  </template>
}
