import { z } from "zod";

const environmentSchema = z.object({
  DATABASE_URL: z.string(),
  HTTP_SERVER_PORT: z.coerce.number().default(3333),
});

const parsedEnv = environmentSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(`Invalid env var: ${JSON.stringify(parsedEnv.error.formErrors.fieldErrors, undefined, 2)}`);
}

export const env = parsedEnv.data;
