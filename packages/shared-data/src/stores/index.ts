import { CacheHandler, Fetch, RequestManager, Store } from '@warp-drive/core';
import {
  instantiateRecord,
  registerDerivations,
  SchemaService,
  teardownRecord,
} from '@warp-drive/core/reactive';
import { DefaultCachePolicy } from '@warp-drive/core/store';
import type {
  CacheCapabilitiesManager,
  ResourceKey,
} from '@warp-drive/core/types';
import { JSONAPICache } from '@warp-drive/json-api';
import { Gate } from '@warp-drive/utilities/handlers';

import { ApiHandler, useApiHandler } from '../handlers/api.ts';
import { FlagSchema } from '../schemas/flag.ts';
import { TodoSchema } from '../schemas/todo.ts';

export default class AppStore extends Store {
  requestManager = new RequestManager()
    .use([
      // Use `APIHandler` if `useApiHandler` returns true
      new Gate(ApiHandler, useApiHandler),
      // APIHandler calls `next()` to pass the request to `fetch`
      Fetch,
    ])
    .useCache(CacheHandler);

  lifetimes = new DefaultCachePolicy({
    apiCacheHardExpires: 15 * 60 * 1000, // 15 minutes
    apiCacheSoftExpires: 1 * 30 * 1000, // 30 seconds
  });

  createCache(capabilities: CacheCapabilitiesManager) {
    return new JSONAPICache(capabilities);
  }

  createSchemaService() {
    const schema = new SchemaService();
    schema.registerResources([FlagSchema, TodoSchema]);
    registerDerivations(schema);
    return schema;
  }

  instantiateRecord(key: ResourceKey, createArgs?: Record<string, unknown>) {
    return instantiateRecord(this, key, createArgs);
  }

  teardownRecord(record: unknown): void {
    teardownRecord(record);
  }
}
