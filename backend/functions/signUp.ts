import { NextFunction, Request, Response } from 'express';
import crypto, { randomUUID } from 'node:crypto';
import { prisma } from '../lib/prisma';
import { AuthUserInfo } from '../types';

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  // リクエストボディからメールアドレスとパスワード、ユーザー名を取得
  const { email, password, role ,username} = req.body;

  const passwordHash = crypto.createHash('sha256').update(password).digest('base64');

  try {
    // ユーザーを作成
    const user = await prisma.users.create({ data: { email: email, password: passwordHash, id: randomUUID(), role: role, username: username } });


    const authUserInfo: AuthUserInfo = {
      id: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
    };
    res.status(201).json(authUserInfo);
  } catch (error) {
    if (error instanceof Error) {
      if (error.constructor.name === 'PrismaClientKnownRequestError') {
        res.status(409);
        next({ message: error.message, statusCode: 409, stack: error.stack });
      } else {
        res.status(400);
        next({ message: error.message, statusCode: 400, stack: error.stack });
      }
    } else {
      next({ message: 'unknown error' });
    }
  }
};
