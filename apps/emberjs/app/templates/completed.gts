import { pageTitle } from 'ember-page-title';

import TodoList from 'todomvc/components/todo-list';
import type CompletedTodos from 'todomvc/routes/completed';
import type { RouteComponent } from 'todomvc/types/route-component';

<template>
  {{pageTitle "Completed"}}

  <TodoList @todos={{@model.todos}} />
</template> satisfies RouteComponent<CompletedTodos>;
