import { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { Role } from '../types';

export const get_all = async (req: Request, res: Response, next: NextFunction) => {
  const { role } = req.params;

  try {
    // Roleを元にユーザーを取得するためのクエリ
    const users = await prisma.users.findMany({
      where: {
      role: role as Role,
      },
    });
    // ユーザーが存在しない場合は404を返す
    if (!users) {
      return res.status(404).json();
    }

    return res.status(200).json(users);

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json();
    }
    next(error);
  }
};
