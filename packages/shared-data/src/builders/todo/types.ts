import type { ReactiveDataDocument } from '@warp-drive/core/reactive';

import type { Todo } from '../../types/todo.ts';

export type ReactiveTodoDocument = ReactiveDataDocument<Todo>;
export type ReactiveTodosDocument = ReactiveDataDocument<Todo[]>;
