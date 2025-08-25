import { Todo, TodoResource, TodoDocument, JsonApiError } from './types';

const TODO_TYPE = 'todo'; // Using singular-dasherized as per spec requirements

export class JsonApiSerializer {
  /**
   * Serialize a single Todo to JSONAPI format
   */
  static serializeTodo(todo: Todo, baseUrl: string = ''): TodoResource {
    const { id, ...attributes } = todo;

    return {
      type: TODO_TYPE,
      id,
      attributes,
      links: {
        self: `${baseUrl}/todos/${id}`,
      },
    };
  }

  /**
   * Serialize multiple Todos to JSONAPI format
   */
  static serializeTodos(todos: Todo[], baseUrl: string = ''): TodoResource[] {
    return todos.map((todo) => this.serializeTodo(todo, baseUrl));
  }

  /**
   * Create a JSONAPI document for a single Todo
   */
  static createTodoDocument(todo: Todo, baseUrl: string = ''): TodoDocument {
    return {
      data: this.serializeTodo(todo, baseUrl),
      jsonapi: {
        version: '1.1',
      },
      links: {
        self: `${baseUrl}/todos/${todo.id}`,
      },
    };
  }

  /**
   * Create a JSONAPI document for multiple Todos
   */
  static createTodosDocument(
    todos: Todo[],
    baseUrl: string = '',
  ): TodoDocument {
    return {
      data: this.serializeTodos(todos, baseUrl),
      jsonapi: {
        version: '1.1',
      },
      links: {
        self: `${baseUrl}/todos`,
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
  static deserializeTodo(resource: TodoResource): Partial<Todo> {
    if (resource.type !== TODO_TYPE) {
      throw new Error(
        `Expected resource type '${TODO_TYPE}', got '${resource.type}'`,
      );
    }

    const todo: Partial<Todo> = {};

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
   * Validate Todo data for creation
   */
  static validateTodoForCreation(data: Partial<Todo>): string[] {
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
  static validateTodoForUpdate(data: Partial<Todo>): string[] {
    const errors: string[] = [];

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
}
