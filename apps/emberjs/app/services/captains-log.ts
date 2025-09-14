import { assert } from '@ember/debug';
import { registerDestructor } from '@ember/destroyable';
import Service from '@ember/service';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { runTask } from 'ember-lifeline';
import { TrackedMap } from 'tracked-built-ins';

import type {
  DocumentCacheOperation,
  DocumentOperationCallback,
} from '@warp-drive/core/store/-private/managers/notification-manager';

import type { Store } from '@workspace/shared-data';

export default class CaptainsLog extends Service {
  @service declare private readonly store: Store;

  log = new TrackedMap<string, EntryState>();

  docOpCallback: DocumentOperationCallback = (cacheKey, notificationType) => {
    if (!cacheKey.lid.startsWith('/api/todo')) {
      console.log('UNHANDLED', cacheKey.lid, notificationType);
      return;
    }

    if (notificationType === 'removed') {
      console.log(`Removed: ${cacheKey.lid}`);
      this.log.delete(cacheKey.lid);
    }

    const existingState = this.log.get(cacheKey.lid);
    if (existingState) {
      // Transition to new operation
      existingState.transition(notificationType);
    } else {
      // Create new state tracking
      this.log.set(
        cacheKey.lid,
        new EntryState(cacheKey.lid, notificationType)
      );
    }
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

type TransitionType =
  | 'loading' // initial load started
  | 'loaded' // initial load complete
  | 'invalidated' // document marked stale
  | 'refreshing' // stale document refreshed with new data
  | 'updated' // document content updated
  | 'redundant'; // same operation repeated

interface Transition {
  fromOp: DocumentCacheOperation | null;
  toOp: DocumentCacheOperation;
  type: TransitionType | null;
  description: string;
}

/*



HACKY STATE MACHINE TO LOG ALL LOADING STATES FOR CACHED TODO DOCUMENTS




*/

const TRANSITIONS = new Map<string, TransitionType | null>([
  // From null (initial state)
  ['null→added', null],
  ['null→invalidated', null],
  ['null→state', 'loading'],
  ['null→updated', null],

  // From 'added'
  ['added→added', 'redundant'],
  ['added→invalidated', 'invalidated'],
  ['added→state', 'redundant'],
  ['added→updated', 'updated'],

  // From 'updated'
  ['updated→added', null],
  ['updated→invalidated', 'invalidated'],
  ['updated→state', 'redundant'],
  ['updated→updated', 'redundant'],

  // From 'state'
  ['state→added', 'loaded'],
  ['state→invalidated', 'invalidated'],
  ['state→state', 'redundant'],
  ['state→updated', 'updated'],

  // From 'invalidated'
  ['invalidated→added', null],
  ['invalidated→invalidated', 'redundant'],
  ['invalidated→state', 'refreshing'],
  ['invalidated→updated', 'updated'],
]);

const DESCRIPTIONS = new Map<TransitionType, string>([
  ['invalidated', 'Document marked as stale/invalid'],
  ['loading', 'Document first loaded into cache'],
  ['redundant', 'Same operation repeated'],
  ['refreshing', 'Stale document refreshed with new data'],
  ['updated', 'Deleted document re-added to cache'],
  ['updated', 'Document content was updated'],
]);

function classifyTransition(
  fromOp: DocumentCacheOperation | null,
  toOp: DocumentCacheOperation
): Transition {
  const key = `${fromOp ?? 'null'}→${toOp}`;
  const type = TRANSITIONS.get(key) ?? null;
  const description = type ? DESCRIPTIONS.get(type) : 'Unexpected transition';
  assert('Description should be defined', description);

  return { fromOp, toOp, type, description };
}

export class EntryState {
  lid: string;
  @tracked latestOp: DocumentCacheOperation | null = null;
  @tracked latestTransition: Transition | null = null;

  @tracked loadCount = 0;

  constructor(lid: string, currentOp: DocumentCacheOperation) {
    this.lid = lid;

    // Record initial transition
    this.transition(currentOp);
  }

  transition(toOp: DocumentCacheOperation): Transition {
    const transition = classifyTransition(this.latestOp, toOp);
    if (transition.type === 'redundant') {
      console.warn(
        `[${Date.now()}] Transition ${this.lid}: ${transition.fromOp} → ${transition.toOp} (REDUNDANT)`
      );
      assert('Expected latestTransition to be defined', this.latestTransition);
      return this.latestTransition;
    }
    if (transition.type === null) {
      console.error(
        `[${Date.now()}] Transition ${this.lid}: ${transition.fromOp} → ${transition.toOp} (UNKNOWN TRANSITION)`
      );
      assert('Expected latestTransition to be defined', this.latestTransition);
      return this.latestTransition;
    }
    runTask(
      this,
      () => {
        this.latestTransition = transition;
        this.latestOp = toOp;

        if (transition.type === 'loading' || transition.type === 'refreshing') {
          this.loadCount++;
        }

        console.log(
          `[${Date.now()}] Transition ${this.lid}: ${transition.fromOp} → ${transition.toOp} (${transition.type})`
        );
      },
      0
    );

    return transition;
  }
}
