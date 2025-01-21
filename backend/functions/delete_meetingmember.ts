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
            return res.status(400).json({ message: "meetingIdとuserIdは必須です" });
        }

        const meetingParticipant = await prisma.meetingParticipant.findFirst({
            where: {
                meetingId: meetingId,
                userId: userId,
            },
        });

        if (!meetingParticipant) {
            return res.status(404).json({ message: "参加者が見つかりません" });
        }

        const deletedMeetingMember = await prisma.meetingParticipant.delete({
            where: {
                id: meetingParticipant.id
            },
        });

        return res.status(200).json(deletedMeetingMember);
    } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ message: error.message });
        } else {
          next(error);
        }
    }
};