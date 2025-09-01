import { Request } from '@warp-drive/ember';
import { pageTitle } from 'ember-page-title';

import { HandleError } from '#components/error.gts';
import TodoList from '#components/todo-list';
import type CompletedTodos from '#routes/completed';
import type { RouteComponent } from '#types/route-component';

<template>
  {{pageTitle "Completed"}}

  <Request @request={{@model.todos}} @autorefresh={{true}}>
    <:content as |content|><TodoList @todos={{content.data}} /></:content>
    <:error as |error|><HandleError @error={{error}} /></:error>
  </Request>
</template> satisfies RouteComponent<CompletedTodos>;
