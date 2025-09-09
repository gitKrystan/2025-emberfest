import type { RequestManager, Store } from '@warp-drive/core';
import type { ReactiveDataDocument } from '@warp-drive/core/reactive';
import type { Future } from '@warp-drive/core/request';
import type {
  RequestSubscription,
  SubscriptionArgs,
} from '@warp-drive/core/store/-private';
import {
  createRequestSubscription,
  DISPOSE,
  memoized,
} from '@warp-drive/core/store/-private';
import type { RequestInfo } from '@warp-drive/core/types/request';

import type { PageHints } from './pagination-links';
import { getPaginationState, type PaginationState } from './pagination-state';

/** @public Features exposed to error slot. */
export interface ErrorFeatures {
  isHidden: boolean;
  isOnline: boolean;
  /**
   * Retry the request, reloading it from the server.
   */
  retry: () => Promise<void>;
}

/** @public Features exposed to content slot. */
export interface ContentFeatures<RT> {
  isOnline: boolean;
  isHidden: boolean;
  isRefreshing: boolean;
  refresh: () => Promise<void>;
  reload: () => Promise<void>;
  abort?: () => void;
  latestRequest?: Future<RT>;

  // Pagination
  /** Load next page, if any, based on links. */
  loadNext: (() => Promise<void>) | null;
  /** Load previous page, if any, based on links. */
  loadPrev: (() => Promise<void>) | null;
  /** Load specific page by URL. */
  loadPage: (url: string) => Promise<void>;
}

/**
 * Wrapper for RequestSubscription.
 *
 * Manages lifecycle and integrates with WarpDrive.
 *
 * @hideconstructor
 */
export class PaginationSubscription<T, E> {
  /** @internal */
  declare private readonly isDestroyed: boolean;
  /** @internal */
  declare private readonly _subscribedTo: object | null;
  /** @internal */
  declare private readonly _args: SubscriptionArgs<
    ReactiveDataDocument<T[]>,
    E
  >;
  /** @internal */
  declare store: Store | RequestManager;
  get requestInfo(): RequestInfo<ReactiveDataDocument<T[]>> | null {
    if (!this._args.request) {
      return null;
    }
    // TODO @runspired
    // @ts-expect-error HACKS: We probably need to pass the actual builder
    // so we can extract cache settings.
    // This hack assumes DefaultCachePolicy
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const requestInfo = this.store.cache.peekRequest(
      this._args.request.lid
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    ).request;
    return requestInfo as RequestInfo<ReactiveDataDocument<T[]>>;
  }

  constructor(
    store: Store | RequestManager,
    args: SubscriptionArgs<ReactiveDataDocument<T[]>, E>
  ) {
    this._args = args;
    this.store = store;
    this.isDestroyed = false;
    (this as unknown as PrivatePaginationSubscription)[DISPOSE] = _DISPOSE;
  }

  /** @internal */
  @memoized
  get isIdle(): boolean {
    return this._requestSubscription.isIdle;
  }

  /**
   * Loads the prev page based on links.
   *
   * @private Exposed via `this.contentFeatures`.
   */
  private get loadPrev(): (() => Promise<void>) | null {
    const { prev } = this.paginationState;
    if (prev) {
      return () => this.loadPage(prev);
    }
    return null;
  }

  /**
   * Loads the next page based on links.
   *
   * @private Exposed via `this.contentFeatures`.
   */
  private get loadNext(): (() => Promise<void>) | null {
    const { next } = this.paginationState;
    if (next) {
      return () => this.loadPage(next);
    }
    return null;
  }

  /**
   * Loads a specific page by its URL.
   *
   * @private Exposed via `this.contentFeatures`
   */
  private readonly loadPage = async (url: string): Promise<void> => {
    const page = this.paginationState.getPageState({ url });
    if (!page.request || page.isError || page.isCancelled) {
      const request = this.store.request<ReactiveDataDocument<T[]>>({
        ...(this.requestInfo ?? {}),
        method: 'GET',
        url,
      });
      await page.load(request);
    }
    this.paginationState.activatePage(page);
  };

  /**
   * Error features to yield to the error slot of a component
   *
   * @internal
   */
  @memoized
  get errorFeatures(): ErrorFeatures {
    return {
      isHidden: this._requestSubscription.isHidden,
      isOnline: this._requestSubscription.isOnline,
      retry: this._requestSubscription.retry,
    };
  }

  /**
   * Content features to yield to the content slot of a component
   *
   * @internal
   */
  @memoized
  get contentFeatures(): ContentFeatures<ReactiveDataDocument<T[]>> {
    const { contentFeatures } = this._requestSubscription;
    const feat: ContentFeatures<ReactiveDataDocument<T[]>> = {
      ...contentFeatures,
      loadPrev: this.loadPrev,
      loadNext: this.loadNext,
      loadPage: this.loadPage,
      latestRequest: contentFeatures.latestRequest,
    };

    if (feat.isRefreshing) {
      feat.abort = () => {
        contentFeatures.latestRequest?.abort();
      };
    }

    return feat;
  }

  /**
   * @private
   */
  @memoized
  get _requestSubscription(): RequestSubscription<
    ReactiveDataDocument<T[]>,
    E
  > {
    return createRequestSubscription<ReactiveDataDocument<T[]>, E>(
      this.store,
      this._args
    );
  }

  /** @private */
  @memoized
  get request(): Future<ReactiveDataDocument<T[]>> {
    return this._requestSubscription.request;
  }

  /** @internal */
  @memoized
  get paginationState(): Readonly<PaginationState<T, E>> {
    return getPaginationState<T, E>(
      this.request,
      // TODO: Types
      (this._args as { pageHints: PageHints<T> | undefined }).pageHints
        ? {
            loadPage: this.loadPage,
            pageHints: (this._args as { pageHints: PageHints<T> }).pageHints,
          }
        : null
    );
  }
}

export function createPaginationSubscription<T, E>(
  store: Store | RequestManager,
  args: SubscriptionArgs<ReactiveDataDocument<T[]>, E>
): PaginationSubscription<T, E> {
  return new PaginationSubscription(store, args);
}

interface PrivatePaginationSubscription {
  /**
   * The method to call when the component this subscription is attached to
   * unmounts.
   */
  [DISPOSE]: () => void;
  isDestroyed: boolean;
  _requestSubscription: RequestSubscription<unknown, unknown>;
}

function upgradeSubscription(sub: unknown): PrivatePaginationSubscription {
  return sub as PrivatePaginationSubscription;
}

function _DISPOSE<T, E>(this: PaginationSubscription<T, E>) {
  const self = upgradeSubscription(this);
  self.isDestroyed = true;
  self._requestSubscription[DISPOSE]();
}
