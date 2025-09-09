import { NotFoundError } from '../errors.ts';

export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  currentPage: number;
  totalPages: number;
}

/**
 * Abstract base class for in-memory data stores
 */
export abstract class Store<T extends { id: string }> {
  protected map: Map<string, T>;

  constructor(seed: T[]) {
    this.map = new Map(seed.map((item) => [item.id, item]));
  }

  /**
   * Get the count of values
   */
  get count(): number {
    return this.map.size;
  }

  /**
   * Get all values
   */
  findAll(): T[] {
    return Array.from(this.map.values());
  }

  /**
   * Find a value by ID
   */
  findById(id: string): T {
    const result = this.map.get(id);
    if (result) {
      return result;
    }
    throw new NotFoundError({ detail: [`No record found for ID ${id}`] });
  }

  safeFindById(id: string): T | null {
    return this.map.get(id) ?? null;
  }

  query(query: Partial<T>): T[] {
    return Array.from(
      this.map
        .values()
        .filter((item) =>
          Object.entries(query).every(
            ([key, value]) => item[key as keyof T] === value,
          ),
        ),
    );
  }

  /**
   * Get paginated results
   */
  findAllPaginated(options: PaginationOptions = {}): PaginatedResult<T> {
    const { limit = 25, offset = 0 } = options;
    const allItems = Array.from(this.map.values());
    const total = allItems.length;
    const data = allItems.slice(offset, offset + limit);
    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      limit,
      offset,
      currentPage,
      totalPages,
    };
  }

  /**
   * Query with pagination
   */
  queryPaginated(
    query: Partial<T>,
    options: PaginationOptions = {},
  ): PaginatedResult<T> {
    const { limit = 25, offset = 0 } = options;
    const filteredItems = Array.from(
      this.map
        .values()
        .filter((item) =>
          Object.entries(query).every(
            ([key, value]) => item[key as keyof T] === value,
          ),
        ),
    );
    const total = filteredItems.length;
    const data = filteredItems.slice(offset, offset + limit);
    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      limit,
      offset,
      currentPage,
      totalPages,
    };
  }

  /**
   * Create a new value
   */
  abstract create(attributes: Omit<T, 'id' | '$type'>): T;

  /**
   * Update an existing value
   */
  update(id: string, value: Partial<Omit<T, 'id' | '$type'>>): T {
    const existing = this.findById(id);

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
    this.findById(id); // for 404s
    return this.map.delete(id);
  }

  /**
   * Check if a value exists
   */
  exists(id: string): boolean {
    return this.map.has(id);
  }

  /**
   * Clear all values (mainly for testing)
   */
  clear(): void {
    this.map.clear();
  }
}
