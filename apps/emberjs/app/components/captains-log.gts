import { service } from '@ember/service';
import Component from '@glimmer/component';
import CaptainsLogService, { EntryState } from '#/services/captains-log.ts';
import { cached } from '@glimmer/tracking';
import { assert } from '@ember/debug';

/*

'added' - A new document has been added to the cache. This occurs when a
request response creates a new document entry.

'removed' - A document has been removed from the cache. This happens when
documents are explicitly removed or garbage collected.

'updated' - An existing document in the cache has been updated with new data.
This occurs when a request updates existing cached content.

'state' - The state of a document has changed. This covers changes to the
document's metadata, loading state, or other state properties beyond just the
data content.

'invalidated' - A document has been marked as invalid/stale. This typically
happens when cache invalidation logic determines that cached data is no
longer fresh and should be refetched.

*/

export class CaptainsLog extends Component {
  <template>
    <section class="captains-log">
      <h2>Captain's Log</h2>
      <ul>
        {{#each-in this.captainsLog.log as |lid entry|}}
          <Entry @lid={{lid}} @entry={{entry}} />
        {{/each-in}}
      </ul>
    </section>
  </template>

  @service declare captainsLog: CaptainsLogService;
}

class Entry extends Component<{ Args: { lid: string; entry: EntryState } }> {
  <template>
    <li class="entry">
      <strong>{{this.pathName}}</strong>
      {{#if this.page}}- Page: {{this.page}}{{/if}}
      -
      {{@entry.latestTransition.type}}
      -
      {{@entry.loadCount}}
    </li>
  </template>

  @cached
  get decoded() {
    return decodeURIComponent(this.args.lid);
  }

  @cached
  get parts(): string[] {
    return this.decoded.split('?');
  }

  get pathName(): string {
    const ret = this.parts[0];
    assert('Path name must be defined', ret);
    return ret;
  }

  get page(): number | null {
    const params = this.parts[1];
    if (!params) {
      return null;
    }
    const urlParams = new URLSearchParams(params);
    const offset = urlParams.get('page[offset]');
    if (!offset) {
      return null;
    }
    const asNumber = parseInt(offset, 10);
    // limit === 10, so convert to page number
    return Math.floor(asNumber / 10) + 1;
  }
}
