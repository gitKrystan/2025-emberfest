import Component from '@glimmer/component';
import { consume } from 'ember-provide-consume-context';

import { AppError } from '#/components/todo-app/app-error';
import type AppState from '#/util/app-state';

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

  @consume('app-state')
  declare private readonly appState: AppState;
}
