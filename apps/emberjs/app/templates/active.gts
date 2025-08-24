import { pageTitle } from 'ember-page-title';

import TodoList from 'todomvc/components/todo-list';
import type ActiveTodos from 'todomvc/routes/active';
import type { RouteComponent } from 'todomvc/types/route-component';

<template>
  {{pageTitle "Active"}}

  <TodoList @todos={{@model.todos}} />
</template> satisfies RouteComponent<ActiveTodos>;
