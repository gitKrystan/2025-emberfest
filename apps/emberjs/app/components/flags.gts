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
  EditableShouldErrorFlag,
  EditableTodoCountFlag,
  ShouldErrorFlag,
  TodoCountFlag,
} from '@workspace/shared-data/types';

import { HandleError } from '#/components/design-system/error';
import { LoadingDots, LoadingSpinner } from '#/components/design-system/loading.gts';
import type Store from '#/services/store';

export const Flags = <template>
  <footer class="footer">
    <Request @query={{(queryFlags)}}>
      <:loading><LoadingSpinner /></:loading>
      <:content as |content|><FlagsContent @data={{content.data}} /></:content>
      <:error as |error|>
        <HandleError @error={{error}} @toast="Could not get query flags for Flags List." />
      </:error>
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
          <Await @promise={{this.checkoutShouldErrorFlag this.shouldErrorFlag}}>
            <:success as |flag|><UpdateShouldErrorFlag @flag={{flag}} /></:success>
            <:error as |error|><HandleError @error={{error}} /></:error>
          </Await>
        </li>
      {{/if}}
      {{#if this.initialTodoCountFlag}}
        <li>
          <Await @promise={{this.checkoutInitialTodoCountFlag this.initialTodoCountFlag}}>
            <:success as |flag|><UpdateTodoCountFlag @flag={{flag}} /></:success>
            <:error as |error|><HandleError @error={{error}} /></:error>
          </Await>
        </li>
      {{/if}}
    </ul>
  </template>

  @cached
  get initialTodoCountFlag(): TodoCountFlag | null {
    return this.args.data.find((flag) => flag.id === 'initialTodoCount') ?? null;
  }

  checkoutInitialTodoCountFlag(flag: TodoCountFlag): Promise<EditableTodoCountFlag & ReactiveResource> {
    return checkout<EditableTodoCountFlag>(flag);
  }

  @cached
  get shouldErrorFlag(): ShouldErrorFlag | null {
    return this.args.data.find((flag) => flag.id === 'shouldError') ?? null;
  }

  checkoutShouldErrorFlag(flag: ShouldErrorFlag): Promise<EditableShouldErrorFlag & ReactiveResource> {
    return checkout<EditableShouldErrorFlag>(flag);
  }
}

class UpdateShouldErrorFlag extends Component<{
  Args: { flag: EditableShouldErrorFlag & ReactiveResource };
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

class UpdateTodoCountFlag extends Component<{
  Args: { flag: EditableTodoCountFlag & ReactiveResource };
}> {
  <template>
    <UpdateFlag @flag={{@flag}} @toggle={{this.toggle}}>
      Initial Todo Count:
      {{@flag.value}}
    </UpdateFlag>
  </template>

  toggle = () => {
    this.args.flag.value =
      this.args.flag.value === TodoCountOptions.small ? TodoCountOptions.large : TodoCountOptions.small;
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
        <:loading><LoadingDots /></:loading>
        <:error as |error|>
          <HandleError @error={{error}} @toast="Could not update flag." />
        </:error>
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
