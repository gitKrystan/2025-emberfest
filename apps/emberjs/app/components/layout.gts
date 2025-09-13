import type { TOC } from '@ember/component/template-only';
import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';

import { Request } from '@warp-drive/ember';

import { queryFlags } from '@workspace/shared-data/builders';
import type { ApiFlag } from '@workspace/shared-data/types';

import { Attribution } from '#/components/attribution';
import { Flags } from '#/components/flags';
import CaptainsLog from '#/components/captains-log';

interface Signature {
  Blocks: {
    default: [];
  };
}

export const Layout = <template>
  <section><Flags /></section>

  <main class="todoapp">
    <header class="header">
      <h1>
        todos

        <Request @query={{(queryFlags)}} @autorefresh={{true}} @autorefreshBehavior="refresh">
          <:content as |content|><EnterpriseEdition @data={{content.data}} /></:content>
        </Request>
      </h1>

    </header>

    {{yield}}
  </main>

  <footer class="info"><Attribution /></footer>

  <CaptainsLog />
</template> satisfies TOC<Signature>;

class EnterpriseEdition extends Component<{
  Args: { data: ApiFlag[] };
}> {
  <template>
    {{#if this.shouldPaginate}}
      <div class="enterprise-edition"><span>Enterprise Edition</span></div>
    {{/if}}
  </template>

  @cached
  get shouldPaginate(): boolean {
    const flag = this.args.data.find((flag) => flag.id === 'shouldPaginate');
    return flag?.value ?? false;
  }
}
