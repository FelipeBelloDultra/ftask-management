import { z } from "zod";

const SCHEMA = z.object({
  DATABASE_URL: z.string(),
  HTTP_SERVER_PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default("30m"),
  NODE_ENV: z.union([z.literal("production"), z.literal("development"), z.literal("test")]).default("development"),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_DB: z.coerce.number().default(0),
  REDIS_PASSWORD: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_DEFAULT_REGION: z.string(),
  AWS_BUCKET: z.string(),
  AWS_ENDPOINT: z.string(),
  STORAGE_DRIVER: z.union([z.literal("local"), z.literal("aws")]),
});

type Schema = z.infer<typeof SCHEMA>;

function validateSchema() {
  const validated = SCHEMA.safeParse(process.env);

  if (!validated.success) {
    throw new Error(`Invalid env vars: ${JSON.stringify(validated.error.formErrors.fieldErrors, undefined, 2)}`);
  }

  return validated.data;
}

export class Env {
  private static readonly schema = validateSchema();

  public static storageDriverIs(storages: Array<"local" | "aws">) {
    const storageDriver = this.get("STORAGE_DRIVER");

    return storages.includes(storageDriver);
  }

  public static environmentIs(envs: Array<"production" | "development" | "test">) {
    const nodeEnv = this.get("NODE_ENV");

    return envs.includes(nodeEnv);
  }

  public static get<Key extends keyof Schema>(key: Key): Schema[Key] {
    const value = this.schema[key];

    if (value === undefined || value === null || value === "") {
      throw new Error(` Failed to get ${key} from schema`);
    }

    return value;
  }
}
