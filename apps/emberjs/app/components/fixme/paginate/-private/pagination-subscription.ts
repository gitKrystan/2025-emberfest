/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/method-signature-style */
/* eslint-disable @typescript-eslint/prefer-destructuring */
/* eslint-disable @typescript-eslint/prefer-readonly */
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

import { getPaginationState, type PaginationState } from './pagination-state';

interface ErrorFeatures {
  isHidden: boolean;
  isOnline: boolean;
  retry: () => Promise<void>;
}

type ContentFeatures<T> = {
  // Initial Request
  isOnline: boolean;
  isHidden: boolean;
  isRefreshing: boolean;
  refresh: () => Promise<void>;
  reload: () => Promise<void>;
  abort?: () => void;
  latestRequest?: Future<ReactiveDataDocument<T[]>>;

  // Pagination
  loadNext?: () => Promise<void>;
  loadPrev?: () => Promise<void>;
  loadPage?: (url: string) => Promise<void>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface PaginationSubscription<T, E> {
  /**
   * The method to call when the component this subscription is attached to
   * unmounts.
   */
  [DISPOSE](): void;
}

/**
 * A reactive class
 *
 * @hideconstructor
 */
export class PaginationSubscription<T, E> {
  /** @internal */
  declare private isDestroyed: boolean;
  /** @internal */
  declare private _subscribedTo: object | null;
  /** @internal */
  declare private _args: SubscriptionArgs<ReactiveDataDocument<T[]>, E>;
  /** @internal */
  declare store: Store | RequestManager;

  constructor(
    store: Store | RequestManager,
    args: SubscriptionArgs<ReactiveDataDocument<T[]>, E>
  ) {
    this._args = args;
    this.store = store;
    this.isDestroyed = false;
    this[DISPOSE] = _DISPOSE;
  }

  @memoized
  get isIdle(): boolean {
    return this._requestSubscription.isIdle;
  }

  /**
   * Retry the request, reloading it from the server.
   */
  retry = async (): Promise<void> => {
    await this._requestSubscription.retry();
  };

  /**
   * Refresh the request, updating it in the background.
   */
  refresh = async (): Promise<void> => {
    await this._requestSubscription.refresh();
  };

  /**
   * Loads the prev page based on links.
   */
  loadPrev = async (): Promise<void> => {
    const { prev } = this.paginationState;
    if (prev) {
      await this.loadPage(prev);
    }
  };

  /**
   * Loads the next page based on links.
   */
  loadNext = async (): Promise<void> => {
    const { next } = this.paginationState;
    if (next) {
      await this.loadPage(next);
    }
  };

  /**
   * Loads a specific page by its URL.
   */
  loadPage = async (url: string): Promise<void> => {
    const page = this.paginationState.getPageState({ self: url });
    this.paginationState.activatePage(page);
    if (!page.request) {
      const request = this.store.request<ReactiveDataDocument<T[]>>({
        method: 'GET',
        url,
      });
      await page.load(request);
    }
  };

  /**
   * Error features to yield to the error slot of a component
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
   */
  @memoized
  get contentFeatures(): ContentFeatures<T> {
    const contentFeatures = this._requestSubscription.contentFeatures;
    const feat: ContentFeatures<T> = {
      ...contentFeatures,
      loadPrev: this.loadPrev,
      loadNext: this.loadNext,
      loadPage: this.loadPage,
    };

    if (feat.isRefreshing) {
      feat.abort = () => {
        contentFeatures.latestRequest?.abort();
      };
    }

    return feat;
  }

  /**
   * @internal
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

  @memoized
  get request(): Future<ReactiveDataDocument<T[]>> {
    return this._requestSubscription.request;
  }

  @memoized
  get paginationState(): PaginationState<T, E> {
    return getPaginationState<T, E>(this.request);
  }
}

export function createPaginationSubscription<T, E>(
  store: Store | RequestManager,
  args: SubscriptionArgs<ReactiveDataDocument<T[]>, E>
): PaginationSubscription<T, E> {
  return new PaginationSubscription(store, args);
}

interface PrivatePaginationSubscription {
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
