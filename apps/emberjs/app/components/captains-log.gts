import { assert } from '@ember/debug';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';

import type { EntryState } from '#/services/captains-log.ts';
import type CaptainsLogService from '#/services/captains-log.ts';

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

export class CaptainsLog extends Component<{ Args: { showPages: boolean } }> {
  <template>
    <section class="captains-log">
      <h2>Captain's Log</h2>
      <ul>
        {{#each-in this.captainsLog.log as |lid entry|}}
          <Entry @lid={{lid}} @entry={{entry}} @showPages={{@showPages}} />
        {{/each-in}}
      </ul>
    </section>
  </template>

  @service declare captainsLog: CaptainsLogService;
}

class Entry extends Component<{ Args: { lid: string; entry: EntryState; showPages: boolean } }> {
  <template>
    <li class="entry">
      <span class="path-name"><strong>{{this.pathName}}</strong></span>

      <span class="filter">{{#if this.filter}}{{this.filter}}{{/if}}</span>

      {{#if @showPages}}
        <span class="page">{{#if this.page}}<strong>Page:</strong> {{this.page}}{{/if}}</span>
      {{/if}}

      <span class="load-count"><strong>Fetches:</strong> {{@entry.loadCount}}</span>

      <span class="state"><strong>State:</strong> {{@entry.latestTransition.type}}</span>
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
    const [pathName] = this.parts;
    assert('Path name must be defined', pathName);
    return pathName;
  }

  @cached
  get params(): URLSearchParams | null {
    const [_pathName, params] = this.parts;
    if (!params) {
      return null;
    }
    return new URLSearchParams(params);
  }

  get page(): number | null {
    const { params } = this;
    if (!params) {
      return null;
    }
    const offset = params.get('page[offset]');
    if (!offset) {
      return null;
    }
    const asNumber = parseInt(offset, 10);
    // limit === 10, so convert to page number
    return Math.floor(asNumber / 10) + 1;
  }

  get filter(): string | null {
    const { params } = this;
    if (!params) {
      return null;
    }
    const param = params.get('filter[completed]');
    return param === 'true' ? '(completed)' : param === 'false' ? '(active)' : null;
  }
}
