import { assert } from '@warp-drive/core/build-config/macros';
import type { ReactiveDataDocument } from '@warp-drive/core/reactive';
import { defineSignal, memoized } from '@warp-drive/core/store/-private';

import type { PaginationState } from './pagination-state';
import { getHref } from './util';

/** @public */
export type PageHints<T> = (result: ReactiveDataDocument<T[]>) => {
  /** 1-indexed current page index */
  currentPage: number;
  /** Total number of pages available for the query */
  totalPages: number;
};

export interface RealPaginationLink {
  isReal: true;
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
  isReal: false;
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
  private readonly loadPage: (url: string) => Promise<void>;

  constructor(
    pageHints: PageHints<T>,
    paginationState: PaginationState<T, E>,
    loadPage: (url: string) => Promise<void>
  ) {
    this.pageHints = pageHints;
    this.paginationState = paginationState;
    this.loadPage = loadPage;
  }

  private _links: PaginationLink[] | null = null;

  /** All available links and placeholders */
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
    const existingLinks =
      this._links?.length === totalPages ? this._links : null;

    // TODO: Could probably find a more performant way to do this,
    // e.g. on update only updating the known pages
    return (this._links = Array.from(
      { length: totalPages },
      (_, i): PaginationLink => {
        const existingLink = existingLinks?.[i] ?? null;
        // link.index and pageHints.currentPage are 1-indexed
        const index = i + 1;
        const isCurrent = index === currentPage;
        // First page
        if (index === 1) {
          return getPaginationLink(
            existingLink,
            index,
            isCurrent,
            firstUrl,
            this.loadPage
          );
        }
        // Previous page
        if (index === currentPage - 1) {
          return getPaginationLink(
            existingLink,
            index,
            isCurrent,
            prevUrl,
            this.loadPage
          );
        }
        // Current Page
        if (isCurrent) {
          return getPaginationLink(
            existingLink,
            index,
            isCurrent,
            state.activePage.selfLink,
            this.loadPage
          );
        }
        // Next Page
        if (index === currentPage + 1) {
          return getPaginationLink(
            existingLink,
            index,
            isCurrent,
            nextUrl,
            this.loadPage
          );
        }
        // Last page
        if (index === totalPages) {
          return getPaginationLink(
            existingLink,
            index,
            isCurrent,
            lastUrl,
            this.loadPage
          );
        }
        // Placeholder
        return getPaginationLink(
          existingLink,
          index,
          isCurrent,
          null,
          this.loadPage
        );
      }
    ));
  }
}

function getPaginationLink(
  currentLink: PaginationLink | null,
  index: number,
  isCurrent: boolean,
  url: string | null,
  loadPage: (url: string) => Promise<void>
): PaginationLink {
  if (currentLink?.isReal) {
    // Update existing RealPaginationLink
    return upgradeRealPaginationLink(currentLink)._setIsCurrent(isCurrent);
  } else if (url) {
    return new RealPaginationLinkImpl(url, index, isCurrent, loadPage);
  } else {
    assert('Cannot set PlaceHolder link to current', !isCurrent);
    return new PlaceholderPaginationLinkImpl(index);
  }
}

function upgradeRealPaginationLink(
  link: RealPaginationLink
): RealPaginationLinkImpl {
  return link as RealPaginationLinkImpl;
}

class RealPaginationLinkImpl implements RealPaginationLink {
  readonly isReal = true as const;

  readonly url: string;
  readonly index: number;

  private _isCurrent: boolean;
  private readonly _loadPage: (url: string) => Promise<void>;

  constructor(
    url: string,
    index: number,
    isCurrent: boolean,
    loadPage: (url: string) => Promise<void>
  ) {
    this.url = url;
    this.index = index;
    this._isCurrent = isCurrent;
    this._loadPage = loadPage;
  }

  get isCurrent(): boolean {
    return this._isCurrent;
  }

  readonly setActive: () => Promise<void> = () => {
    return this._loadPage(this.url);
  };

  /** @internal */
  _setIsCurrent(isCurrent: boolean) {
    this._isCurrent = isCurrent;
    return this;
  }
}

class PlaceholderPaginationLinkImpl implements PlaceholderPaginationLink {
  readonly isReal = false as const;

  readonly index: number;
  text = '.';

  constructor(index: number) {
    this.index = index;
  }
}

defineSignal(PaginationLinks.prototype, 'self', undefined);
