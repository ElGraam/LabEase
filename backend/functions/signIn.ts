import { NextFunction, Request, Response } from "express";
import crypto from "node:crypto";

import { prisma } from "../lib/prisma";
import { AuthUserInfo, Role } from "../types";

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // リクエストボディからメールアドレスとパスワードを取得
  const { email, password } = req.body;

  try {
    // emailを元に、ユーザーを取得
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    // ユーザーが存在しない場合は404を返す
    if (!user) {
      return res.status(404).json();
    }

    const passwordHash = crypto
      .createHash("sha256")
      .update(password)
      .digest("base64");

    // パスワードが一致しない場合は401を返す
    if (passwordHash !== user.password) {
      return res.status(401).json();
    }

    // ユーザー情報を返す
    // 存在しない場合はnullを返す
    const authUserInfo: AuthUserInfo = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role as Role,
      labId: user.labId || "",
    };
    return res.status(200).json(authUserInfo);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json();
    }
    next(error);
  }
};
