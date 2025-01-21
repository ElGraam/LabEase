import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const get_meeting = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { meetingId } = req.params;

    if (!meetingId) {
      return res.status(400).json({ message: "meetingIdは必須です" });
    }

    const meeting = await prisma.meeting.findUnique({
      where: {
        id: meetingId,
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!meeting) {
      return res.status(404).json({ message: "ミーティングが見つかりません" });
    }

    return res.status(200).json(meeting);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      next(error);
    }
  }
};
