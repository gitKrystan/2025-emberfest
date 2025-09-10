import Route from '@ember/routing/route';
import { service } from '@ember/service';

import { checkout, type ReactiveDataDocument } from '@warp-drive/core/reactive';

import type { Store } from '@workspace/shared-data';
import { queryFlags, updateFlag } from '@workspace/shared-data/builders';
import type {
  ApiFlag,
  EditableLatencyFlag,
  EditableShouldErrorFlag,
  EditableShouldPaginateFlag,
  EditableTodoCountFlag,
} from '@workspace/shared-data/types';

/**
 * Handles app boot and general app one-time setup things.
 */
export default class Application extends Route {
  @service declare private readonly store: Store;

  /**
   * NOTE: It would be better to have a bulk update endpoint.
   * This is just HACKS for demo!
   */
  async model(params: {
    initialTodoCount: string | undefined;
    shouldPaginate: 'true' | 'false';
    shouldError: 'true' | 'false';
    latency: string | undefined;
  }) {
    console.log(params);
    const allFlags = (await this.store.request(queryFlags())).content.data;
    const saveFlags: Promise<ApiFlag>[] = [];
    for (const flag of allFlags) {
      const param = params[flag.id];
      switch (flag.id) {
        case 'initialTodoCount':
        case 'latency': {
          const value: number | null = param ? parseInt(param, 10) : null;
          if (value !== null && value !== flag.value) {
            const editable = await checkout<
              EditableTodoCountFlag | EditableLatencyFlag
            >(flag);
            editable.value = value;

            saveFlags.push(
              this.store
                .request<ReactiveDataDocument<ApiFlag>>(updateFlag(editable))
                .then((doc) => doc.content.data)
            );
          }
          break;
        }
        case 'shouldPaginate':
        case 'shouldError': {
          const value: boolean | null =
            param === 'true' ? true : param === 'false' ? false : null;
          if (value !== null && value !== flag.value) {
            const editable = await checkout<
              EditableShouldErrorFlag | EditableShouldPaginateFlag
            >(flag);
            editable.value = value;

            saveFlags.push(
              this.store
                .request<ReactiveDataDocument<ApiFlag>>(updateFlag(editable))
                .then((doc) => doc.content.data)
            );
          }
          break;
        }
        default:
          throw new Error(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
            `Unknown flag id ${(flag as any).id}. If you hit this, you need to set up query param handling for this flag.`
          );
      }
    }

    await Promise.all(saveFlags);
  }
}
