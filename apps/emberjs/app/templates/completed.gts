import { pageTitle } from 'ember-page-title';

import { Main } from '#app/components/main.gts';
import type CompletedTodos from '#routes/completed';
import type { RouteComponent } from '#types/route-component';

<template>
  {{pageTitle "Completed"}}

  <Main @todoFuture={{@model.todos}} />
</template> satisfies RouteComponent<CompletedTodos>;
