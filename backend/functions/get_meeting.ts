import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const get_meeting = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { meetingId } = req.params;

  try {
    if (!meetingId) {
      return res.status(400).json({ message: "meetingIdは必須です" });
    }

    const meeting = await prisma.meeting.findUnique({
      where: {
        id: meetingId,
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
};
