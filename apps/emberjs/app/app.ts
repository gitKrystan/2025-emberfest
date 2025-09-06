import 'todomvc-common/base.css';
// import 'todomvc-common/base.js';
import 'todomvc-app-css/index.css';
import '@warp-drive/ember/install';
import '#/styles/app.css';

import Application from '@ember/application';
import compatModules from '@embroider/virtual/compat-modules';
import Resolver from 'ember-resolver';

import { setDefaultBuildURLConfig } from '@workspace/shared-data';

import config from '#env';

setDefaultBuildURLConfig();

export default class App extends Application {
  // or: https://github.com/NullVoxPopuli/ember-strict-application-resolver
  modulePrefix = config.modulePrefix;
  Resolver = Resolver.withModules(compatModules);
}
