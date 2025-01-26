import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const delete_meeting = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { meetingId } = req.params;

    if (!meetingId) {
      return res.status(400).json({ message: "meetingId is required" });
    }
    const meeting = await prisma.meeting.delete({
      where: {
        id: meetingId,
      },
    });
    return res.status(200).json(meeting);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
    next(error);
  }
};
