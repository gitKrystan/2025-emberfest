import { v4 as uuidv4 } from 'uuid';

import type { SavedTodo, UnsavedTodo } from '@workspace/shared-data/types';
import { asType } from '@workspace/shared-data/types';

import { Store } from './base-store.ts';

/**
 * Todo store implementation
 */
export class TodoStore extends Store<SavedTodo> {
  /**
   * Seed the store with initial data
   */
  seed(): SavedTodo[] {
    const sampleTodos: UnsavedTodo[] = [
      asType<UnsavedTodo>({
        title: 'Learn JSONAPI specification',
        completed: true,
      }),
      asType<UnsavedTodo>({ title: 'Implement Todo API', completed: false }),
      asType<UnsavedTodo>({ title: 'Write tests', completed: false }),
    ];

    return sampleTodos.map((todoData) => {
      const todo: SavedTodo = {
        id: uuidv4(),
        ...todoData,
      };
      return todo;
    });
  }

  /**
   * Create a new todo
   */
  create(todoData: UnsavedTodo): SavedTodo {
    const todo: SavedTodo = {
      id: uuidv4(),
      ...todoData,
      completed: todoData.completed,
    };

    this.map.set(todo.id, todo);
    return todo;
  }
}

// Export a singleton instance
export const todoStore = new TodoStore();
