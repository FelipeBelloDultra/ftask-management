import { container, Lifecycle } from "tsyringe";

import { JwtProvider } from "~/application/providers/jwt.provider";

import { JsonWebTokenJwtProvider } from "./jsonwebtoken-jwt.provider";

container.register<JwtProvider>(
  "JwtProvider",
  {
    useClass: JsonWebTokenJwtProvider,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);
