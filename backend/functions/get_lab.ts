import { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const get_lab = async (req: Request, res: Response, next: NextFunction) => {
  const { labId } = req.params;

  try {
    //labIdを元に、labを取得
    const lab = await prisma.lab.findUnique({
      where: {
            id: labId,
        },
        include: {
            members: true,
            projects: true,
      },
    });
    // ユーザーが存在しない場合は404を返す
    if (!lab) {
      return res.status(404).json();
    }
    // labIdのprofessorIdを元に、教授を取得
    const professor = await prisma.users.findUnique({
      where: {
        id: lab.professorId,
      },
    });
    if (!professor) {
      return res.status(404).json();
    }
    professor.password = '';

    return res.status(200).json({ ...lab, professor });

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json();
    }
    next(error);
  }
};