import { Request } from '@warp-drive/ember';
import { pageTitle } from 'ember-page-title';

import { HandleError } from '#components/error.gts';
import TodoList from '#components/todo-list.gts';
import type ActiveTodos from '#routes/active';
import type { RouteComponent } from '#types/route-component';

<template>
  {{pageTitle "Active"}}

  <Request @request={{@model.todos}}>
    <:content as |content|><TodoList @todos={{content.data}} /></:content>
    <:error as |error|><HandleError @error={{error}} /></:error>
  </Request>
</template> satisfies RouteComponent<ActiveTodos>;
