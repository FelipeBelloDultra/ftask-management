import { z } from "zod";

const environmentSchema = z.object({
  DATABASE_URL: z.string(),
  HTTP_SERVER_PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default("30m"),
  NODE_ENV: z.union([z.literal("production"), z.literal("development"), z.literal("test")]).default("development"),
});

const parsedEnv = environmentSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(`Invalid env var: ${JSON.stringify(parsedEnv.error.formErrors.fieldErrors, undefined, 2)}`);
}

export const env = parsedEnv.data;
