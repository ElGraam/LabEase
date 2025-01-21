import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const delete_projectmember = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { projectId, userId } = req.params;
    if (!projectId || !userId) {
      return res.status(400).json();
    }
    const projectMember = await prisma.projectMember.findFirst({
      where: {
        projectId: projectId,
        userId: userId,
      },
    });
    if (!projectMember) {
      return res.status(404).json("メンバーが見つかりません");
    }
    const deleteProjectMember = await prisma.projectMember.delete({
      where: {
        id: projectMember.id,
      },
    });
    if (!deleteProjectMember) {
      return res.status(404).json();
    }
    return res.status(200).json(deleteProjectMember);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      next(error);
    }
  }
};
