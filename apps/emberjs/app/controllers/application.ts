import Controller from '@ember/controller';

export default class ApplicationController extends Controller {
  queryParams = [
    'initialTodoCount',
    'shouldPaginate',
    'shouldError',
    'latency',
    'showLog',
  ];
}
