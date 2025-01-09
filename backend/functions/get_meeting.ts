import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const get_meeting = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => { 
    const { userId } = req.params;
  
    try {
      if (!userId) {
        return res.status(400).json();
      }
      const meeting = await prisma.users.findUnique({
        where: {
          id: userId,
        },
        include: {
          meetings: {
            include: {
              meeting: true
            }
          }
        },
      });
  
      if (!meeting) {
        return res.status(404).json();
      }
  
      return res.status(200).json(meeting);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json();
      }
      next(error);
    }
  }