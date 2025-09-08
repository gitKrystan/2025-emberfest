/**
 * @module @warp-drive/ember
 */
import type { ReactiveDataDocument } from '@warp-drive/core/reactive';
import type { Future } from '@warp-drive/core/request';
import { defineSignal, memoized } from '@warp-drive/core/store/-private';
import type { RequestLoadingState } from '@warp-drive/core/store/-private/new-core-tmp/request-state';
import type { StructuredErrorDocument } from '@warp-drive/core/types/request';

import type { UrlPageStateCreateOptions } from './page-state';
import { PageState } from './page-state';
import { type PageHints, PaginationLinks } from './pagination-links';

// TODO: Make generic?
const PaginationCache = new WeakMap<
  Future<unknown>,
  PaginationState<unknown, unknown>
>();

/**
 * @public Exposed via always slot.
 */
export class PaginationState<T, E> {
  declare readonly initialPage: Readonly<PageState<T, E>>;
  declare activePage: Readonly<PageState<T, E>>;
  declare private readonly pagesCache: Map<string, PageState<T, E>>;

  // TODO: Make reactive?
  declare readonly links: PaginationLinks<T, E> | null;

  constructor(
    request: Future<ReactiveDataDocument<T[]>>,
    linkSupport: {
      pageHints: PageHints<T>;
      loadPage: (url: string) => Promise<void>;
    } | null
  ) {
    this.pagesCache = new Map<string, PageState<T, E>>();
    this.initialPage = new PageState<T, E>(this, { self: request });
    this.activePage = this.initialPage;
    if (linkSupport) {
      this.links = new PaginationLinks(
        linkSupport.pageHints,
        this,
        linkSupport.loadPage
      );
    } else {
      this.links = null;
    }
  }

  addPage(url: string, pageState: PageState<T, E>) {
    this.pagesCache.set(url, pageState);
  }

  @memoized
  get isLoading(): boolean {
    return this.initialPage.isLoading;
  }

  // TODO: Should be `activePage`?
  @memoized
  get loadingState(): RequestLoadingState | null {
    return this.initialPage.requestState?.loadingState ?? null;
  }

  // TODO: Should be `activePage`?
  @memoized
  get isSuccess(): boolean {
    return this.initialPage.isSuccess;
  }

  // TODO: Should be `activePage`?
  @memoized
  get isCancelled(): boolean {
    return this.initialPage.isCancelled;
  }

  // TODO: Should be `activePage`?
  @memoized
  get isError(): boolean {
    return this.initialPage.isError;
  }

  // TODO: Should be `activePage`?
  @memoized
  get reason(): StructuredErrorDocument<E> | null {
    return this.initialPage.reason;
  }

  @memoized
  get firstPage(): Readonly<PageState<T, E>> {
    let page = this.activePage;
    while (page.prev) {
      page = page.prev;
    }
    return page;
  }

  @memoized
  get lastPage(): Readonly<PageState<T, E>> {
    let page = this.activePage;
    while (page.next) {
      page = page.next;
    }
    return page;
  }

  @memoized
  get prevPages(): Readonly<PageState<T, E>>[] {
    const pages = [];
    let page = this.activePage.prev;
    while (page) {
      pages.unshift(page);
      page = page.prev;
    }
    return pages;
  }

  @memoized
  get nextPages(): Readonly<PageState<T, E>>[] {
    const pages = [];
    let page = this.activePage.next;
    while (page) {
      pages.push(page);
      page = page.next;
    }
    return pages;
  }

  @memoized
  get pages(): Readonly<PageState<T, E>>[] {
    return [...this.prevPages, this.activePage, ...this.nextPages];
  }

  @memoized
  get data(): T[] {
    return this.pages.reduce((acc: T[], page) => {
      const content = page.value;
      if (content?.data) {
        acc.push(...content.data);
      }
      return acc;
    }, []);
  }

  @memoized
  get prev(): string | null {
    return this.activePage.prevLink;
  }

  @memoized
  get next(): string | null {
    return this.activePage.nextLink;
  }

  @memoized
  get activePageRequest(): Future<ReactiveDataDocument<T[]>> | null {
    return this.activePage.request;
  }

  @memoized
  get prevRequest(): Future<ReactiveDataDocument<T[]>> | null {
    return this.activePage.prev?.request ?? null;
  }

  // FIXME: Seems weird
  @memoized
  get nextRequest(): Future<ReactiveDataDocument<T[]>> | null {
    return this.activePage.next?.request ?? null;
  }

  @memoized
  get isPrevLoading(): boolean {
    return this.activePage.prev?.isLoading ?? false;
  }

  @memoized
  get isNextLoading(): boolean {
    return this.activePage.next?.isLoading ?? false;
  }

  activatePage = (page: Readonly<PageState<T, E>>): void => {
    this.activePage = page;
  };

  getPageState = (
    options: UrlPageStateCreateOptions
  ): Readonly<PageState<T, E>> => {
    const { url } = options;
    let state = this.pagesCache.get(url);

    if (!state) {
      state = new PageState<T, E>(this, options);
      this.addPage(url, state);
    }

    return state;
  };
}

defineSignal(PaginationState.prototype, 'initialPage', undefined);
defineSignal(PaginationState.prototype, 'activePage', undefined);

interface LinkSupport<T> {
  pageHints: PageHints<T>;
  loadPage: (url: string) => Promise<void>;
}

/**
 * Get the pagination state for a given request, this will return the same
 * PaginationState instance for the same request, even if the future is
 * a different instance based on the cache identity of the request.
 *
 * ```ts
 * import { getPaginationState } from '@warp-drive/ember';
 *
 * const future = store.request(query('user', { page: { size: 10 } }));
 * const state = getPaginationState(future);
 * ```
 *
 * @public
 * @static
 * @for @warp-drive/ember
 * @param future
 * @return {PaginationState}
 */
export function getPaginationState<T, E>(
  future: Future<ReactiveDataDocument<T[]>>,
  linkSupport?: LinkSupport<T> | null
): Readonly<PaginationState<T, E>> {
  let state = PaginationCache.get(future);

  if (!state) {
    state = new PaginationState<unknown, unknown>(
      future,
      (linkSupport as LinkSupport<unknown> | undefined) ?? null
    );
    PaginationCache.set(future, state);
  }

  // TODO: Clean up PaginationCache types
  return state as Readonly<PaginationState<T, E>>;
}
