import { pageTitle } from 'ember-page-title';

import TodoList from '#components/todo-list';
import type CompletedTodos from '#routes/completed';
import type { RouteComponent } from '#types/route-component';

<template>
  {{pageTitle "Completed"}}

  <TodoList @todos={{@model.todos}} />
</template> satisfies RouteComponent<CompletedTodos>;
