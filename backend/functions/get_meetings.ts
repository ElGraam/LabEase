import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const get_meetings = async (
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
              meeting: {
                include: {
                  participants: {
                    include: {
                      user: true
                    }
                  }
                }
              }
            }
          }
        }
      });
  
      if (!user) {
        return res.status(404).json();
      }

      // ユーザーの全ミーティングを抽出し、パスワードを除外
      const meetings = user.meetings.map(participant => ({
        ...participant.meeting,
        participants: participant.meeting.participants.map(p => ({
          ...p,
          user: {
            ...p.user,
            password: undefined
          }
        }))
      }));

      return res.status(200).json(meetings);
    } catch (error) {
      console.error(error);
      res.status(500).json();
      next(error);
    }
  }