import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { cached, tracked } from '@glimmer/tracking';

import { checkout, type ReactiveResource } from '@warp-drive/core/reactive';
import { Await, Request } from '@warp-drive/ember';

import type { Store } from '@workspace/shared-data';
import { invalidateAllTodoQueries, queryFlags, updateFlag } from '@workspace/shared-data/builders';
import type {
  ApiFlag,
  EditableLatencyFlag,
  EditableShouldErrorFlag,
  EditableShouldPaginateFlag,
  EditableTodoCountFlag,
  LatencyFlag,
  ShouldErrorFlag,
  ShouldPaginateFlag,
  TodoCountFlag,
} from '@workspace/shared-data/types';

import { Button } from '#/components/design-system/button';
import { HandleError } from '#/components/design-system/error';
import { LoadingSpinner } from '#/components/design-system/loading';

export class Flags extends Component {
  <template>
    <div class="flags-container">

      <button
        type="button"
        class="flags-toggle {{if this.isOpen 'flags-open'}}"
        {{on "click" this.toggleFlags}}
        title="Open Settings"
      >
        ⌘
      </button>

      <aside class="flags {{if this.isOpen 'flags-open'}}">
        <Request @query={{(queryFlags)}}>
          <:loading><LoadingSpinner /></:loading>
          <:content as |content|><FlagsContent @data={{content.data}} /></:content>
          <:error as |error|>
            <HandleError @error={{error}} @toast="Could not get query flags for Flags List." />
          </:error>
        </Request>
      </aside>

    </div>
  </template>

  @tracked isOpen = false;

  toggleFlags = () => {
    this.isOpen = !this.isOpen;
  };
}

class FlagsContent extends Component<{
  Args: { data: ApiFlag[] };
}> {
  <template>
    <ul class="filters">

      {{#if this.initialTodoCountFlag}}
        <li>
          <Await @promise={{this.checkoutInitialTodoCountFlag this.initialTodoCountFlag}}>
            <:success as |flag|><UpdateTodoCountFlag @flag={{flag}} /></:success>
            <:error as |error|><HandleError @error={{error}} /></:error>
          </Await>
        </li>
      {{/if}}

      {{#if this.shouldPaginateFlag}}
        <li>
          <Await @promise={{this.checkoutShouldPaginateFlag this.shouldPaginateFlag}}>
            <:success as |flag|><UpdateShouldPaginateFlag @flag={{flag}} /></:success>
            <:error as |error|><HandleError @error={{error}} /></:error>
          </Await>
        </li>
      {{/if}}

      {{#if this.shouldErrorFlag}}
        <li>
          <Await @promise={{this.checkoutShouldErrorFlag this.shouldErrorFlag}}>
            <:success as |flag|><UpdateShouldErrorFlag @flag={{flag}} /></:success>
            <:error as |error|><HandleError @error={{error}} /></:error>
          </Await>
        </li>
      {{/if}}

      {{#if this.latencyFlag}}
        <li>
          <Await @promise={{this.checkoutLatencyFlag this.latencyFlag}}>
            <:success as |flag|><UpdateLatencyFlag @flag={{flag}} /></:success>
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

  @cached
  get shouldPaginateFlag(): ShouldPaginateFlag | null {
    return this.args.data.find((flag) => flag.id === 'shouldPaginateFlag') ?? null;
  }

  checkoutShouldPaginateFlag(flag: ShouldPaginateFlag): Promise<EditableShouldPaginateFlag & ReactiveResource> {
    return checkout<EditableShouldPaginateFlag>(flag);
  }

  @cached
  get latencyFlag(): LatencyFlag | null {
    return this.args.data.find((flag) => flag.id === 'latency') ?? null;
  }

  checkoutLatencyFlag(flag: LatencyFlag): Promise<EditableLatencyFlag & ReactiveResource> {
    return checkout<EditableLatencyFlag>(flag);
  }
}

class UpdateShouldErrorFlag extends Component<{
  Args: { flag: EditableShouldErrorFlag & ReactiveResource };
}> {
  <template>
    <UpdateFlag @flag={{@flag}} @toggle={{this.toggle}}>
      <span class="flag-name">Should Error:</span>
      {{@flag.value}}
    </UpdateFlag>
  </template>

  toggle = () => {
    this.args.flag.value = !this.args.flag.value;
  };
}

class UpdateShouldPaginateFlag extends Component<{
  Args: { flag: EditableShouldPaginateFlag & ReactiveResource };
}> {
  <template>
    <UpdateFlag @flag={{@flag}} @toggle={{this.toggle}} @onUpdateSuccess={{this.onUpdateSuccess}}>
      <span class="flag-name">Should Paginate:</span>
      {{@flag.value}}
    </UpdateFlag>
  </template>

  @service declare private readonly store: Store;

  toggle = () => {
    this.args.flag.value = !this.args.flag.value;
  };

  onUpdateSuccess = () => {
    invalidateAllTodoQueries(this.store);
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
    <UpdateFlag @flag={{@flag}} @toggle={{this.toggle}} @onUpdateSuccess={{this.onUpdateSuccess}}>
      <span class="flag-name">Initial Todo Count:</span>
      {{@flag.value}}
    </UpdateFlag>
  </template>

  @service declare private readonly store: Store;

  toggle = () => {
    this.args.flag.value =
      this.args.flag.value === TodoCountOptions.small ? TodoCountOptions.large : TodoCountOptions.small;
  };

  onUpdateSuccess = () => {
    invalidateAllTodoQueries(this.store);
  };
}

const LatencyOptions = {
  fast: 0,
  slow: 500,
};

class UpdateLatencyFlag extends Component<{
  Args: { flag: EditableLatencyFlag & ReactiveResource };
}> {
  <template>
    <UpdateFlag @flag={{@flag}} @toggle={{this.toggle}}>
      <span class="flag-name">Latency:</span>
      {{@flag.value}}ms
    </UpdateFlag>
  </template>

  @service declare private readonly store: Store;

  toggle = () => {
    this.args.flag.value = this.args.flag.value === LatencyOptions.fast ? LatencyOptions.slow : LatencyOptions.fast;
  };
}

class UpdateFlag extends Component<{
  Args: {
    flag: ApiFlag & ReactiveResource;
    toggle: () => void;
    onUpdateSuccess?: () => void;
  };
  Blocks: { default: [] };
}> {
  <template>
    <Button {{on "click" this.doUpdate}}>
      {{yield}}
      <Request @request={{this.updateRequest}}>
        <:idle></:idle>
        <:content>{{(this.onUpdateSuccess)}}</:content>
        <:loading><LoadingSpinner class="loading-spinner-small loading-spinner-inline" /></:loading>
        <:error as |error|>
          <HandleError @error={{error}} />
        </:error>
      </Request>
    </Button>
  </template>

  @service declare private readonly store: Store;

  onUpdateSuccess = () => {
    this.store.lifetimes.invalidateRequestsForType('flag', this.store);
    this.args.onUpdateSuccess?.();
  };

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
