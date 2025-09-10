import type { Type } from '@warp-drive/core/types/symbols';

/** Base type extended by all Todo resource instances */
export interface BaseTodo {
  /** Type-only brand */
  readonly [Type]: 'todo';
  /** $type attribute managed by the store */
  readonly $type: 'todo';
}

/** Valid attributes for Todo creation */
export interface TodoAttributes {
  title: string;
  completed: boolean;
}

export interface Todo extends BaseTodo {
  readonly id: string;
  readonly title: string;
  readonly completed: boolean;
}

export interface EditableTodo extends BaseTodo {
  id: string;
  title: string;
  completed: boolean;
}
