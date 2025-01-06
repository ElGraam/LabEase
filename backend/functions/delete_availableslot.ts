import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const delete_availableslot = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { availableSlotId } = req.params;

    if (!availableSlotId) {
        return res.status(400).json();
    }

    try {
        const availableSlot = await prisma.availableSlot.delete({
            where: {
                id: availableSlotId,
            },
        });

        if (!availableSlot) {
            return res.status(404).json();
        }

        return res.status(200).json(availableSlot);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json();
        }
        next(error);
    }
}