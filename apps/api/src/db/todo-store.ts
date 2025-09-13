import uuid from 'short-uuid';

import type {
  HardCodedList,
  Todo,
  TodoAttributes,
} from '@workspace/shared-data/types';
import { asType } from '@workspace/shared-data/types';

import { InternalServerError } from '../errors.ts';
import { Store } from './base-store.ts';
import { flagStore } from './flag-store.ts';

const lists: Record<HardCodedList, TodoAttributes[]> = {
  sampleTodos: [
    { title: 'Inspect the Warp Core', completed: true },
    { title: 'Review Klingon Treaty', completed: false },
    { title: 'Enjoy Earl Grey Tea', completed: true },
    { title: 'Calibrate Phaser Arrays', completed: true },
    { title: 'Bridge Officer Performance Reports', completed: false },
    { title: 'Meet with Romulan Ambassador', completed: false },
    { title: "Update Captain's Log", completed: true },
    { title: 'Attend Senior Staff Briefing', completed: true },
    { title: 'Trade Agreement with Vulcan Council', completed: false },
    { title: 'Schedule Holodeck Maintenance', completed: false },
    { title: 'Temporal Prime Directive Guidelines', completed: true },
    { title: 'Conduct Emergency Drill - Red Alert', completed: false },
    { title: 'Study Anomalous Readings', completed: false },
    { title: 'Starfleet Academy Guest Lecture', completed: true },
    { title: 'Approve Shore Leave Requests', completed: true },
    { title: 'Medical Checkup with Dr. McCoy', completed: false },
    { title: 'Coordinate Engineering Teams', completed: true },
    { title: 'Review Exploration Mission Parameters', completed: false },
    { title: 'Contact Starfleet Command', completed: false },
    { title: 'Chess Match with Commander Spock', completed: true },
    { title: 'Inspect Shuttle Bay Operations', completed: false },
  ],
  featureSet: [
    { title: 'Read All Todos', completed: true },
    { title: 'Create a Todo', completed: false },
    { title: 'Read Active Todos', completed: false },
    { title: 'Read Completed Todos', completed: false },
    { title: 'Toggle a Todo', completed: false },
    { title: 'Edit a Todo Title', completed: false },
    { title: 'Delete a Todo', completed: false },
    { title: 'Mark All as Completed', completed: false },
    { title: 'Delete Completed', completed: false },
  ],
  basicLoadingStates: [
    { title: 'Read All Todos (Slowly)', completed: true },
    { title: 'Read Completed Todos (Slowly)', completed: false },
    { title: 'Read All Todos (Quickly)', completed: false },
  ],
  basicErrorStates: [{ title: "Don't Read All Todos", completed: false }],
  pessimisticMutation: [
    { title: 'Read Active Todos (load cache)', completed: false },
    { title: 'Rename me', completed: false },
    { title: 'Read Active Todos (from cache)', completed: false },
    { title: 'Make API less reliable', completed: false },
    { title: 'Try to rename me', completed: false },
  ],
  optimisticMutation: [
    { title: 'Read Active Todos (load cache)', completed: false },
    { title: 'Read Completed Todos (load cache)', completed: false },
    { title: 'Complete me', completed: false },
    { title: 'Read Active Todos (from cache)', completed: false },
    { title: 'Read Completed Todos (from cache)', completed: false },
  ],
  bulkActions: [
    { title: 'Clear Completed Todos', completed: false },
    { title: 'Toggle All Completed and Clear Again', completed: false },
    { title: 'Inspect the Warp Core', completed: true },
    { title: 'Review Klingon Treaty', completed: false },
    { title: 'Enjoy Earl Grey Tea', completed: true },
    { title: 'Calibrate Phaser Arrays', completed: true },
    { title: 'Bridge Officer Performance Reports', completed: false },
    { title: 'Meet with Romulan Ambassador', completed: false },
    { title: "Update Captain's Log", completed: true },
    { title: 'Attend Senior Staff Briefing', completed: true },
    { title: 'Trade Agreement with Vulcan Council', completed: false },
    { title: 'Schedule Holodeck Maintenance', completed: false },
    { title: 'Temporal Prime Directive Guidelines', completed: true },
    { title: 'Conduct Emergency Drill - Red Alert', completed: false },
    { title: 'Study Anomalous Readings', completed: false },
    { title: 'Starfleet Academy Guest Lecture', completed: true },
    { title: 'Approve Shore Leave Requests', completed: true },
    { title: 'Medical Checkup with Dr. McCoy', completed: false },
    { title: 'Coordinate Engineering Teams', completed: true },
    { title: 'Review Exploration Mission Parameters', completed: false },
    { title: 'Contact Starfleet Command', completed: false },
    { title: 'Chess Match with Commander Spock', completed: true },
    { title: 'Inspect Shuttle Bay Operations', completed: false },
  ],
} as const;

function seed(option: number | HardCodedList): Todo[] {
  const list = typeof option === 'string' ? lists[option] : lists.sampleTodos;
  const count = typeof option === 'number' ? option : list.length;
  return new Array(count).fill(null).map((_, i) => {
    const sample = list[i % list.length];
    if (!sample) {
      throw new Error('this should be impossible');
    }
    return asType<Todo>({
      $type: 'todo',
      id: uuid.generate(),
      title: i > list.length - 1 ? `${sample.title} ${i}` : sample.title,
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
  reseed(option: number | HardCodedList): void {
    if (typeof option === 'number' && option < 0) {
      throw new InternalServerError({
        detail: ['Count cannot be less than 0'],
      });
    }

    this.map = new Map(seed(option).map((item) => [item.id, item]));
    console.log(`Todo store re-seeded with ${option} initial todos`);
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
