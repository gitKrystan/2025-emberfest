import { v4 as uuidv4 } from 'uuid';

import {
  ApiFlag,
  asType,
  SavedTodo,
  UnsavedTodo,
} from '@workspace/shared-data/types';

abstract class Store<T extends { id: string }> {
  protected map: Map<string, T>;

  constructor() {
    // Initialize with some sample data
    const values = this.seed();
    this.map = new Map(values.map((item: T) => [item.id, item]));
  }

  /**
   * Seed the store with initial data
   */
  abstract seed(): T[];

  /**
   * Get all values
   */
  findAll(): T[] {
    return Array.from(this.map.values());
  }

  /**
   * Find a value by ID
   */
  findById(id: string): T | undefined {
    return this.map.get(id);
  }

  /**
   * Create a new value
   */
  abstract create(attributes: Omit<T, 'id'>): T;

  /**
   * Update an existing value
   */
  update(id: string, value: Omit<T, 'id'>): T | undefined {
    const existing = this.map.get(id);
    if (!existing) {
      return undefined;
    }

    const updated = {
      ...existing,
      ...value,
    };

    this.map.set(id, updated);
    return updated;
  }

  /**
   * Delete a value by ID
   */
  delete(id: string): boolean {
    return this.map.delete(id);
  }

  /**
   * Check if a value exists
   */
  exists(id: string): boolean {
    return this.map.has(id);
  }

  /**
   * Get the count of values
   */
  count(): number {
    return this.map.size;
  }

  /**
   * Clear all values (mainly for testing)
   */
  clear(): void {
    this.map.clear();
  }
}

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
      completed: todoData.completed ?? false,
    };

    this.map.set(todo.id, todo);
    return todo;
  }
}

// Export a singleton instance
export const todoStore = new TodoStore();

export class FlagStore extends Store<ApiFlag> {
  /**
   * Seed the store with initial data
   */
  seed(): ApiFlag[] {
    return [
      asType<ApiFlag>({ id: 'shouldError' as const, value: false }),
      asType<ApiFlag>({ id: 'initialTodoCount' as const, value: 3 }),
    ];
  }

  /**
   * Create a new flag (not supported)
   */
  create(): ApiFlag {
    throw new Error('unimplemented');
  }
}

export const flagStore = new FlagStore();
