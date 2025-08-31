import type { TOC } from '@ember/component/template-only';
import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';
import { checkout } from '@warp-drive/core/reactive';
import { Await, Request } from '@warp-drive/ember';

import { queryFlags, updateFlag } from '@workspace/shared-data/builders';
import type {
  ApiFlag,
  ShouldErrorFlag as ShouldErrorFlagResource,
} from '@workspace/shared-data/types';

import { HandleError } from '#app/components/error.gts';
import { Loading } from '#components/loading.gts';
import type Store from '#services/store';

export class Flags extends Component {
  <template>
    <footer class="footer">
      <Request @request={{this.flagRequest}}>
        <:content as |result|><FlagsContent @data={{result.data}} /></:content>
        <:error as |error|><HandleError @error={{error}} /></:error>
      </Request>
    </footer>
  </template>

  @service declare private readonly store: Store;

  @cached
  private get flagRequest() {
    return this.store.request(queryFlags());
  }
}

class FlagsContent extends Component<{
  Args: { data: ApiFlag[] };
}> {
  <template>
    <ul class="filters">
      {{#if this.shouldErrorFlag}}
        <li>
          <Await @promise={{checkout this.shouldErrorFlag}}>
            <:pending><Loading /></:pending>
            {{! @glint-expect-error -- FIXME }}
            <:success as |flag|><ShouldErrorFlag @flag={{flag}} /></:success>
            <:error as |error|><HandleError @error={{error}} /></:error>
          </Await>
        </li>
      {{/if}}
    </ul>
  </template>

  @cached
  get shouldErrorFlag(): ShouldErrorFlagResource | null {
    return this.args.data.find((flag) => flag.id === 'shouldError') ?? null;
  }
}

class ShouldErrorFlag extends Component<{
  Args: { flag: ShouldErrorFlagResource };
}> {
  <template>
    <Button {{on "click" this.toggle}}>
      Should Error:
      {{@flag.value}}
      <Request @request={{this.updateRequest}}>
        <:idle>{{#if this.initiatedUpdate}}✓{{/if}}</:idle>
        <:loading><Loading /></:loading>
        <:error as |error|><HandleError @error={{error}} /></:error>
      </Request>
    </Button>
  </template>

  @service declare private readonly store: Store;

  initialValue = this.args.flag.value;

  private get initiatedUpdate() {
    return this.args.flag.value !== this.initialValue;
  }

  @cached
  private get updateRequest() {
    if (this.args.flag.value === this.initialValue) {
      return null;
    }

    return this.store.request(updateFlag(this.args.flag));
  }

  toggle = (_event: PointerEvent) => {
    this.args.flag.value = !this.args.flag.value;
  };
}

const Button = <template>
  <button type="button" ...attributes>{{yield}}</button>
</template> satisfies TOC<{
  Element: HTMLButtonElement;
  Blocks: { default: [] };
}>;
