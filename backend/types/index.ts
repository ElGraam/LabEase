export type Role = 'STUDENT' | 'PROFESSOR' | 'ADMIN';
export type Users = {
  id: string;
  username: string;
  password: string;
  email: string;
  role: Role;
  created_at: Date;
  updated_at: Date;
};

// 認証時にレスポンスとして返すユーザー情報の型
export type AuthUserInfo = {
  id: string;
  email: string;
  role: Role;
  username: string;
};

