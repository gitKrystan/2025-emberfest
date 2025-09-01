import type {
  CollectionResourceDocument,
  ExistingResourceObject,
  SingleResourceDocument,
} from '@warp-drive/core/types/spec/json-api-raw';
import type { Type } from '@warp-drive/core/types/symbols';

export interface BaseTodo {
  [Type]: 'todo';
}

export interface NewTodo extends BaseTodo {
  title?: string;
  completed?: boolean;
}

export interface UnsavedTodo extends BaseTodo {
  title: string;
  completed: boolean;
}

export interface SavedTodo extends BaseTodo {
  id: string;
  title: string;
  completed: boolean;
}

export type ExistingTodoResource = ExistingResourceObject<'todo'>;
export type SingleTodoDocument = SingleResourceDocument<'todo'>;
export type CollectionTodoDocument = CollectionResourceDocument<'todo'>;
