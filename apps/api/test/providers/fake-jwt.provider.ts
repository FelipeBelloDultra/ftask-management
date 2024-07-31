import { JwtProvider } from "@/application/providers/jwt.provider";

export class FakeJwtProvider implements JwtProvider {
  public async encrypt(value: Record<string, unknown>, expiresIn = "30m"): Promise<string> {
    return JSON.stringify({
      ...value,
      expiresIn,
    });
  }

  public async decrypt<Payload extends object>(token: string): Promise<Payload> {
    if (token === "throwError") {
      throw new Error();
    }

    return Promise.resolve({ token } as Payload);
  }
}
