import { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { randomUUID } from 'crypto';
import { Project, ProjectMilestone } from '../types';

export const projectCreate = async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, labId, milestones } = req.body;

  try {
    // プロジェクトを作成
    const project = await prisma.project.create({
      data: {
        id: randomUUID(),
        title: title,
        description: description,
        labId: labId,
      },
    });

    // マイルストーンがある場合は追加
    if (milestones && Array.isArray(milestones)) {
      const milestonePromises = milestones.map((milestone: Partial<ProjectMilestone>) => {
        return prisma.projectMilestone.create({
          data: {
            id: randomUUID(),
            projectId: project.id,
            title: milestone.title!,
            description: milestone.description,
            dueDate: milestone.dueDate!,
            status: 'PLANNED'
          }
        });
      });

      await Promise.all(milestonePromises);
    }

    // 作成したプロジェクト情報を取得して返却
    const createdProject = await prisma.project.findUnique({
      where: { id: project.id },
      include: {
        milestones: true,
        members: true
      }
    });

    return res.status(201).json(createdProject);

  } catch (error) {
    if (error instanceof Error) {
      res.status(500);
      next({ message: error.message, statusCode: 500, stack: error.stack });
    } else {
      next({ message: 'unknown error' });
    }
  }
};