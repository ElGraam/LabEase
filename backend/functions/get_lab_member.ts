import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const get_lab_member = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { labId } = req.params;

  try {
    // まず研究室の存在確認
    const lab = await prisma.lab.findUnique({
      where: {
        id: labId,
      },
    });

    if (!lab) {
      return res.status(404).json();
    }

    // 研究室のメンバーを取得
    const users = await prisma.users.findMany({
      where: {
        labId: labId,
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json();
    }
    next(error);
  }
};
