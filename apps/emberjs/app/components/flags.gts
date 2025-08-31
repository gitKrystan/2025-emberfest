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
  TodoCountFlag as TodoCountFlagResource,
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
      {{#if this.initialTodoCountFlag}}
        <li>
          <Await @promise={{checkout this.initialTodoCountFlag}}>
            <:pending><Loading /></:pending>
            {{! @glint-expect-error -- FIXME }}
            <:success as |flag|><TodoCountFlag @flag={{flag}} /></:success>
            <:error as |error|><HandleError @error={{error}} /></:error>
          </Await>
        </li>
      {{/if}}
    </ul>
  </template>

  @cached
  get initialTodoCountFlag(): TodoCountFlagResource | null {
    return (
      this.args.data.find((flag) => flag.id === 'initialTodoCount') ?? null
    );
  }

  @cached
  get shouldErrorFlag(): ShouldErrorFlagResource | null {
    return this.args.data.find((flag) => flag.id === 'shouldError') ?? null;
  }
}

class ShouldErrorFlag extends Component<{
  Args: { flag: ShouldErrorFlagResource };
}> {
  <template>
    <UpdateFlag @flag={{@flag}} @toggle={{this.toggle}}>
      Should Error:
      {{@flag.value}}
    </UpdateFlag>
  </template>

  toggle = (_event: PointerEvent) => {
    this.args.flag.value = !this.args.flag.value;
  };
}

const TodoCountOptions = {
  small: 3,
  large: 100_000,
};

class TodoCountFlag extends Component<{
  Args: { flag: TodoCountFlagResource };
}> {
  <template>
    <UpdateFlag @flag={{@flag}} @toggle={{this.toggle}}>
      Initial Todo Count:
      {{@flag.value}}
    </UpdateFlag>
  </template>

  toggle = (_event: PointerEvent) => {
    this.args.flag.value =
      this.args.flag.value === TodoCountOptions.small
        ? TodoCountOptions.large
        : TodoCountOptions.small;
  };
}

class UpdateFlag extends Component<{
  Args: { flag: ApiFlag; toggle: (_event: PointerEvent) => void };
  Blocks: { default: [] };
}> {
  <template>
    <Button {{on "click" @toggle}}>
      {{yield}}
      <Request @request={{this.updateRequest}}>
        <:loading><Loading /></:loading>
        <:error as |error|><HandleError @error={{error}} /></:error>
      </Request>
    </Button>
  </template>

  @service declare private readonly store: Store;

  @cached
  private get updateRequest() {
    return this.store.request(updateFlag(this.args.flag));
  }
}

const Button = <template>
  <button type="button" ...attributes>{{yield}}</button>
</template> satisfies TOC<{
  Element: HTMLButtonElement;
  Blocks: { default: [] };
}>;
