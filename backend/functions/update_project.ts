import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const update_project = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { projectId } = req.params; // projectidを取得
  const { title, description, milestones } = req.body; // リクエストボディからデータを取得

  try {
    // 現在のプロジェクトを取得
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        milestones: true,
      },
    });

    // プロジェクトが存在しない場合は404を返す
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    let projectChanged = false;

    // プロジェクトの変更を確認
    if (
      existingProject.title !== title ||
      existingProject.description !== description
    ) {
      projectChanged = true;
    }

    // マイルストーンの変更を確認
    const milestonesChanged =
      JSON.stringify(existingProject.milestones) !== JSON.stringify(milestones);

    if (!projectChanged && !milestonesChanged) {
      return res.status(200).json({ message: "No changes detected" });
    }

    // トランザクションを使用してプロジェクトとマイルストーンを更新
    const updatedProject = await prisma.$transaction(async (prisma) => {
      if (projectChanged) {
        await prisma.project.update({
          where: { id: projectId },
          data: {
            title,
            description,
          },
        });
      }

      if (milestonesChanged) {
        // 既存のマイルストーンを削除
        await prisma.projectMilestone.deleteMany({
          where: { projectId: projectId },
        });

        // 新しいマイルストーンを作成
        const newMilestones = milestones.map((milestone: any) => ({
          ...milestone,
          projectId: projectId,
        }));

        await prisma.projectMilestone.createMany({
          data: newMilestones,
        });
      }

      // 更新後のプロジェクトを取得
      return prisma.project.findUnique({
        where: {
          id: projectId,
        },
        include: {
          members: {
            include: {
              user: true,
            },
          },
          milestones: true,
        },
      });
    });

    return res.status(200).json(updatedProject);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      next(error);
    }
  }
};
