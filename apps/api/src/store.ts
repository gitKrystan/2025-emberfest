import { v4 as uuidv4 } from 'uuid';
import { Todo } from './types';

export class TodoStore {
  private todos: Map<string, Todo> = new Map();

  constructor() {
    // Initialize with some sample data
    this.seed();
  }

  /**
   * Seed the store with initial data
   */
  private seed(): void {
    const sampleTodos: Omit<Todo, 'id'>[] = [
      { title: 'Learn JSONAPI specification', completed: true },
      { title: 'Implement Todo API', completed: false },
      { title: 'Write tests', completed: false },
    ];

    sampleTodos.forEach((todoData) => {
      const todo: Todo = {
        id: uuidv4(),
        ...todoData,
      };
      this.todos.set(todo.id, todo);
    });
  }

  /**
   * Get all todos
   */
  findAll(): Todo[] {
    return Array.from(this.todos.values());
  }

  /**
   * Find a todo by ID
   */
  findById(id: string): Todo | undefined {
    return this.todos.get(id);
  }

  /**
   * Create a new todo
   */
  create(todoData: Omit<Todo, 'id'>): Todo {
    const todo: Todo = {
      id: uuidv4(),
      ...todoData,
      completed: todoData.completed ?? false,
    };

    this.todos.set(todo.id, todo);
    return todo;
  }

  /**
   * Update an existing todo
   */
  update(id: string, updates: Partial<Omit<Todo, 'id'>>): Todo | undefined {
    const existingTodo = this.todos.get(id);
    if (!existingTodo) {
      return undefined;
    }

    const updatedTodo: Todo = {
      ...existingTodo,
      ...updates,
    };

    this.todos.set(id, updatedTodo);
    return updatedTodo;
  }

  /**
   * Delete a todo by ID
   */
  delete(id: string): boolean {
    return this.todos.delete(id);
  }

  /**
   * Check if a todo exists
   */
  exists(id: string): boolean {
    return this.todos.has(id);
  }

  /**
   * Get the count of todos
   */
  count(): number {
    return this.todos.size;
  }

  /**
   * Clear all todos (mainly for testing)
   */
  clear(): void {
    this.todos.clear();
  }
}

// Export a singleton instance
export const todoStore = new TodoStore();
