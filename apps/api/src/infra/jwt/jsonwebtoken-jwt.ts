import { sign, verify } from "jsonwebtoken";

import { JwtProvider } from "@/application/providers/jwt.provider";
import { Env } from "@/config/env";

export class JsonWebTokenJwt implements JwtProvider {
  public async encrypt(value: Record<string, unknown>, expiresIn?: string | undefined): Promise<string> {
    const token = sign(value, Env.get("JWT_SECRET"), {
      expiresIn: expiresIn || Env.get("JWT_EXPIRES_IN"),
    });

    return token;
  }

  public async decrypt<Payload extends object>(value: string): Promise<Payload> {
    const decoded = verify(value, Env.get("JWT_SECRET"));

    return decoded as Payload;
  }
}
