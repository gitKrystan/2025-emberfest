// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { getGlobalConfig } from '@embroider/macros/src/addon/runtime';

const ENV = {
  // match package.json#name
  // Alternatively: https://github.com/NullVoxPopuli/ember-strict-application-resolver
  APP: {},
  EmberENV: {},
  environment: import.meta.env.DEV ? 'development' : 'production',
  locationType: 'history',
  modulePrefix: 'emberjs-todomvc',
  rootURL: '/',
} as {
  APP: Record<string, unknown>;
  EmberENV: Record<string, unknown>;
  environment: string;
  locationType: 'auto' | 'hash' | 'history' | 'none';
  modulePrefix: string;
  podModulePrefix: string;
  rootURL: string;
  SERVICE_WORKER: boolean;
};

// ENV.APP.LOG_RESOLVER = true;
// ENV.APP.LOG_ACTIVE_GENERATION = true;
// ENV.APP.LOG_TRANSITIONS = true;
// ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
// ENV.APP.LOG_VIEW_LOOKUPS = true;

export default ENV;

export function enterTestMode() {
  ENV.locationType = 'none';
  ENV.APP.rootElement = '#ember-testing';
  ENV.APP.autoboot = false;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const config = getGlobalConfig()['@embroider/macros'];

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (config) config.isTesting = true;
}
