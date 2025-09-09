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
  /** Distance from the active page index */
  distanceFromActiveIndex: number;
  /** URL for this page */
  url: string;
  /** Load this page */
  setActive: () => Promise<void>;
}

export interface PlaceholderPaginationLink {
  isReal: false;
  /** 1-indexed page index */
  index: number;
  /** Distance from the active page index */
  distanceFromActiveIndex: number;
  /** Defaults to '.' */
  text: string;
}

export type PaginationLink = RealPaginationLink | PlaceholderPaginationLink;

/**
 * A container with helpful utilities for creating navigation links.
 */
export class PaginationLinks<T, E> {
  private readonly _pageHints: PageHints<T>;
  private readonly paginationState: PaginationState<T, E>;
  private readonly loadPage: (url: string) => Promise<void>;

  constructor(
    pageHints: PageHints<T>,
    paginationState: PaginationState<T, E>,
    loadPage: (url: string) => Promise<void>
  ) {
    this._pageHints = pageHints;
    this.paginationState = paginationState;
    this.loadPage = loadPage;
  }

  private _links: PaginationLink[] | null = null;
  private _currentPageIndex: number | null = null;
  private _totalPages: number | null = null;
  private _pageHintsMemo: {
    /** 1-indexed current page index */
    currentPage: number;
    /** Total number of pages available for the query */
    totalPages: number;
  } | null = null;

  @memoized
  get pageHints(): {
    /** 1-indexed current page index */
    currentPage: number;
    /** Total number of pages available for the query */
    totalPages: number;
  } | null {
    const state = this.paginationState;
    const activeRequestState = state.activePage.requestState;
    if (!activeRequestState?.value) {
      return this._pageHintsMemo;
    }

    return (this._pageHintsMemo = this._pageHints(activeRequestState.value));
  }

  /** The index of the currently active page, or null if no active page */
  @memoized
  get currentPageIndex(): number | null {
    const { pageHints } = this;
    if (!pageHints) {
      return this._currentPageIndex;
    }

    return (this._currentPageIndex = pageHints.currentPage);
  }

  /** Total pages */
  @memoized
  get totalPages(): number | null {
    const { pageHints } = this;
    if (!pageHints) {
      return this._totalPages;
    }

    return (this._totalPages = pageHints.totalPages);
  }

  /** All available links and placeholders */
  @memoized
  get links(): PaginationLink[] | null {
    const { pageHints } = this;
    const state = this.paginationState;

    const activeRequestState = state.activePage.requestState;
    if (!activeRequestState?.value || !pageHints) {
      return this._links;
    }

    const { first, last, prev, next } = activeRequestState.value.links ?? {};
    const { currentPage, totalPages } = pageHints;

    const firstUrl = getHref(first);
    const lastUrl = getHref(last);
    const prevUrl = getHref(prev);
    const nextUrl = getHref(next);

    // TODO: reset if the totalPages changed...verify this is desired behavior
    const existingLinks =
      this._links?.length === totalPages ? this._links : null;

    // TODO: Could probably find a more performant way to do this,
    // e.g. on update only updating the known pages
    const links = Array.from({ length: totalPages }, (_, i): PaginationLink => {
      const existingLink = existingLinks?.[i] ?? null;
      // link.index and pageHints.currentPage are 1-indexed
      const index = i + 1;
      // First page
      if (index === 1) {
        return getPaginationLink(
          existingLink,
          index,
          currentPage,
          firstUrl,
          this.loadPage
        );
      }
      // Previous page
      if (index === currentPage - 1) {
        return getPaginationLink(
          existingLink,
          index,
          currentPage,
          prevUrl,
          this.loadPage
        );
      }
      // Current Page
      if (index === currentPage) {
        return getPaginationLink(
          existingLink,
          index,
          currentPage,
          state.activePage.selfLink,
          this.loadPage
        );
      }
      // Next Page
      if (index === currentPage + 1) {
        return getPaginationLink(
          existingLink,
          index,
          currentPage,
          nextUrl,
          this.loadPage
        );
      }
      // Last page
      if (index === totalPages) {
        return getPaginationLink(
          existingLink,
          index,
          currentPage,
          lastUrl,
          this.loadPage
        );
      }
      // Placeholder
      return getPaginationLink(
        existingLink,
        index,
        currentPage,
        null,
        this.loadPage
      );
    });

    return (this._links = links);
  }
}

function getPaginationLink(
  existingLink: PaginationLink | null,
  index: number,
  currentPage: number,
  url: string | null,
  loadPage: (url: string) => Promise<void>
): PaginationLink {
  const isCurrent = index === currentPage;
  const distanceFromActiveIndex = Math.abs(index - currentPage);

  if (existingLink?.isReal) {
    // If the existing link has the same distance and current state, reuse it
    if (
      existingLink.distanceFromActiveIndex === distanceFromActiveIndex &&
      existingLink.isCurrent === isCurrent
    ) {
      return existingLink;
    }
    // Otherwise create a new one with updated values
    return new RealPaginationLinkImpl(
      existingLink.url,
      index,
      isCurrent,
      distanceFromActiveIndex,
      loadPage
    );
  } else if (url) {
    return new RealPaginationLinkImpl(
      url,
      index,
      isCurrent,
      distanceFromActiveIndex,
      loadPage
    );
  } else {
    assert('Cannot set PlaceHolder link to current', !isCurrent);
    return new PlaceholderPaginationLinkImpl(index, distanceFromActiveIndex);
  }
}

class RealPaginationLinkImpl implements RealPaginationLink {
  readonly isReal = true as const;

  readonly url: string;
  readonly index: number;
  readonly distanceFromActiveIndex: number;

  private readonly _isCurrent: boolean;
  private readonly _loadPage: (url: string) => Promise<void>;

  constructor(
    url: string,
    index: number,
    isCurrent: boolean,
    distanceFromActiveIndex: number,
    loadPage: (url: string) => Promise<void>
  ) {
    this.url = url;
    this.index = index;
    this._isCurrent = isCurrent;
    this._loadPage = loadPage;
    this.distanceFromActiveIndex = distanceFromActiveIndex;
  }

  get isCurrent(): boolean {
    return this._isCurrent;
  }

  readonly setActive: () => Promise<void> = () => {
    return this._loadPage(this.url);
  };
}

class PlaceholderPaginationLinkImpl implements PlaceholderPaginationLink {
  readonly isReal = false as const;

  readonly index: number;
  readonly distanceFromActiveIndex: number;
  text = '.';

  constructor(index: number, distanceFromActiveIndex: number) {
    this.index = index;
    this.distanceFromActiveIndex = distanceFromActiveIndex;
  }
}

defineSignal(PaginationLinks.prototype, 'self', undefined);
