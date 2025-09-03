import { v4 as uuidv4 } from 'uuid';

import type { SavedTodo, TodoAttributes } from '@workspace/shared-data/types';
import { asType } from '@workspace/shared-data/types';

import { InternalServerError } from '../errors.ts';
import { Store } from './base-store.ts';
import { flagStore } from './flag-store.ts';

const sampleTodos: TodoAttributes[] = [
  { title: 'Learn JSONAPI specification', completed: true },
  { title: 'Implement Todo API', completed: false },
  { title: 'Write tests', completed: false },
  { title: 'Add more features', completed: false },
  { title: 'Optimize performance', completed: false },
  { title: 'Deploy to production', completed: false },
  { title: 'Monitor and maintain', completed: false },
  { title: 'Gather user feedback', completed: false },
  { title: 'Plan next iteration', completed: false },
  { title: 'Scale infrastructure', completed: false },
];

function seed(count: number): SavedTodo[] {
  return new Array(count).fill(null).map((_, i) => {
    const sample = sampleTodos[i % sampleTodos.length];
    if (!sample) {
      throw new Error('this should be impossible');
    }
    return asType<SavedTodo>({
      $type: 'todo',
      id: uuidv4(),
      title: i > sampleTodos.length - 1 ? `${sample.title} ${i}` : sample.title,
      completed: sample.completed,
    });
  });
}

/**
 * Todo store implementation
 */
export class TodoStore extends Store<SavedTodo> {
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
  create(todoData: TodoAttributes): SavedTodo {
    const todo = asType<SavedTodo>({
      $type: 'todo',
      id: uuidv4(),
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
