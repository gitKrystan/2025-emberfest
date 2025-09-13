import { registerDestructor } from '@ember/destroyable';
import type Owner from '@ember/owner';
import Service from '@ember/service';
import { service } from '@ember/service';
import { TrackedMap } from 'tracked-built-ins';

import type {
  DocumentCacheOperation,
  DocumentOperationCallback,
} from '@warp-drive/core/store/-private/managers/notification-manager';

import type { Store } from '@workspace/shared-data';

export default class CaptainsLog extends Service {
  @service declare private readonly store: Store;

  log = new TrackedMap<string, State>();

  docOpCallback: DocumentOperationCallback = (cacheKey, notificationType) => {
    console.log('CaptainsLog', cacheKey.lid, notificationType);
    this.log.set(cacheKey.lid, { latestOp: notificationType, loadCount: 0 });
  };

  setup() {
    const subscriptionToken = this.store.notifications.subscribe(
      'document',
      this.docOpCallback
    );

    registerDestructor(this, () => {
      this.store.notifications.unsubscribe(subscriptionToken);
    });
  }
}

class State {
  currentOp: DocumentCacheOperation;
  loadCount = 0;

  constructor(currentOp: DocumentCacheOperation) {
    this.currentOp = currentOp;
  }
}
