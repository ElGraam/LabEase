import type { NextAuthOptions, Session } from "next-auth";
import NextAuth, { User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialProvider from "next-auth/providers/credentials";

export const authOption: NextAuthOptions = {
  secret: process.env.NEXT_AUTH_SECRET,
  providers: [
    CredentialProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;
        const { email, password } = credentials;
        let res;
        try {
          // ユーザー認証
          res = await fetch(`${process.env.BACKEND_URL}/api/auth/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password: password }),
            cache: "no-cache",
          });

          // 認証に失敗した場合はエラーを返す
          if (!res.ok) {
            throw new Error("error");
          }

          // 認証で返ってきたユーザーを取得
          const user = await res.json();

          if (!user) {
            return null;
          }

          return user;
        } catch (error) {
          throw new Error("error");
        }
      },
    }),
  ],
  session: {
    maxAge: 2 * 60 * 60,
  },
  callbacks: {
    //
    async jwt({
      token,
      // trigger,
      user,
      // session,
    }: {
      token: JWT;
      trigger?: string;
      user: User;
      session?: any;
    }) {
      // JWTにユーザー情報を格納する
      if (user) {
        token.id = user.id;
        token.labId = user.labId;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      // セッションにJWTで格納している情報を渡す
      session.user.id = token.id;
      session.user.labId = token.labId;
      session.user.role = token.role;
      return session;
    },
  },
};

export const handler = NextAuth(authOption);
export default handler;
