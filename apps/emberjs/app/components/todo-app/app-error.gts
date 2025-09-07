import { HandleError } from '#/components/design-system/error';
import type AppState from '#/services/app-state';
import { service } from '@ember/service';
import Component from '@glimmer/component';

export class AppError extends Component {
  <template>
    <span class="app-state-error">⚠</span>
    <HandleError @error={{this.appState.error}}>
      <h2 class="error-message">Something went wrong.</h2>
      <p class="error-cta">Please contact TodoMVC support.</p>
    </HandleError>
  </template>

  @service declare private readonly appState: AppState;
}
