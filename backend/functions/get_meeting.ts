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
      const user = await prisma.users.findUnique({
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
  
      if (!user) {
        return res.status(404).json();
      }

      // ユーザーの全ミーティングを抽出
      const meetings = user.meetings.map(participant => participant.meeting);
  
      return res.status(200).json(meetings);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json();
      }
      next(error);
    }
  }