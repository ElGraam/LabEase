import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { Role } from "../types";

export const get_all = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { role } = req.params;
  const offset = Number(req.query.offset) || 0;
  const limit = Number(req.query.limit) || 10;

  try {
    const users = await prisma.users.findMany({
      where: {
        role: role as Role,
      },
      skip: offset,
      take: limit,
    });

    const totalCount = await prisma.users.count({
      where: {
        role: role as Role,
      },
    });

    if (!users) {
      return res.status(404).json();
    }

    return res.status(200).json({
      users,
      totalCount,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json();
    }
    next(error);
  }
};
