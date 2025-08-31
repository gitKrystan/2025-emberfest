import { ApiFlag, SavedTodo, UnsavedTodo } from '@workspace/shared-data/types';
import {
  TodoResource,
  TodoDocument,
  JsonApiError,
  FlagResource,
  FlagDocument,
} from './types';

const TODO_TYPE = 'todo'; // Using singular-dasherized as per spec requirements
const FLAG_TYPE = 'flag'; // Using singular-dasherized as per spec requirements

export class JsonApiSerializer {
  /**
   * Serialize a single Todo to JSONAPI format
   */
  static serializeTodo(todo: SavedTodo, baseUrl: string = ''): TodoResource {
    const { id, ...attributes } = todo;

    return {
      type: TODO_TYPE,
      id,
      attributes,
      links: {
        self: `${baseUrl}/todo/${id}`,
      },
    };
  }

  /**
   * Serialize a single Flag to JSONAPI format
   */
  static serializeFlag(flag: ApiFlag, baseUrl: string = ''): FlagResource {
    const { id, ...attributes } = flag;

    return {
      type: FLAG_TYPE,
      id,
      attributes,
      links: {
        self: `${baseUrl}/flag/${id}`,
      },
    };
  }

  /**
   * Serialize multiple Todos to JSONAPI format
   */
  static serializeTodos(
    todos: SavedTodo[],
    baseUrl: string = '',
  ): TodoResource[] {
    return todos.map((todo) => this.serializeTodo(todo, baseUrl));
  }

  /**
   * Serialize multiple Flags to JSONAPI format
   */
  static serializeFlags(
    flags: ApiFlag[],
    baseUrl: string = '',
  ): FlagResource[] {
    return flags.map((flag) => this.serializeFlag(flag, baseUrl));
  }

  /**
   * Create a JSONAPI document for a single Todo
   */
  static createTodoDocument(
    todo: SavedTodo,
    baseUrl: string = '',
  ): TodoDocument {
    return {
      data: this.serializeTodo(todo, baseUrl),
      jsonapi: {
        version: '1.1',
      },
      links: {
        self: `${baseUrl}/todo/${todo.id}`,
      },
    };
  }

  /**
   * Create a JSONAPI document for a single Todo
   */
  static createFlagDocument(flag: ApiFlag, baseUrl: string = ''): FlagDocument {
    return {
      data: this.serializeFlag(flag, baseUrl),
      jsonapi: {
        version: '1.1',
      },
      links: {
        self: `${baseUrl}/flag/${flag.id}`,
      },
    };
  }

  /**
   * Create a JSONAPI document for multiple Todos
   */
  static createTodosDocument(
    todos: SavedTodo[],
    baseUrl: string = '',
  ): TodoDocument {
    return {
      data: this.serializeTodos(todos, baseUrl),
      jsonapi: {
        version: '1.1',
      },
      links: {
        self: `${baseUrl}/todo`,
      },
    };
  }

  /**
   * Create a JSONAPI document for multiple Flags
   */
  static createFlagsDocument(
    flags: ApiFlag[],
    baseUrl: string = '',
  ): FlagDocument {
    return {
      data: this.serializeFlags(flags, baseUrl),
      jsonapi: {
        version: '1.1',
      },
      links: {
        self: `${baseUrl}/flag`,
      },
    };
  }

  /**
   * Create a JSONAPI error document
   */
  static createErrorDocument(errors: JsonApiError[]): TodoDocument {
    return {
      errors,
      jsonapi: {
        version: '1.1',
      },
    };
  }

  /**
   * Create a single error document
   */
  static createSingleErrorDocument(
    status: string,
    title: string,
    detail?: string,
    code?: string,
  ): TodoDocument {
    return this.createErrorDocument([
      {
        status,
        title,
        detail,
        code,
      },
    ]);
  }

  /**
   * Deserialize a JSONAPI Todo resource to a Todo object
   */
  static deserializeTodo(resource: TodoResource): Partial<SavedTodo> {
    if (resource.type !== TODO_TYPE) {
      throw new Error(
        `Expected resource type '${TODO_TYPE}', got '${resource.type}'`,
      );
    }

    const todo: Partial<SavedTodo> = {};

    if (resource.id) {
      todo.id = resource.id;
    }

    if (resource.attributes) {
      if (typeof resource.attributes.title === 'string') {
        todo.title = resource.attributes.title;
      }
      if (typeof resource.attributes.completed === 'boolean') {
        todo.completed = resource.attributes.completed;
      }
    }

    return todo;
  }

  /**
   * Deserialize a JSONAPI Flag resource to a F;ag object
   */
  static deserializeFlag(resource: FlagResource): Partial<ApiFlag> {
    if (resource.type !== FLAG_TYPE) {
      throw new Error(
        `Expected resource type '${FLAG_TYPE}', got '${resource.type}'`,
      );
    }

    const flag: Partial<ApiFlag> = {};

    if (resource.id) {
      flag.id = resource.id as ApiFlag['id'];
    }

    if (resource.attributes) {
      flag.value = resource.attributes.value;
    }

    return flag;
  }

  /**
   * Validate Todo data for creation
   */
  static validateTodoForCreation(data: Partial<UnsavedTodo>): string[] {
    const errors: string[] = [];

    if (
      !data.title ||
      typeof data.title !== 'string' ||
      data.title.trim() === ''
    ) {
      errors.push('title is required and must be a non-empty string');
    }

    if (data.completed !== undefined && typeof data.completed !== 'boolean') {
      errors.push('completed must be a boolean');
    }

    return errors;
  }

  /**
   * Validate Todo data for updates
   */
  static validateTodoForUpdate(data: Partial<SavedTodo>): string[] {
    const errors: string[] = [];

    if ('title' in data && !data.title) {
      errors.push('title cannot be empty if provided');
    }

    if ('completed' in data && data.completed === undefined) {
      errors.push('completed cannot be undefined if provided');
    }

    if (
      data.title !== undefined &&
      (typeof data.title !== 'string' || data.title.trim() === '')
    ) {
      errors.push('title must be a non-empty string');
    }

    if (data.completed !== undefined && typeof data.completed !== 'boolean') {
      errors.push('completed must be a boolean');
    }

    return errors;
  }

  /**
   * Validate Flag data for updates
   */
  static validateFlagForUpdate(data: Partial<ApiFlag>): string[] {
    const errors: string[] = [];

    if ('value' in data && !data.value) {
      errors.push('value cannot be empty if provided');
    }

    return errors;
  }
}
