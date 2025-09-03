import type {
  CollectionResourceDocument,
  ExistingResourceObject,
  SingleResourceDocument,
} from '@warp-drive/core/types/spec/json-api-raw';
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

export interface SavedTodo extends BaseTodo, Readonly<TodoAttributes> {
  readonly id: string;
}

export type ExistingTodoResource = ExistingResourceObject<'todo'>;
export type SingleTodoDocument = SingleResourceDocument<'todo'>;
export type CollectionTodoDocument = CollectionResourceDocument<'todo'>;
