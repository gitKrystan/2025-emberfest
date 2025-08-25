export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

// JSONAPI Resource Object interface
export interface JsonApiResource<T = any> {
  type: string;
  id: string;
  attributes?: T;
  relationships?: Record<string, JsonApiRelationship>;
  links?: JsonApiLinks;
  meta?: Record<string, any>;
}

// JSONAPI Document interface
export interface JsonApiDocument<T = any> {
  data?: JsonApiResource<T> | JsonApiResource<T>[] | null;
  errors?: JsonApiError[];
  meta?: Record<string, any>;
  jsonapi?: {
    version?: string;
    meta?: Record<string, any>;
  };
  links?: JsonApiLinks;
  included?: JsonApiResource[];
}

// JSONAPI Relationship interface
export interface JsonApiRelationship {
  links?: JsonApiLinks;
  data?: JsonApiResourceIdentifier | JsonApiResourceIdentifier[] | null;
  meta?: Record<string, any>;
}

// JSONAPI Resource Identifier interface
export interface JsonApiResourceIdentifier {
  type: string;
  id: string;
  meta?: Record<string, any>;
}

// JSONAPI Links interface
export interface JsonApiLinks {
  self?: string;
  related?: string;
  first?: string;
  last?: string;
  prev?: string;
  next?: string;
  [key: string]: string | undefined;
}

// JSONAPI Error interface
export interface JsonApiError {
  id?: string;
  links?: {
    about?: string;
    type?: string;
  };
  status?: string;
  code?: string;
  title?: string;
  detail?: string;
  source?: {
    pointer?: string;
    parameter?: string;
    header?: string;
  };
  meta?: Record<string, any>;
}

// Todo-specific JSONAPI types
export type TodoResource = JsonApiResource<Omit<Todo, 'id'>>;
export type TodoDocument = JsonApiDocument<Omit<Todo, 'id'>>;
export type TodoListDocument = JsonApiDocument<Omit<Todo, 'id'>>;
