import uuid from 'short-uuid';

import type { Todo, TodoAttributes } from '@workspace/shared-data/types';
import { asType } from '@workspace/shared-data/types';

import { InternalServerError } from '../errors.ts';
import { Store } from './base-store.ts';
import { flagStore } from './flag-store.ts';

const sampleTodos: TodoAttributes[] = [
  { title: 'Inspect the Warp Core', completed: true },
  { title: 'Review Klingon Treaty', completed: false },
  { title: 'Enjoy Earl Grey Tea', completed: true },
  { title: 'Starfleet Academy Guest Lecture', completed: true },
  { title: 'Bridge Officer Performance Reports', completed: false },
  { title: 'Calibrate Phaser Arrays', completed: false },
  { title: 'Meet with Romulan Ambassador', completed: false },
  { title: "Update Captain's Log", completed: true },
  { title: 'Attend Senior Staff Briefing', completed: true },
  { title: 'Trade Agreement with Vulcan Council', completed: false },
  { title: 'Schedule Holodeck Maintenance', completed: false },
  { title: 'Temporal Prime Directive Guidelines', completed: true },
  { title: 'Conduct Emergency Drill - Red Alert', completed: false },
  { title: 'Study Anomalous Readings', completed: false },
  { title: 'Approve Shore Leave Requests', completed: true },
  { title: 'Medical Checkup with Dr. McCoy', completed: false },
  { title: 'Coordinate Engineering Teams', completed: true },
  { title: 'Review Exploration Mission Parameters', completed: false },
  { title: 'Contact Starfleet Command', completed: false },
  { title: 'Chess Match with Commander Spock', completed: true },
  { title: 'Inspect Shuttle Bay Operations', completed: false },
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
