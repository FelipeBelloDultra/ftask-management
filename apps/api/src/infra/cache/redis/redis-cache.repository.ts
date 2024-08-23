import { inject, injectable } from "tsyringe";

import { CacheRepository } from "../cache.repository";

import { RedisConnection } from "./redis-connection";

@injectable()
export class RedisCacheRepository implements CacheRepository {
  public constructor(
    @inject("RedisConnection")
    private readonly redisConnection: RedisConnection,
  ) {}

  public async set(key: string, value: string): Promise<void> {
    await this.redisConnection.set(key, value, "EX", 60 * 15);
  }

  public async get(key: string): Promise<string | null> {
    return await this.redisConnection.get(key);
  }

  public async delete(key: string): Promise<void> {
    await this.redisConnection.del(key);
  }

  public createKey(keys: Array<string>): string {
    return keys.join(":");
  }
}
