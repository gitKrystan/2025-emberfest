import type { TOC } from '@ember/component/template-only';

import { Attribution } from '#components/attribution';
import { Flags } from '#components/flags';

interface Signature {
  Blocks: {
    default: [];
  };
}

export const Layout = <template>
  <section><Flags /></section>

  <main class="todoapp">
    <header class="header"><h1>todos</h1></header>

    {{yield}}
  </main>

  <footer class="info"><Attribution /></footer>
</template> satisfies TOC<Signature>;
