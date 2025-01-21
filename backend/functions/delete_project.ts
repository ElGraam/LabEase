import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const delete_project = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { projectId } = req.params;
    if (!projectId) {
      return res.status(400).json();
    }
    const existingProject = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });
    if (!existingProject) {
      return res.status(404).json();
    }
    const project = await prisma.project.delete({
      where: {
        id: projectId,
      },
    });
    return res.status(200).json(project);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json();
    }
    next(error);
  }
};
