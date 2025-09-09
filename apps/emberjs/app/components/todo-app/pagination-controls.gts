import type { TOC } from '@ember/component/template-only';
import { on } from '@ember/modifier';

import type { ReactiveDataDocument } from '@warp-drive/core/reactive';

import type { Todo } from '@workspace/shared-data/types';

import { EachLink } from '#/components/fixme/paginate';

import type { PlaceholderPaginationLink, RealPaginationLink } from '../fixme/paginate/-private/pagination-links';
import type { PaginationState } from '../fixme/paginate/-private/pagination-state';
import type { ContentFeatures } from '../fixme/paginate/-private/pagination-subscription';
import { LinkTo } from '@ember/routing';
import { hash } from '@ember/helper';

interface Signature {
  Args: {
    // FIXME: Remove this Readonly junk
    pages: Readonly<PaginationState<Todo, unknown>>;
    state: ContentFeatures<ReactiveDataDocument<Todo[]>>;
  };
}

export const PaginationControls = <template>
  {{#if (or @state.loadPrev @state.loadNext)}}
    <div class="pagination-controls">
      <LoadPreviousButton @prevPage={{@pages.links.prevPageNumber}} @loadPrev={{@state.loadPrev}} />

      <PageLinks @pages={{@pages}} />

      <LoadNextButton @nextPage={{@pages.links.nextPageNumber}} @loadNext={{@state.loadNext}} />
    </div>
  {{/if}}
</template> satisfies TOC<Signature>;

const LoadPreviousButton = <template>
  {{#if @loadPrev}}
    <LinkTo @query={{hash page=@prevPage}} {{on "click" @loadPrev}} class="pagination-button prev">
      ←
      <span class="pagination-button-text">Load previous</span>
    </LinkTo>
  {{else}}
    <div></div>
  {{/if}}
</template> satisfies TOC<{
  Args: {
    prevPage: number | null | undefined;
    loadPrev: (() => Promise<void>) | null;
  };
}>;

const LoadNextButton = <template>
  {{#if @loadNext}}
    <LinkTo @query={{hash page=@nextPage}} {{on "click" @loadNext}} class="pagination-button prev">
      <span class="pagination-button-text">Load next</span>
      →
    </LinkTo>
  {{else}}
    <div></div>
  {{/if}}
</template> satisfies TOC<{
  Args: {
    nextPage: number | null | undefined;
    loadNext: (() => Promise<void>) | null;
  };
}>;

const PageLinks = <template>
  <div class="pagination-links">
    <EachLink @pages={{@pages}}>

      <:placeholder as |link|>
        <PlaceholderLink @placeholder={{link}} />
      </:placeholder>

      <:link as |link|>
        <RealLink @link={{link}} @pages={{@pages}} />
      </:link>

    </EachLink>
  </div>
</template> satisfies TOC<{
  Args: {
    // FIXME: Remove this Readonly junk
    pages: Readonly<PaginationState<Todo, unknown>>;
  };
}>;

const PlaceholderLink = <template>
  {{#if (shouldShowPlaceholder @placeholder.distanceFromActiveIndex)}}
    <span class="pagination-link pagination-placeholder-link">⋯</span>
  {{/if}}
</template> satisfies TOC<{
  Args: {
    placeholder: PlaceholderPaginationLink;
  };
}>;

const RealLink = <template>
  {{#if (shouldShowRealLink @link.index @link.distanceFromActiveIndex @pages.links.totalPages)}}
    <LinkTo
      @query={{hash page=@link.index}}
      {{on "click" @link.setActive}}
      class="pagination-link pagination-real-link {{if @link.isCurrent 'pagination-link-active'}}"
    >
      {{@link.index}}
    </LinkTo>
  {{else if (shouldShowLinkExpander @link.distanceFromActiveIndex)}}
    <LinkTo
      @query={{hash page=@link.index}}
      {{on "click" @link.setActive}}
      class="pagination-link pagination-placeholder-link"
    >
      ⋯
    </LinkTo>
  {{/if}}
</template> satisfies TOC<{
  Args: {
    link: RealPaginationLink;
    // FIXME: Remove this Readonly junk
    pages: Readonly<PaginationState<Todo, unknown>>;
  };
}>;

const showDistance = 3;

function shouldShowPlaceholder(distanceFromActiveIndex: number): boolean {
  return distanceFromActiveIndex < 3;
}

function shouldShowRealLink(
  index: number,
  distanceFromActiveIndex: number,
  totalPages: number | null | undefined
): boolean {
  return (
    // first page
    index === 1 ||
    // last page
    (totalPages && index === totalPages) ||
    // close to current page
    distanceFromActiveIndex <= showDistance
  );
}

// Assumes this is called in an else after shouldShowRealLink
// Thus, doesn't check for first or last page
function shouldShowLinkExpander(distanceFromActiveIndex: number): boolean {
  return distanceFromActiveIndex === showDistance + 1;
}

function or(a: unknown, b: unknown) {
  return a || b;
}
