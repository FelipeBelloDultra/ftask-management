import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const response = await fetch("http://localhost:3333/api/account/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });

        if (!response.ok) {
          return null;
        }

        const { data } = await response.json();

        // TODO: Fix rule to refresh token
        // const refreshToken = response.headers.get("set-cookie")?.split("=")[1].split(";")[0];
        // if (!refreshToken) return null;
        // cookies().set("refresh_token", refreshToken, {
        //   httpOnly: true,
        // });

        if (!data || !data.token || !data.user) {
          return null;
        }
        console.log(data);

        return { ...data.user, token: data.token };
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session.user = token as any;
      return session;
    },
  },
};
