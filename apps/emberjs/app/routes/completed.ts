import Route from '@ember/routing/route';
import { service } from '@ember/service';

import type Repo from '#services/repo';

export default class CompletedTodos extends Route {
  @service declare repo: Repo;

  /**
   * This should probably be renamed to "data"
   * its under active development.
   *
   * In a real app you'd use this to load your
   * _minimally required_ data to show the page.
   */
  model() {
    const repo = this.repo;

    /**
     * We use a getter so that we make evaluation
     * lazy, rather than evaluate (and detach from auto-tracking)
     * in this function
     */
    return {
      get todos() {
        return repo.completed;
      },
    };
  }
}
