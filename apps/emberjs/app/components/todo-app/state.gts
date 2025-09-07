import { service } from '@ember/service';
import Component from '@glimmer/component';

import { AppError } from '#/components/todo-app/app-error';
import type AppState from '#/services/app-state';

interface Signature {
  Blocks: {
    header: [];
    main: [];
  };
}

/**
 * The overall state container for the Todo App.
 *
 * This component is responsible for displaying:
 * - unrecoverable errors,
 * - the main app,
 * - the header,
 * - and the footer.
 */
export class TodoAppState extends Component<Signature> {
  <template>
    <section>
      {{#if this.appState.error}}
        <div class="new-todo">OH NO</div>
      {{else}}
        {{yield to="header"}}
      {{/if}}
    </section>
    <section class="main">
      {{#if this.appState.error}}
        <AppError />
      {{else}}
        {{yield to="main"}}
      {{/if}}
    </section>

    {{#unless this.appState.error}}
      {{yield to="footer"}}
    {{/unless}}
  </template>

  @service declare private readonly appState: AppState;
}
