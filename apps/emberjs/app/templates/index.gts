import { Main } from '#app/components/main.gts';
import type AllTodos from '#routes/index';
import type { RouteComponent } from '#types/route-component';

<template>
  <Main @todoFuture={{@model.todos}} />
</template> satisfies RouteComponent<AllTodos>;
