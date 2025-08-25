import { pageTitle } from 'ember-page-title';

import TodoList from '#components/todo-list';
import type ActiveTodos from '#routes/active';
import type { RouteComponent } from '#types/route-component';

<template>
  {{pageTitle "Active"}}

  <TodoList @todos={{@model.todos}} />
</template> satisfies RouteComponent<ActiveTodos>;
