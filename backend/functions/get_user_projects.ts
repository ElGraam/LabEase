import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const get_user_projects = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: {
            userId: userId
          }
        }
      },
      include: {
        lab: true,
        members: true,
      }
    });
    
    return res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};
