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
  <div class="pagination-link-buttons">
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
  <span class="pagination-button pagination-placeholder-button">⋯</span>
</template> satisfies TOC<{
  Args: {
    placeholder: PlaceholderPaginationLink;
  };
}>;

const showDistance = 3;

class RealLink extends Component<{
  Args: {
    link: RealPaginationLink;
    // FIXME: Remove this Readonly junk
    pages: Readonly<PaginationState<Todo, unknown>>;
  };
}> {
  <template>
    {{#if this.shouldShowRealLink}}
      <Button
        {{on "click" this.setActive}}
        class="pagination-button pagination-real-button {{if @link.isCurrent 'pagination-button-active'}}"
      >
        <span class="pagination-button-text">{{@link.index}}</span>
      </Button>
    {{else if this.shouldShowLinkExpander}}
      <Button {{on "click" this.setActive}} class="pagination-button pagination-real-button pagination-link-expander">
        <span class="pagination-button-text">⋯</span>
      </Button>
    {{/if}}
  </template>

  @service declare router: RouterService;

  setActive = async () => {
    const { link } = this.args;
    this.router.transitionTo({ queryParams: { page: link.index } });
    await link.setActive();
  };

  get showDistance() {
    return this.args.link.index >= 10000 ? showDistance - 2 : showDistance;
  }

  get shouldShowRealLink(): boolean {
    const totalPages = this.args.pages.links?.totalPages;
    const { index, distanceFromActiveIndex } = this.args.link;
    return (
      // first page
      index === 1 ||
      // last page
      (totalPages && index === totalPages) ||
      // close to current page
      distanceFromActiveIndex <= this.showDistance
    );
  }

  // Assumes this is called in an else after shouldShowRealLink
  // Thus, doesn't check for first or last page
  get shouldShowLinkExpander(): boolean {
    const { distanceFromActiveIndex } = this.args.link;
    return distanceFromActiveIndex === this.showDistance + 1;
  }
}

function or(a: unknown, b: unknown) {
  return a || b;
}
