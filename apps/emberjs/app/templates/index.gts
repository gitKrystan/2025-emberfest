import { Request } from '@warp-drive/ember';

import { HandleError } from '#components/error.gts';
import TodoList from '#components/todo-list';
import type AllTodos from '#routes/index.ts';
import type { RouteComponent } from '#types/route-component';

<template>
  <Request @request={{@model.todos}} @autorefresh={{true}}>
    <:content as |content|>
      {{#let content.data as |todos|}}
        {{#if todos.length}}
          <TodoList @todos={{todos}} />
        {{/if}}
      {{/let}}
    </:content>
    <:error as |error|><HandleError @error={{error}} /></:error>
  </Request>
</template> satisfies RouteComponent<AllTodos>;
