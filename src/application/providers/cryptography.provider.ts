export abstract class CryptographyProvider {
  public abstract encrypt(value: Record<string, unknown>, expiresIn?: string): Promise<string>;
  public abstract decrypt<Payload extends object>(value: string): Promise<Payload>;
}
