import { setConfig } from '@warp-drive/core/build-config';

export function setDefaultBuildConfig(context: object) {
  setConfig(context, {
    compatWith: '5.7',
    deprecations: {},
    debug: {
      LOG_PAYLOADS: false, // data store received to update cache with
      LOG_OPERATIONS: false, // updates to cache remote state
      LOG_MUTATIONS: false, // updates to cache local state
      LOG_NOTIFICATIONS: false,
      LOG_REQUESTS: false,
      LOG_REQUEST_STATUS: false,
      LOG_IDENTIFIERS: false,
      LOG_GRAPH: false,
      LOG_INSTANCE_CACHE: false,
    },
  });
}
