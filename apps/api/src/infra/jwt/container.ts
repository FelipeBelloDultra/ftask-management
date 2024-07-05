import { container, Lifecycle } from "tsyringe";

import { JwtProvider } from "~/application/providers/jwt.provider";

import { JsonWebTokenJwt } from "./jsonwebtoken-jwt";

container.register<JwtProvider>(
  "JwtProvider",
  {
    useClass: JsonWebTokenJwt,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);
