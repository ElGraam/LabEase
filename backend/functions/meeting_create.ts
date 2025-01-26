import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { MeetingType } from "../types";

type MeetingParticipant = {
  userId: string;
};

type CreateMeetingBody = {
  type: MeetingType;
  title: string;
  description?: string;
  startTime: string | Date;
  endTime: string | Date;
  participants: MeetingParticipant[];
};

export const meeting_create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body as CreateMeetingBody;

    // バリデーション
    if (!body.title || body.title.trim() === "") {
      return res.status(400).json({ error: "Title is required" });
    }

    if (!Array.isArray(body.participants) || body.participants.length === 0) {
      return res.status(400).json({ error: "Participants are required" });
    }

    const participantIds = body.participants
      .map((p) => p.userId)
      .filter((id): id is string => typeof id === "string" && id.length > 0);

    if (participantIds.length === 0) {
      return res.status(400).json({ error: "Valid participant IDs are required" });
    }

    const startTime = new Date(body.startTime);
    const endTime = new Date(body.endTime);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    if (endTime <= startTime) {
      return res
        .status(400)
        .json({ error: "End time must be after start time" });
    }

    // 参加者全員の存在確認
    const users = await prisma.users.findMany({
      where: {
        id: {
          in: participantIds,
        },
      },
    });

    if (users.length !== body.participants.length) {
      throw new Error("Some participants do not exist");
    }

    // 全参加者の予定重複チェック
    for (const participant of body.participants) {
      const meetings = await prisma.meeting.findMany({
        where: {
          participants: {
            some: {
              userId: participant.userId,
            },
          },
          OR: [
            {
              startTime: {
                lte: startTime,
              },
              endTime: {
                gte: startTime,
              },
            },
            {
              startTime: {
                lte: endTime,
              },
              endTime: {
                gte: endTime,
              },
            },
            {
              startTime: {
                gte: startTime,
              },
              endTime: {
                lte: endTime,
              },
            },
          ],
        },
        include: {
          participants: {
            include: {
              user: true,
            },
          },
        },
      });

      if (meetings.length > 0) {
        const userName =
          users.find((u) => u.id === participant.userId)?.username ||
          participant.userId;
        throw new Error(
          `${userName} already has a meeting scheduled at the specified time`,
        );
      }
    }

    // ミーティング作成
    const meeting = await prisma.meeting.create({
      data: {
        type: body.type,
        title: body.title,
        description: body.description,
        startTime: startTime,
        endTime: endTime,
        participants: {
          create: body.participants.map((participant) => ({
            userId: participant.userId,
          })),
        },
      },
      include: {
        participants: true,
      },
    });

    res.status(201).send({ meeting });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500);
      next({ message: error.message, statusCode: 500, stack: error.stack });
    } else {
      next({ message: "Unknown error" });
    }
  }
};
