import type { TOC } from '@ember/component/template-only';
import { assert } from '@ember/debug';
import { on } from '@ember/modifier';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import Component from '@glimmer/component';

import type { ReactiveDataDocument } from '@warp-drive/core/reactive';

import type { Todo } from '@workspace/shared-data/types';

import { Button } from '#/components/design-system/button';
import { LoadingSpinner } from '#/components/design-system/loading';
import { EachLink } from '#/components/fixme/paginate';
import type {
  PlaceholderPaginationLink,
  RealPaginationLink,
} from '#/components/fixme/paginate/-private/pagination-links';
import type { PaginationState } from '#/components/fixme/paginate/-private/pagination-state';
import type { ContentFeatures } from '#/components/fixme/paginate/-private/pagination-subscription';

interface Signature {
  Args: {
    // FIXME: Remove this Readonly junk
    pages: Readonly<PaginationState<Todo, unknown>>;
    state: ContentFeatures<ReactiveDataDocument<Todo[]>>;
  };
}

export class PaginationControls extends Component<Signature> {
  <template>
    {{#if (or @state.loadPrev @state.loadNext)}}
      <div class="pagination-controls">
        <LoadPreviousButton @prevPage={{@pages.links.prevPageNumber}} @loadPrev={{@state.loadPrev}} />

        <PageLinks @pages={{@pages}} />

        <LoadNextButton @nextPage={{@pages.links.nextPageNumber}} @loadNext={{@state.loadNext}} />

        {{! HACK @runspired work-around for no "page that isn't the prev or next page is loading" state }}
        {{#if this.isLoading}}
          <LoadingSpinner />
        {{/if}}
      </div>
    {{/if}}
  </template>

  get isLoading() {
    return this.args.pages.pages.some((p) => p.isLoading);
  }
}

class LoadPreviousButton extends Component<{
  Args: {
    prevPage: number | null | undefined;
    loadPrev: (() => Promise<void>) | null;
  };
}> {
  <template>
    {{#if @loadPrev}}
      <Button {{on "click" this.loadPrev}} class="pagination-button prev">
        ←
        <span class="pagination-button-text">Load previous</span>
      </Button>
    {{else}}
      <div class="pagination-button prev pagination-button-placeholder">
        ←
        <span class="pagination-button-text">Load previous</span>
      </div>
    {{/if}}
  </template>

  @service declare router: RouterService;

  loadPrev = async () => {
    const { prevPage, loadPrev } = this.args;
    assert('Cannot call loadPrev', loadPrev);
    this.router.transitionTo({ queryParams: { page: prevPage } });
    await loadPrev();
  };
}

class LoadNextButton extends Component<{
  Args: {
    nextPage: number | null | undefined;
    loadNext: (() => Promise<void>) | null;
  };
}> {
  <template>
    {{#if @loadNext}}
      <Button {{on "click" this.loadNext}} class="pagination-button next">
        <span class="pagination-button-text">Load next</span>
        →
      </Button>
    {{else}}
      <div class="pagination-button next pagination-button-placeholder">
        <span class="pagination-button-text">Load next</span>
        →
      </div>
    {{/if}}
  </template>

  @service declare router: RouterService;

  loadNext = async () => {
    const { nextPage, loadNext } = this.args;
    assert('Cannot call loadNext', loadNext);
    this.router.transitionTo({ queryParams: { page: nextPage } });
    await loadNext();
  };
}

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

class RealLink extends Component<{
  Args: {
    link: RealPaginationLink;
    // FIXME: Remove this Readonly junk
    pages: Readonly<PaginationState<Todo, unknown>>;
  };
}> {
  <template>
    {{#if (shouldShowRealLink @link.index @link.distanceFromActiveIndex @pages.links.totalPages)}}
      <Button
        {{on "click" this.setActive}}
        class="pagination-link pagination-real-link {{if @link.isCurrent 'pagination-link-active'}}"
      >
        {{@link.index}}
      </Button>
    {{else if (shouldShowLinkExpander @link.distanceFromActiveIndex)}}
      <Button {{on "click" this.setActive}} class="pagination-link pagination-placeholder-link">
        ⋯
      </Button>
    {{/if}}
  </template>

  @service declare router: RouterService;

  setActive = async () => {
    const { link } = this.args;
    this.router.transitionTo({ queryParams: { page: link.index } });
    await link.setActive();
  };
}

function shouldShowPlaceholder(distanceFromActiveIndex: number): boolean {
  return distanceFromActiveIndex < 3;
}

const showDistance = 4;

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
