import TodoList from '#components/todo-list';
import type AllTodos from '#routes/index.ts';
import type { RouteComponent } from '#types/route-component';

<template>
  {{#if @model.todos.length}}
    <TodoList @todos={{@model.todos}} />
  {{/if}}
</template> satisfies RouteComponent<AllTodos>;
