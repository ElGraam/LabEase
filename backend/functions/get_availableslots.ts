import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const get_availableslot = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { userId } = req.params;
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 10;
    
    if (!userId) {
        return res.status(400).json();
    }
    
    try {
        // 過去の予約は表示しない
        const currentTime = new Date();
        const jstTime = new Date(currentTime.getTime() + (9 * 60 * 60 * 1000)); // UTC+9に変換
        const availableSlots = await prisma.availableSlot.findMany({
            where: {
                userId,
                endTime: {
                    gt: jstTime,
                },
            },
            skip: offset,
            take: limit,
        });

        const totalCount = await prisma.availableSlot.count({
            where: {
                userId,
                endTime: {
                    gt: jstTime,
                },
            },
        });

        if (!availableSlots) {
            return res.status(404).json();
        }
        const sortedSlots = [...availableSlots].sort((a, b) => 
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
        return res.status(200).json({
            availableSlots,
            totalCount,
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json();
        }
        next(error);
    }
}