import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const lab_register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { studentId, labId } = req.body;

  try {
    // studentIdとlabIdを元に、ユーザーとlabを取得
    const user = await prisma.users.findUnique({
      where: {
        studentId: studentId,
      },
    });
    const lab = await prisma.lab.findUnique({
      where: {
        id: labId,
      },
    });

    // If the user does not exist, return 404
    if (!user) {
      return res.status(404).json();
    }
    // If the labId does not exist, return 404
    if (!lab) {
      return res.status(404).json();
    }

    // ユーザー情報を更新
    const updatedUser = await prisma.users.update({
      where: {
        studentId: studentId,
      },
      data: {
        labId: labId,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json();
    }
    next(error);
  }
};
