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

  public static isProduction() {
    return this.get("NODE_ENV") === "production";
  }

  public static get<Key extends keyof Schema>(key: Key): Schema[Key] {
    const value = this.schema[key];

    if (value === undefined || value === null || value === "") {
      throw new Error(` Failed to get ${key} from schema`);
    }

    return value;
  }
}
