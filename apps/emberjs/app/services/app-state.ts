import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class AppState extends Service {
  @tracked private _isSaving = false;
  get isSaving() {
    return this._isSaving;
  }

  readonly onSaveStart = () => {
    if (!this._isSaving) {
      this._isSaving = true;
    }
  };

  readonly onSaveEnd = () => {
    if (this._isSaving) {
      this._isSaving = false;
    }
  };
}
