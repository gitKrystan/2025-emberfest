import { pageTitle } from 'ember-page-title';

import { TodoApp } from '#/components/todo-app/index';
import type CompletedTodos from '#/routes/completed';
import type { RouteComponent } from '#/types/route-component';

<template>
  {{pageTitle "Completed"}}

  <TodoApp @todoFuture={{@model.todos}} />
</template> satisfies RouteComponent<CompletedTodos>;
