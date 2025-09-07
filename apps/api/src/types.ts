export interface ExistingRecord<T extends string> {
  id: string;
  $type: T;
}
