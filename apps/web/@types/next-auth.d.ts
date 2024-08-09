import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      picture_url: string | null;
      email: string;
      name: string;
      token: string;
      refreshToken: string;
    };
  }
}
