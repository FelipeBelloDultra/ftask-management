export interface CryptographyProvider {
  encrypt(value: Record<string, unknown>, expiresIn?: string): Promise<string>;
  decrypt<Payload extends object>(value: string): Promise<Payload>;
}
