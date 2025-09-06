import { TodoApp } from '#/components/todo-app/index';
import type AllTodos from '#/routes/index';
import type { RouteComponent } from '#/types/route-component';

<template><TodoApp @todoFuture={{@model.todos}} /></template> satisfies RouteComponent<AllTodos>;
