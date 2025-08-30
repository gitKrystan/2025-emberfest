import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';

import Filters from '#components/filters';
import type Repo from '#services/repo';

export default class Footer extends Component {
  @service declare repo: Repo;

  <template>
    <footer class="footer">
      <span class="todo-count">
        <strong>{{this.repo.remaining.length}}</strong>
        {{itemLabel this.repo.remaining.length}}
        left
      </span>

      <Filters />

      {{#if this.repo.completed.length}}
        <button
          class="clear-completed"
          type="button"
          {{on "click" this.repo.clearCompleted}}
        >
          Clear completed
        </button>
      {{/if}}
    </footer>
  </template>
}

function itemLabel(count: number) {
  if (count === 0 || count > 1) {
    return 'items';
  }

  return 'item';
}
