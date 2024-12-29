import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { ProjectMilestoneStatus } from "@prisma/client";

export const updateProjectMilestone = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { milestoneId, title, description, dueDate, status } = req.body;

  try {
    // マイルストーンの存在確認
    const existingMilestone = await prisma.projectMilestone.findUnique({
      where: { id: milestoneId },
    });

    if (!existingMilestone) {
      return res
        .status(404)
        .json({ message: "マイルストーンが見つかりません" });
    }

    // マイルストーンの更新
    const updatedMilestone = await prisma.projectMilestone.update({
      where: { id: milestoneId },
      data: {
        title: title || existingMilestone.title,
        description: description || existingMilestone.description,
        dueDate: dueDate ? new Date(dueDate) : existingMilestone.dueDate,
        status: (status as ProjectMilestoneStatus) || existingMilestone.status,
        completionDate:
          status === ProjectMilestoneStatus.COMPLETED ? new Date() : null,
      },
    });

    // 更新したマイルストーンをプロジェクト情報と共に取得
    const projectWithMilestones = await prisma.project.findUnique({
      where: { id: updatedMilestone.projectId },
      include: {
        milestones: true,
      },
    });

    return res.status(200).json(projectWithMilestones);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500);
      next({
        message: error.message,
        statusCode: 500,
        stack: error.stack,
      });
    } else {
      next({ message: "不明なエラーが発生しました" });
    }
  }
};
