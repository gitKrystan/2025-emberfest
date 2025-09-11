import uuid from 'short-uuid';

import type { Todo, TodoAttributes } from '@workspace/shared-data/types';
import { asType } from '@workspace/shared-data/types';

import { InternalServerError } from '../errors.ts';
import { Store } from './base-store.ts';
import { flagStore } from './flag-store.ts';

const sampleTodos: TodoAttributes[] = [
  { title: 'Demo Loading State', completed: false },
  { title: 'Make API Less Reliable', completed: false },
  { title: 'Demo Error State', completed: false },
  { title: 'Demo Pessimistic Mutation', completed: false },
  { title: 'Demo Optimistic Mutation', completed: false },
  { title: 'Demo Scale Pioneer Todos', completed: true },
  { title: 'Demo Enterprise Edition', completed: false },
  { title: 'Inspect the Warp Core', completed: true },
  { title: 'Review Klingon Treaty', completed: false },
  { title: 'Enjoy Earl Grey Tea', completed: true },
  { title: 'Learn JSONAPI specification', completed: true },
  { title: 'Implement Todo API', completed: true },
  { title: 'Write tests', completed: false },
  { title: 'Add more features', completed: true },
  { title: 'Optimize performance', completed: true },
  { title: 'Deploy to production', completed: false },
  { title: 'Monitor and maintain', completed: false },
  { title: 'Gather user feedback', completed: false },
  { title: 'Plan next iteration', completed: false },
  { title: 'Scale infrastructure', completed: false },
];

function seed(count: number): Todo[] {
  return new Array(count).fill(null).map((_, i) => {
    const sample = sampleTodos[i % sampleTodos.length];
    if (!sample) {
      throw new Error('this should be impossible');
    }
    return asType<Todo>({
      $type: 'todo',
      id: uuid.generate(),
      title: i > sampleTodos.length - 1 ? `${sample.title} ${i}` : sample.title,
      completed: sample.completed,
    });
  });
}

/**
 * Todo store implementation
 */
export class TodoStore extends Store<Todo> {
  constructor(initialTodoCount: number) {
    super(seed(initialTodoCount));
  }

  /**
   * Set the initial todo count (called by store manager)
   */
  reseed(count: number): void {
    if (count < 0) {
      throw new InternalServerError({
        detail: ['Count cannot be less than 0'],
      });
    }
    this.map = new Map(seed(count).map((item) => [item.id, item]));
    console.log(`Todo store re-seeded with ${count} initial todos`);
  }

  /**
   * Create a new todo
   */
  create(todoData: TodoAttributes): Todo {
    const todo = asType<Todo>({
      $type: 'todo',
      id: uuid.generate(),
      ...todoData,
      completed: todoData.completed,
    });

    this.map.set(todo.id, todo);
    return todo;
  }
}

const initialTodoCountFlag = flagStore.safeFindById('initialTodoCount');

// Export a singleton instance
export const todoStore = new TodoStore(
  (initialTodoCountFlag?.value as number | undefined) ?? 3,
);
