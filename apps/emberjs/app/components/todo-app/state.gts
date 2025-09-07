import Component from '@glimmer/component';
import { provide } from 'ember-provide-consume-context';

import { AppError } from '#/components/todo-app/app-error';
import { Footer } from '#/components/todo-app/footer';
import AppState from '#/util/app-state';

interface Signature {
  Blocks: {
    header: [];
    main: [];
  };
}

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
      <Footer />
    {{/unless}}
  </template>

  @provide('app-state')
  private readonly appState = new AppState();
}
