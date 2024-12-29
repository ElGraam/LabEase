import { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const get_lab_member = async (req: Request, res: Response, next: NextFunction) => {
  const { labId } = req.params;

  try {
    // labIdを元にユーザーを取得するためのクエリ
    const users = await prisma.users.findMany({
      where: {
       labId: labId,
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
