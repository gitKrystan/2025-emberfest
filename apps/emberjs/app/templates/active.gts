import { pageTitle } from 'ember-page-title';

import { Main } from '#app/components/main.gts';
import type ActiveTodos from '#routes/active';
import type { RouteComponent } from '#types/route-component';

<template>
  {{pageTitle "Active"}}

  <Main @todoFuture={{@model.todos}} />
</template> satisfies RouteComponent<ActiveTodos>;
