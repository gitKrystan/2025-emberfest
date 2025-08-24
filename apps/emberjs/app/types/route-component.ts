import Route from '@ember/routing/route';
import type { TOC } from '@ember/component/template-only';

import type { ModelFrom } from './model-from';

export interface RouteSignature<R extends Route> {
  Args: {
    model: ModelFrom<R>;
  };
}

export type RouteComponent<R extends Route> = TOC<RouteSignature<R>>;
