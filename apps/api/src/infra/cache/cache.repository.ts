export interface CacheRepository {
  set(key: string, value: string): Promise<void>;
  get(key: string): Promise<string | null>;
  delete(key: string): Promise<void>;
  deleteByPrefix(keyPattern: string): Promise<void>;
  createKey(keys: Array<string>): string;
}
