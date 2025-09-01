import { service } from '@ember/service';
import Component from '@glimmer/component';

import { Attribution } from '#components/attribution';
import { Create } from '#components/create';
import { Flags } from '#components/flags';
import { Footer } from '#components/footer';
import type Store from '#services/store';

interface Signature {
  Blocks: {
    default: [];
  };
}

export class Layout extends Component<Signature> {
  @service declare private readonly store: Store;

  <template>
    <section><Flags /></section>

    <main class="todoapp">
      <header class="header"><h1>todos</h1></header>
      <section><Create /></section>

      {{yield}}

      <Footer />
    </main>

    <footer class="info"><Attribution /></footer>
  </template>
}
