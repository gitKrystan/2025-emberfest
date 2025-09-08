import { assert } from '@warp-drive/core/build-config/macros';
import type { ReactiveDataDocument } from '@warp-drive/core/reactive';
import { defineSignal, memoized } from '@warp-drive/core/store/-private';

import type { PaginationState } from './pagination-state';
import type { ContentFeatures } from './pagination-subscription';
import { getHref } from './util';

/** @public */
export type PageHints<T> = (result: ReactiveDataDocument<T[]>) => {
  /** 1-indexed current page index */
  currentPage: number;
  /** Total number of pages available for the query */
  totalPages: number;
};

export interface RealPaginationLink {
  isPlaceholder: false;
  /** 1-indexed page index */
  index: number;
  /** Is this the current active page? */
  isCurrent: boolean;
  /** URL for this page */
  url: string;
  /** Load this page */
  setActive: () => Promise<void>;
}

export interface PlaceholderPaginationLink {
  isPlaceholder: true;
  /** 1-indexed page index */
  index: number;
  /** Defaults to '.' */
  text: string;
}

export type PaginationLink = RealPaginationLink | PlaceholderPaginationLink;

/**
 * A container with helpful utilities for creating navigation links.
 */
export class PaginationLinks<T, E> {
  private readonly pageHints: PageHints<T>;
  private readonly paginationState: PaginationState<T, E>;
  private readonly contentFeatures: ContentFeatures<ReactiveDataDocument<T[]>>;

  constructor(
    pageHints: PageHints<T>,
    paginationState: PaginationState<T, E>,
    contentFeatures: ContentFeatures<ReactiveDataDocument<T[]>>
  ) {
    this.pageHints = pageHints;
    this.paginationState = paginationState;
    this.contentFeatures = contentFeatures;
  }

  private _links: PaginationLink[] | null = null;

  @memoized
  get links(): PaginationLink[] | null {
    console.log('PaginationLinks.links recomputed');
    const { pageHints } = this;
    const state = this.paginationState;

    const activeRequestState = state.activePage.requestState;
    if (!activeRequestState?.value) {
      console.log('  no activeRequestState.value');
      return this._links;
    }

    const { first, last, prev, next } = activeRequestState.value.links ?? {};
    const { currentPage, totalPages } = pageHints(activeRequestState.value);

    const firstUrl = getHref(first);
    const lastUrl = getHref(last);
    const prevUrl = getHref(prev);
    const nextUrl = getHref(next);

    if (this._links?.length === totalPages) {
      console.log('  updating cached links');
    }

    // TODO: reset if the totalPages changed...verify this is desired behavior
    const links =
      this._links?.length === totalPages ? this._links : Array(totalPages);

    return (this._links = links.map<PaginationLink>(
      (slot: PaginationLink | undefined, i): PaginationLink => {
        // link.index and pageHints.currentPage are 1-indexed
        const index = i + 1;
        const isCurrent = index === currentPage;
        // First page
        if (index === 1) {
          return getPaginationLink(
            slot ?? null,
            index,
            isCurrent,
            firstUrl,
            this.contentFeatures
          );
        }
        // Previous page
        if (index === currentPage - 1) {
          return getPaginationLink(
            slot ?? null,
            index,
            isCurrent,
            prevUrl,
            this.contentFeatures
          );
        }
        // Current Page
        if (isCurrent) {
          return getPaginationLink(
            slot ?? null,
            index,
            isCurrent,
            state.activePage.selfLink,
            this.contentFeatures
          );
        }
        // Next Page
        if (index === currentPage + 1) {
          return getPaginationLink(
            slot ?? null,
            index,
            isCurrent,
            nextUrl,
            this.contentFeatures
          );
        }
        // Last page
        if (index === totalPages) {
          return getPaginationLink(
            slot ?? null,
            index,
            isCurrent,
            lastUrl,
            this.contentFeatures
          );
        }
        // Placeholder
        return getPaginationLink(
          slot ?? null,
          index,
          isCurrent,
          null,
          this.contentFeatures
        );
      }
    ));
  }
}

function getPaginationLink<T>(
  currentLink: PaginationLink | null,
  index: number,
  isCurrent: boolean,
  url: string | null,
  contentFeatures: ContentFeatures<ReactiveDataDocument<T[]>>
): PaginationLink {
  if (currentLink && !currentLink.isPlaceholder) {
    // Update existing RealPaginationLink
    return upgradeRealPaginationLink<T>(currentLink)._setIsCurrent(isCurrent);
  } else if (url) {
    return new RealPaginationLinkImpl(url, index, isCurrent, contentFeatures);
  } else {
    assert('Cannot set PlaceHolder link to current', !isCurrent);
    return new PlaceholderPaginationLinkImpl(index);
  }
}

function upgradeRealPaginationLink<T>(
  link: RealPaginationLink
): RealPaginationLinkImpl<T> {
  return link as RealPaginationLinkImpl<T>;
}

class RealPaginationLinkImpl<T> implements RealPaginationLink {
  readonly isPlaceholder = false as const;

  readonly url: string;
  readonly index: number;

  private _isCurrent: boolean;
  private readonly _contentFeatures: ContentFeatures<ReactiveDataDocument<T[]>>;

  constructor(
    url: string,
    index: number,
    isCurrent: boolean,
    contentFeatures: ContentFeatures<ReactiveDataDocument<T[]>>
  ) {
    this.url = url;
    this.index = index;
    this._isCurrent = isCurrent;
    this._contentFeatures = contentFeatures;
  }

  get isCurrent(): boolean {
    return this._isCurrent;
  }

  readonly setActive: () => Promise<void> = () => {
    return this._contentFeatures.loadPage(this.url);
  };

  /** @internal */
  _setIsCurrent(isCurrent: boolean) {
    this._isCurrent = isCurrent;
    return this;
  }
}

class PlaceholderPaginationLinkImpl implements PlaceholderPaginationLink {
  readonly isPlaceholder = true as const;

  readonly index: number;
  text = '.';

  constructor(index: number) {
    this.index = index;
  }
}

defineSignal(PaginationLinks.prototype, 'self', undefined);
