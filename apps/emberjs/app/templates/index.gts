import TodoList from 'todomvc/components/todo-list';
import type AllTodos from 'todomvc/routes';
import type { RouteComponent } from 'todomvc/types/route-component';

<template>
  {{#if @model.todos.length}}
    <TodoList @todos={{@model.todos}} />
  {{/if}}
</template> satisfies RouteComponent<AllTodos>;
