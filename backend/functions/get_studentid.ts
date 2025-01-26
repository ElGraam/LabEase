import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const get_student_basedId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { studentId } = req.params;

  try {
    // studentId元に、ユーザーを取得
    const user = await prisma.users.findUnique({
      where: {
        studentId: studentId,
      },
    });

    // If the user does not exist, return 404
    if (!user) {
      return res.status(404).json();
    }

    return res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json();
    }
    next(error);
  }
};
