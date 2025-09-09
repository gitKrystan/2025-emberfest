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
  /** 1-indexed page index range (inclusive) */
  indexRange: [start: number, end: number];
  /** Number of links represented by the range. */
  rangeSize: number;
  /** Distance from the active page index to the nearest end of the range */
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

    const links = [];
    let prevLink: PaginationLink | null = null;

    const existingLinks = this._links ?? [];

    // link.index and pageHints.currentPage are 1-indexed
    for (let i = 0; i < totalPages; i++) {
      const index = i + 1;

      const existingRealLink =
        existingLinks.find(
          (link): link is RealPaginationLink =>
            link.isReal && link.index === index
        ) ?? null;

      // First page
      if (index === 1) {
        const currLink = getPaginationLink(
          existingRealLink,
          index,
          currentPage,
          firstUrl,
          this.loadPage
        );
        if (!prevLink || prevLink.isReal || currLink.isReal) {
          prevLink = currLink;
          links.push(currLink);
          continue;
        }
        upgradePlaceholder(prevLink)._mergeRange(
          currLink.indexRange,
          currentPage
        );
        continue;
      }
      // Previous page
      if (index === currentPage - 1) {
        const currLink = getPaginationLink(
          existingRealLink,
          index,
          currentPage,
          prevUrl,
          this.loadPage
        );
        if (!prevLink || prevLink.isReal || currLink.isReal) {
          prevLink = currLink;
          links.push(currLink);
          continue;
        }
        upgradePlaceholder(prevLink)._mergeRange(
          currLink.indexRange,
          currentPage
        );
        continue;
      }
      // Current Page
      if (index === currentPage) {
        const currLink = getPaginationLink(
          existingRealLink,
          index,
          currentPage,
          state.activePage.selfLink,
          this.loadPage
        );
        if (!prevLink || prevLink.isReal || currLink.isReal) {
          prevLink = currLink;
          links.push(currLink);
          continue;
        }
        upgradePlaceholder(prevLink)._mergeRange(
          currLink.indexRange,
          currentPage
        );
        continue;
      }
      // Next Page
      if (index === currentPage + 1) {
        const currLink = getPaginationLink(
          existingRealLink,
          index,
          currentPage,
          nextUrl,
          this.loadPage
        );
        if (!prevLink || prevLink.isReal || currLink.isReal) {
          prevLink = currLink;
          links.push(currLink);
          continue;
        }
        upgradePlaceholder(prevLink)._mergeRange(
          currLink.indexRange,
          currentPage
        );
        continue;
      }
      // Last page
      if (index === totalPages) {
        const currLink = getPaginationLink(
          existingRealLink,
          index,
          currentPage,
          lastUrl,
          this.loadPage
        );
        if (!prevLink || prevLink.isReal || currLink.isReal) {
          prevLink = currLink;
          links.push(currLink);
          continue;
        }
        upgradePlaceholder(prevLink)._mergeRange(
          currLink.indexRange,
          currentPage
        );
        continue;
      }
      // Placeholder
      const currLink = getPaginationLink(
        existingRealLink,
        index,
        currentPage,
        null,
        this.loadPage
      );
      if (!prevLink || prevLink.isReal || currLink.isReal) {
        prevLink = currLink;
        links.push(currLink);
        continue;
      }
      upgradePlaceholder(prevLink)._mergeRange(
        currLink.indexRange,
        currentPage
      );
    }

    return (this._links = links);
  }
}

function getPaginationLink(
  existingRealLink: RealPaginationLink | null,
  index: number,
  currentPage: number,
  url: string | null,
  loadPage: (url: string) => Promise<void>
): PaginationLink {
  const isCurrent = index === currentPage;
  const distanceFromActiveIndex = Math.abs(index - currentPage);

  if (existingRealLink?.isReal) {
    assert(
      'Found existing real link with a different URL',
      !url || url === existingRealLink.url
    );
    return new RealPaginationLinkImpl(
      url ?? existingRealLink.url,
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
    return new PlaceholderPaginationLinkImpl(
      [index, index],
      distanceFromActiveIndex
    );
  }
}

class RealPaginationLinkImpl implements RealPaginationLink {
  readonly isReal = true as const;

  readonly url: string;
  readonly index: number;
  distanceFromActiveIndex: number;
  isCurrent: boolean;

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
    this.isCurrent = isCurrent;
    this._loadPage = loadPage;
    this.distanceFromActiveIndex = distanceFromActiveIndex;
  }

  readonly setActive: () => Promise<void> = () => {
    return this._loadPage(this.url);
  };
}

class PlaceholderPaginationLinkImpl implements PlaceholderPaginationLink {
  readonly isReal = false as const;

  indexRange: [start: number, end: number];
  distanceFromActiveIndex: number;

  text = '.';

  constructor(
    index: [start: number, end: number],
    distanceFromActiveIndex: number
  ) {
    this.indexRange = index;
    this.distanceFromActiveIndex = distanceFromActiveIndex;
  }

  get rangeSize() {
    return this.indexRange[1] - this.indexRange[0] + 1;
  }

  _mergeRange(newRange: [start: number, end: number], newActiveIndex: number) {
    const [oldStart, oldEnd] = this.indexRange;
    const [newStart, newEnd] = newRange;
    const mergedRange: [start: number, end: number] = [
      Math.min(oldStart, newStart),
      Math.max(oldEnd, newEnd),
    ];
    this.indexRange = mergedRange;
    this.distanceFromActiveIndex = Math.min(
      Math.abs(mergedRange[0] - newActiveIndex),
      Math.abs(mergedRange[1] - newActiveIndex)
    );
  }
}

function upgradePlaceholder(
  placeholder: PlaceholderPaginationLink
): PlaceholderPaginationLinkImpl {
  return placeholder as PlaceholderPaginationLinkImpl;
}

defineSignal(RealPaginationLinkImpl.prototype, 'isCurrent', undefined);
defineSignal(
  RealPaginationLinkImpl.prototype,
  'distanceFromActiveIndex',
  undefined
);
defineSignal(PlaceholderPaginationLinkImpl.prototype, 'indexRange', undefined);
defineSignal(
  PlaceholderPaginationLinkImpl.prototype,
  'distanceFromActiveIndex',
  undefined
);
