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
