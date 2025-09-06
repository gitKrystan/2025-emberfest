import { pageTitle } from 'ember-page-title';

import { TodoApp } from '#/components/todo-app/index';
import type ActiveTodos from '#/routes/active';
import type { RouteComponent } from '#/types/route-component';

<template>
  {{pageTitle "Active"}}

  <TodoApp @todoFuture={{@model.todos}} />
</template> satisfies RouteComponent<ActiveTodos>;
