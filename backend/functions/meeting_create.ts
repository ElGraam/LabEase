import {prisma} from "../lib/prisma";
import {NextFunction, Request, Response} from "express";

export const meeting_create = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const {title, description,type, startTime, endTime, participants} = req.body;

    try {
        const meeting = await prisma.meeting.create({
            data: {
                title,
                description,
                type,
                startTime,
                endTime,
                participants: {
                    create: participants
                }
            }
        });

        return res.status(200).json(meeting);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json();
        }
        next(error);
    }
}
