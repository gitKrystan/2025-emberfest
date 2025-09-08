import Component from '@glimmer/component';

import type { PlaceholderPaginationLink, RealPaginationLink } from './pagination-links';
import type { PaginationState } from './pagination-state';

interface EachLinkSignature<T, E> {
  Args: {
    pages: Readonly<PaginationState<T, E>>;
  };
  Blocks: {
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
        {{#if link.isPlaceholder}}
          {{yield link to="placeholder"}}
        {{else}}
          {{yield link to="link"}}
        {{/if}}
      {{/each}}
    {{/if}}
  </template>
}
