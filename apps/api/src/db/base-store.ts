import { NotFoundError } from '../errors.ts';

/**
 * Abstract base class for in-memory data stores
 */
export abstract class Store<T extends { id: string }> {
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

  /**
   * Create a new value
   */
  abstract create(attributes: Omit<T, 'id'>): T;

  /**
   * Update an existing value
   */
  update(id: string, value: Omit<T, 'id'>): T {
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
