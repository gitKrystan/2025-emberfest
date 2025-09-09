/**
 * @module @warp-drive/ember
 */
import { assert } from '@warp-drive/core/build-config/macros';
import type { ReactiveDataDocument } from '@warp-drive/core/reactive';
import type { RequestState } from '@warp-drive/core/reactive';
import { getRequestState } from '@warp-drive/core/reactive';
import type { Future } from '@warp-drive/core/request';
import { defineSignal, memoized } from '@warp-drive/core/store/-private';
import type { StructuredErrorDocument } from '@warp-drive/core/types/request';

import type { PaginationState } from './pagination-state';
import { getHref } from './util';

/** @internal */
export type PageStateCreateOptions<T> =
  | UrlPageStateCreateOptions
  | FuturePageStateCreateOptions<T>;

export interface UrlPageStateCreateOptions {
  url: string;
  prev?: string | null;
  next?: string | null;
}

export interface FuturePageStateCreateOptions<T> {
  self: Future<ReactiveDataDocument<T[]>>;
  prev?: string | null;
  next?: string | null;
}

/** Manages state for a single page. */
export class PageState<T, E> {
  declare private readonly manager: PaginationState<T, E>;
  /** @internal */
  declare request: Future<ReactiveDataDocument<T[]>> | null;
  /** @internal */
  declare requestState:
    | RequestState<ReactiveDataDocument<T[]>, StructuredErrorDocument<E>>
    | undefined;
  declare _selfLink: string | null;
  get selfLink(): string | null {
    return this._selfLink;
  }
  set selfLink(selfLink: string | null) {
    this._selfLink = selfLink;
  }
  declare private readonly _prevLink: string | null;
  declare private readonly _nextLink: string | null;

  constructor(
    manager: PaginationState<T, E>,
    options: PageStateCreateOptions<T>
  ) {
    this.manager = manager;
    this._prevLink = options.prev ?? null;
    this._nextLink = options.next ?? null;
    if ('url' in options) {
      this.selfLink = options.url;
    } else {
      void this.load(options.self);
    }
  }

  /** @internal */
  @memoized
  get value(): ReactiveDataDocument<T[]> | null {
    return this.requestState?.value ?? null;
  }

  /** @internal */
  @memoized
  get isLoading(): boolean {
    return Boolean(this.requestState?.isPending);
  }

  /** @internal */
  @memoized
  get isSuccess(): boolean {
    return Boolean(this.requestState?.isSuccess);
  }

  /** @internal */
  @memoized
  get isCancelled(): boolean {
    return Boolean(this.requestState?.isCancelled);
  }

  /** @internal */
  @memoized
  get isError(): boolean {
    return Boolean(this.requestState?.isError);
  }

  /** @internal */
  @memoized
  get reason(): StructuredErrorDocument<E> | null {
    return this.requestState?.reason ?? null;
  }

  /** @internal */
  @memoized
  get prevLink(): string | null {
    return getHref(this.value?.links?.prev) ?? this._prevLink;
  }

  /** @internal */
  @memoized
  get nextLink(): string | null {
    return getHref(this.value?.links?.next) ?? this._nextLink;
  }

  /** @internal */
  @memoized
  get prev(): PageState<T, E> | null {
    const url = this.prevLink;
    return url ? this.manager.getPageState({ url, next: this.selfLink }) : null;
  }

  /** @internal */
  @memoized
  get next(): PageState<T, E> | null {
    const url = this.nextLink;
    return url ? this.manager.getPageState({ url, prev: this.selfLink }) : null;
  }

  /** @internal */
  load = async (request: Future<ReactiveDataDocument<T[]>>): Promise<void> => {
    this.request = request;
    this.requestState = getRequestState<ReactiveDataDocument<T[]>, E>(
      this.request
    );
    const { content } = await request;
    const url = getHref(content.links?.self);
    assert('Expected the page to have a self link', url);
    this.selfLink = url;
    this.manager.addPage(this.selfLink, this);
  };
}

defineSignal(PageState.prototype, 'requestState', undefined);
defineSignal(PageState.prototype, 'request', undefined);
defineSignal(PageState.prototype, 'state', undefined);
defineSignal(PageState.prototype, 'self', undefined);
defineSignal(PageState.prototype, 'selfLink', undefined);
