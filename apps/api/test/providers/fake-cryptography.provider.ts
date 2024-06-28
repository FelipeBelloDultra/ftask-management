import type { CryptographyProvider } from "~/application/providers/cryptography.provider";

export class FakeCryptographyProvider implements CryptographyProvider {
  public async encrypt(value: Record<string, unknown>, expiresIn = "30m"): Promise<string> {
    return JSON.stringify({
      ...value,
      expiresIn,
    });
  }

  public async decrypt<Payload extends object>(token: string): Promise<Payload> {
    return Promise.resolve({ token } as Payload);
  }
}
