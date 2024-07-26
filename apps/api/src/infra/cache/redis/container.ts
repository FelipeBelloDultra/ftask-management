import { container, Lifecycle } from "tsyringe";

import { CacheRepository } from "../cache.repository";

import { RedisCacheRepository } from "./redis-cache.repository";
import { RedisConnection } from "./redis-connection";

container.register<RedisConnection>(
  "RedisConnection",
  { useClass: RedisConnection },
  {
    lifecycle: Lifecycle.Singleton,
  },
);
container.register<CacheRepository>(
  "CacheRepository",
  { useClass: RedisCacheRepository },
  {
    lifecycle: Lifecycle.Singleton,
  },
);
