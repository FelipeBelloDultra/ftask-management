import "dotenv/config";
import { env } from "~/config/env";

import { app } from "./app";

app.listen(env.HTTP_SERVER_PORT);
