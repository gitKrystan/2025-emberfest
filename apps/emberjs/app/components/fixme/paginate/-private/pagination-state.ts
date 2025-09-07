/* eslint-disable @typescript-eslint/array-type */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */

/**
 * @module @warp-drive/ember
 */
import { assert } from '@warp-drive/core/build-config/macros';
import type { ReactiveDataDocument } from '@warp-drive/core/reactive';
import type { RequestState } from '@warp-drive/core/reactive';
import { getRequestState } from '@warp-drive/core/reactive';
import type { Future } from '@warp-drive/core/request';
import { defineSignal, memoized } from '@warp-drive/core/store/-private';
import type { RequestLoadingState } from '@warp-drive/core/store/-private/new-core-tmp/request-state';
import type { StructuredErrorDocument } from '@warp-drive/core/types/request';
import type { Link } from '@warp-drive/core/types/spec/json-api-raw';

// TODO: Make generic?
const PaginationCache = new WeakMap<
  Future<unknown>,
  PaginationState<unknown, unknown>
>();

function getHref(link?: Link | null): string | null {
  if (!link) {
    return null;
  }
  if (typeof link === 'string') {
    return link;
  }
  return link.href;
}

type PageStateCreateOptions<T> = {
  self: Future<ReactiveDataDocument<T[]>> | string;
  prev?: string | null;
  next?: string | null;
};

export class PageState<T, E> {
  declare manager: PaginationState<T, E>;
  declare request: Future<ReactiveDataDocument<T[]>> | null;
  declare state: Readonly<
    RequestState<ReactiveDataDocument<T[]>, StructuredErrorDocument<E>>
  >;
  declare selfLink: string | null;
  declare _prevLink: string | null;
  declare _nextLink: string | null;

  constructor(
    manager: PaginationState<T, E>,
    options: PageStateCreateOptions<T>
  ) {
    this.manager = manager;
    this._prevLink = options.prev ?? null;
    this._nextLink = options.next ?? null;
    if (typeof options.self === 'string') {
      this.selfLink = options.self;
    } else {
      void this.load(options.self);
      void options.self.then((value) => {
        const { content } = value;
        const url = getHref(content?.links?.self);
        assert('Expected the page to have a self link', url);
        this.selfLink = url;
        this.manager.pagesCache.set(this.selfLink, this);
      });
    }
  }

  @memoized
  get value(): ReactiveDataDocument<T[]> | null {
    return this.state?.value;
  }

  @memoized
  get isLoading(): boolean {
    return this.state.isPending;
  }

  @memoized
  get isSuccess(): boolean {
    return this.state.isSuccess;
  }

  @memoized
  get isCancelled(): boolean {
    return this.state.isCancelled;
  }

  @memoized
  get isError(): boolean {
    return this.state.isError;
  }

  @memoized
  get reason(): StructuredErrorDocument<E> | null {
    return this.state?.reason;
  }

  @memoized
  get prevLink(): string | null {
    return getHref(this.value?.links?.prev) ?? this._prevLink;
  }

  @memoized
  get nextLink(): string | null {
    return getHref(this.value?.links?.next) ?? this._nextLink;
  }

  @memoized
  get prev(): PageState<T, E> | null {
    const url = this.prevLink;
    return url
      ? this.manager.getPageState({ self: url, next: this.selfLink })
      : null;
  }

  @memoized
  get next(): PageState<T, E> | null {
    const url = this.nextLink;
    return url
      ? this.manager.getPageState({ self: url, prev: this.selfLink })
      : null;
  }

  load = async (request: Future<ReactiveDataDocument<T[]>>): Promise<void> => {
    this.request = request;
    this.state = getRequestState<ReactiveDataDocument<T[]>, E>(this.request);
    await this.request;
  };
}

defineSignal(PageState.prototype, 'request', undefined);
defineSignal(PageState.prototype, 'state', undefined);
defineSignal(PageState.prototype, 'self', undefined);

export class PaginationState<T, E> {
  declare initialPage: Readonly<PageState<T, E>>;
  declare activePage: Readonly<PageState<T, E>>;
  declare pagesCache: Map<string, PageState<T, E>>;

  constructor(request: Future<ReactiveDataDocument<T[]>>) {
    this.pagesCache = new Map<string, PageState<T, E>>();
    this.initialPage = new PageState<T, E>(this, { self: request });
    this.activePage = this.initialPage;
  }

  @memoized
  get isLoading(): boolean {
    return this.initialPage.isLoading;
  }

  get loadingState(): RequestLoadingState {
    throw new Error('Not implemented yet');
  }

  @memoized
  get isSuccess(): boolean {
    return this.initialPage.isSuccess;
  }

  @memoized
  get isCancelled(): boolean {
    return this.initialPage.isCancelled;
  }

  @memoized
  get isError(): boolean {
    return this.initialPage.isError;
  }

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
  get prevPages(): Readonly<PageState<T, E>[]> {
    const pages = [];
    let page = this.activePage?.prev;
    while (page) {
      pages.unshift(page);
      page = page.prev;
    }
    return pages;
  }

  @memoized
  get nextPages(): Readonly<PageState<T, E>[]> {
    const pages = [];
    let page = this.activePage?.next;
    while (page) {
      pages.push(page);
      page = page.next;
    }
    return pages;
  }

  @memoized
  get pages(): Readonly<PageState<T, E>[]> {
    if (!this.activePage) return [];

    return [...this.prevPages, this.activePage, ...this.nextPages];
  }

  @memoized
  get data(): T[] {
    if (!this.pages) return [];

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
    return this.firstPage.prevLink;
  }

  @memoized
  get next(): string | null {
    return this.lastPage.nextLink;
  }

  @memoized
  get activePageRequest(): Future<ReactiveDataDocument<T[]>> | null {
    return this.activePage.request;
  }

  // FIXME: Seems weird
  @memoized
  get prevRequest(): Future<ReactiveDataDocument<T[]>> | null {
    if (!this.firstPage) return null;

    return this.firstPage.request;
  }

  // FIXME: Seems weird
  @memoized
  get nextRequest(): Future<ReactiveDataDocument<T[]>> | null {
    if (!this.lastPage) return null;

    return this.lastPage.request;
  }

  activatePage = (page: Readonly<PageState<T, E>>): void => {
    this.activePage = page;
  };

  getPageState = (
    options: PageStateCreateOptions<T> & { self: string }
  ): Readonly<PageState<T, E>> => {
    const url = options.self;
    let state = this.pagesCache.get(url);

    if (!state) {
      state = new PageState<T, E>(this, options);
      this.pagesCache.set(url, state);
    }

    return state;
  };
}

defineSignal(PaginationState.prototype, 'initialPage', undefined);
defineSignal(PaginationState.prototype, 'activePage', undefined);

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
  future: Future<ReactiveDataDocument<T[]>>
): Readonly<PaginationState<T, E>> {
  let state = PaginationCache.get(future);

  if (!state) {
    state = new PaginationState<unknown, unknown>(future);
    PaginationCache.set(future, state);
  }

  // TODO: Clean up PaginationCache types
  return state as Readonly<PaginationState<T, E>>;
}
