import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class ArticlesController extends Controller {
  queryParams = ['page'];

  @tracked page = 1;
}
