import 'todomvc-common/base.css';
import 'todomvc-common/base.js';
import 'todomvc-app-css/index.css';

import Application from '@ember/application';
import compatModules from '@embroider/virtual/compat-modules';
import Resolver from 'ember-resolver';
import config from '#env';

import { setDefaultBuildURLConfig } from '@workspace/shared-data';

setDefaultBuildURLConfig();

export default class App extends Application {
  // or: https://github.com/NullVoxPopuli/ember-strict-application-resolver
  modulePrefix = config.modulePrefix;
  Resolver = Resolver.withModules(compatModules);
}
