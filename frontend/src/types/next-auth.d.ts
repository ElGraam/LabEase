/**
 * NextAuth内で使用される型を指定
 */

import "next-auth";

// 認証ユーザー情報のinterface（認証時にbackendから返されるレスポンスの型に合わせる）
interface AuthUserInfo {
  id: string;
  email: string;
  role: Role;
  username: string;
  labId: string;
}

// NextAuth内で使用されるinterfaceを上書きする
declare module "next-auth" {
  interface Session {
    user: AuthUserInfo;
  }
  interface User extends AuthUserInfo {}
}

declare module "next-auth/jwt" {
  interface JWT extends AuthUserInfo {}
}
