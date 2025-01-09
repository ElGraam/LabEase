import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const get_labproject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { labId } = req.params;

  try {
    const projects = await prisma.project.findMany({
      where: {
        labId: labId,
      },
      include: {
        lab: true,
        members: true,
        milestones: true,
      },
    });

    if (!projects) {
      return res.status(404).json();
    }

    return res.status(200).json(projects);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json();
    }
    next(error);
  }
};
