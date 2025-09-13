import { service } from '@ember/service';
import Component from '@glimmer/component';
import CaptainsLogService from '#/services/captains-log.ts';

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

export default class CaptainsLog extends Component {
  <template>
    <section class="captains-log">
      <h2>Captain's Log</h2>
      <ul>
        {{#each-in this.captainsLog.log as |lid entry|}}
          <li class="entry">
            {{lid}}
            -
            {{entry.latestOp}}
            -
            {{entry.loadCount}}
          </li>
        {{/each-in}}
      </ul>
    </section>
  </template>

  @service declare captainsLog: CaptainsLogService;
}
