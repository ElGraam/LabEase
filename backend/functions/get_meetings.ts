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
          orderBy: {
            meeting: {
              startTime: "asc",
            },
          },
          include: {
            meeting: {
              include: {
                participants: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        username: true,
                        email: true,
                        password: false,
                        role: true,
                        studentId: true,
                        program: true,
                        labId: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json();
    }

    // ミーティングデータを適切な形式に変換
    const meetings = user.meetings.map((meetingParticipant) => ({
      ...meetingParticipant.meeting,
      participants: meetingParticipant.meeting.participants,
    }));

    return res.status(200).json(meetings);
  } catch (error) {
    console.error(error);
    res.status(500).json();
    next(error);
  }
};
