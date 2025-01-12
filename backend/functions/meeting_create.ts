import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { MeetingType } from '../types';

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
  next: NextFunction
) => {
  try {
    const body = req.body as CreateMeetingBody;

    // バリデーション
    if (!body.title || body.title.trim() === '') {
      throw new Error('タイトルは必須です');
    }

    if (!body.participants || body.participants.length === 0) {
      throw new Error('参加者は必須です');
    }

    const startTime = new Date(body.startTime);
    const endTime = new Date(body.endTime);

    if (endTime <= startTime) {
      throw new Error('終了時刻は開始時刻より後である必要があります');
    }

    // 参加者全員の存在確認
    const users = await prisma.users.findMany({
      where: {
        id: {
          in: body.participants.map(p => p.userId)
        }
      }
    });

    if (users.length !== body.participants.length) {
      throw new Error('存在しない参加者が含まれています');
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
              user: true
            }
          }
        }
      });

      if (meetings.length > 0) {
        const userName = users.find(u => u.id === participant.userId)?.username || participant.userId;
        throw new Error(`${userName}は指定された時間に他のミーティングが既に存在します`);
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
          create: body.participants.map(participant => ({
            userId: participant.userId,
          }))
        },
      },
      include: {
        participants: true
      }
    });

    res.status(201).send({ meeting });
  } catch (error) {
    next(error);
  }
};
