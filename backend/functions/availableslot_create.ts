import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const availableSlots_create = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
    const { userId } = req.params;
    const { dayOfWeek, startTime, endTime } = req.body;
    if (!userId) {
        return res.status(400).json();
    }       
    if (!dayOfWeek || dayOfWeek < 0 || dayOfWeek > 6) {
        return res.status(400).json();
    }
    if (!startTime || !endTime) {
        return res.status(400).json();
    }
    if (startTime >= endTime) {
        return res.status(400).json();
    }
    const startTimeUTC = new Date(startTime).getTime();
    const endTimeUTC = new Date(endTime).getTime();
    const currentTimeUTC = new Date().getTime();
    if (startTimeUTC < currentTimeUTC || endTimeUTC < currentTimeUTC) {
        return res.status(400).json();
    }
    // 予約済みのスロットと重複しているかチェック
    const overlappingSlots = await prisma.availableSlot.findMany({
        where: {
            dayOfWeek,
            OR: [
                {
                    startTime: {
                        lte: endTime
                    },
                    endTime: {
                        gte: startTime
                    }
                }
            ]
        }
    });
    if (overlappingSlots.length > 0) {
        return res.status(400).json();
    }
    const startHour = new Date(startTime).getHours();
    const endHour = new Date(endTime).getHours();
    if ((startHour >= 22 || startHour < 5) || (endHour >= 22 || endHour < 5)) {
        return res.status(400).json();
    }
    const availableSlots = await prisma.availableSlot.create({
        data: {
            userId,
            dayOfWeek,
            startTime,
            endTime,
        },
    });
    return res.status(201).json(availableSlots);
} catch (error) {
    if (error instanceof Error) {
      res.status(500).json();
    }
    next(error);
  }
};