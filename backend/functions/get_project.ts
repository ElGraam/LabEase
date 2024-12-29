import { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const get_project = async (req: Request, res: Response, next: NextFunction) => {
  const { projectid } = req.params; // projectidを取得

  try {
    // projectidを元に、projectを取得
    const project = await prisma.project.findUnique({
      where: {
        id: projectid, 
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

    // projectが存在しない場合は404を返す
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.status(200).json(project);

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      next(error);
    }
  }
};