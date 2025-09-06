import { setApplication } from '@ember/test-helpers';
import { setupEmberOnerrorValidation, start as qunitStart } from 'ember-qunit';
import * as QUnit from 'qunit';
import { setup } from 'qunit-dom';

import Application from '#/app.ts';
import config, { enterTestMode } from '#/config/environment.ts';

export function start() {
  enterTestMode();
  setApplication(Application.create(config.APP));

  setup(QUnit.assert);
  setupEmberOnerrorValidation();

  qunitStart();
}
