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
