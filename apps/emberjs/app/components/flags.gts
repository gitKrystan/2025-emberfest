import type { TOC } from '@ember/component/template-only';
import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { cached, tracked } from '@glimmer/tracking';

import { checkout, type ReactiveResource } from '@warp-drive/core/reactive';
import { Await, Request } from '@warp-drive/ember';

import { queryFlags, updateFlag } from '@workspace/shared-data/builders';
import type {
  ApiFlag,
  ShouldErrorFlag as ShouldErrorFlagResource,
  TodoCountFlag as TodoCountFlagResource,
} from '@workspace/shared-data/types';

import { HandleError } from '#components/error';
import { Loading } from '#components/loading';
import type Store from '#services/store';

export const Flags = <template>
  <footer class="footer">
    <Request @query={{(queryFlags)}}>
      <:loading><Loading /></:loading>
      <:content as |content|><FlagsContent @data={{content.data}} /></:content>
      <:error as |error|><HandleError @error={{error}} /></:error>
    </Request>
  </footer>
</template>;

class FlagsContent extends Component<{
  Args: { data: ApiFlag[] };
}> {
  <template>
    <ul class="filters">
      {{#if this.shouldErrorFlag}}
        <li>
          <Await @promise={{this.checkout this.shouldErrorFlag}}>
            <:success as |flag|><ShouldErrorFlag @flag={{flag}} /></:success>
            <:pending><Loading /></:pending>
            <:error as |error|><HandleError @error={{error}} /></:error>
          </Await>
        </li>
      {{/if}}
      {{#if this.initialTodoCountFlag}}
        <li>
          <Await @promise={{this.checkout this.initialTodoCountFlag}}>
            <:success as |flag|><TodoCountFlag @flag={{flag}} /></:success>
            <:pending><Loading /></:pending>
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

  checkout<Flag extends ApiFlag>(flag: Flag): Promise<Flag & ReactiveResource> {
    return checkout<Flag>(flag);
  }

  @cached
  get shouldErrorFlag(): ShouldErrorFlagResource | null {
    return this.args.data.find((flag) => flag.id === 'shouldError') ?? null;
  }
}

class ShouldErrorFlag extends Component<{
  Args: { flag: ShouldErrorFlagResource & ReactiveResource };
}> {
  <template>
    <UpdateFlag @flag={{@flag}} @toggle={{this.toggle}}>
      Should Error:
      {{@flag.value}}
    </UpdateFlag>
  </template>

  toggle = () => {
    this.args.flag.value = !this.args.flag.value;
  };
}

const TodoCountOptions = {
  small: 3,
  large: 100_000,
};

class TodoCountFlag extends Component<{
  Args: { flag: TodoCountFlagResource & ReactiveResource };
}> {
  <template>
    <UpdateFlag @flag={{@flag}} @toggle={{this.toggle}}>
      Initial Todo Count:
      {{@flag.value}}
    </UpdateFlag>
  </template>

  toggle = () => {
    this.args.flag.value =
      this.args.flag.value === TodoCountOptions.small
        ? TodoCountOptions.large
        : TodoCountOptions.small;
  };
}

class UpdateFlag extends Component<{
  Args: {
    flag: ApiFlag & ReactiveResource;
    toggle: () => void;
  };
  Blocks: { default: [] };
}> {
  <template>
    <Button {{on "click" this.doUpdate}}>
      {{yield}}
      <Request @request={{this.updateRequest}}>
        <:idle></:idle>
        <:loading><Loading /></:loading>
        <:error as |error|><HandleError @error={{error}} /></:error>
      </Request>
    </Button>
  </template>

  @service declare private readonly store: Store;

  @tracked didUpdate = false;
  doUpdate = (_event: PointerEvent) => {
    this.args.toggle();
    this.didUpdate = true;
  };

  @cached
  private get updateRequest() {
    if (!this.didUpdate) {
      return null;
    }
    return this.store.request(updateFlag(this.args.flag));
  }
}

const Button = <template>
  <button type="button" ...attributes>{{yield}}</button>
</template> satisfies TOC<{
  Element: HTMLButtonElement;
  Blocks: { default: [] };
}>;
