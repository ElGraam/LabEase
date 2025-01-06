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
        const availableSlots = await prisma.availableSlot.findMany({
            where: {
                userId,
            },
            skip: offset,
            take: limit,
        });

        const totalCount = await prisma.availableSlot.count({
            where: {
                userId,
            },
        });

        if (!availableSlots) {
            return res.status(404).json();
        }

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