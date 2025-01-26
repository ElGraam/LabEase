import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { randomUUID } from "crypto";

export const projectRegister = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { projectId, memberIds } = req.body;

  try {
    // プロジェクトの存在確認
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { lab: { include: { members: true } } },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 登録されるメンバーがlabに所属しているか確認
    const labMembers = project.lab.members.map((member) => member.id);
    const invalidMembers = memberIds.filter(
      (id: string) => !labMembers.includes(id),
    );

    if (invalidMembers.length > 0) {
      return res.status(400).json({
        message: "Some members are not part of the lab",
        invalidMembers,
      });
    }

    // メンバー登録
    const memberPromises = memberIds.map((userId: string) => {
      return prisma.projectMember.create({
        data: {
          id: randomUUID(),
          projectId: projectId,
          userId: userId,
        },
      });
    });

    await Promise.all(memberPromises);

    // 更新後のプロジェクト情報を返却
    const updatedProject = await prisma.project.findUnique({
      where: { id: projectId },
      include: { members: true },
    });

    return res.status(200).json(updatedProject);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500);
      next({ message: error.message, statusCode: 500, stack: error.stack });
    } else {
      next({ message: "unknown error" });
    }
  }
};
