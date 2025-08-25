import Route from '@ember/routing/route';
import { service } from '@ember/service';

import type Repo from '#services/repo';

/**
 * Handles app boot and general app one-time setup things.
 */
export default class Application extends Route {
  @service declare repo: Repo;

  beforeModel() {
    /**
     * Load from localStorage
     */
    this.repo.load();
  }
}
