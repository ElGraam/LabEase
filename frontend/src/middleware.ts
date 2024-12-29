import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // セッションのトークンを取得
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // リクエストのパスを取得
  const { pathname } = req.nextUrl;

  // 通常のレスポンスを返す
  return NextResponse.next();
}
