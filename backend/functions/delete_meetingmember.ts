import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const delete_meetingmember = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { meetingId, userId } = req.params;
    if (!meetingId || !userId) {
      return res
        .status(400)
        .json({ message: "meetingId and userId are required" });
    }

    const meetingParticipant = await prisma.meetingParticipant.findFirst({
      where: {
        meetingId: meetingId,
        userId: userId,
      },
    });

    if (!meetingParticipant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    const deletedMeetingMember = await prisma.meetingParticipant.delete({
      where: {
        id: meetingParticipant.id,
      },
    });

    return res.status(200).json({ message: "Meeting participant deleted" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      next(error);
    }
  }
};
