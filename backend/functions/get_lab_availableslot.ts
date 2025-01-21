import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export const get_lab_availableslot = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const labId = req.params.labId;

  if (!labId) {
    return res.status(400).json();
  }

  const now = new Date();
  const tokyoDate = new Date(
    now.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }),
  );

  try {
    const lab_members_slots = await prisma.lab.findUnique({
      where: {
        id: labId,
      },
      select: {
        members: {
          select: {
            id: true,
            username: true,
            program: true,
            email: true,
            availableSlots: {
              where: {
                OR: [
                  {
                    AND: [
                      { startTime: { gt: tokyoDate.toISOString() } },
                      { endTime: { gt: tokyoDate.toISOString() } },
                    ],
                  },
                ],
              },
              select: {
                id: true,
                dayOfWeek: true,
                startTime: true,
                endTime: true,
              },
              orderBy: [
                {
                  startTime: "asc",
                },
              ],
            },
          },
        },
      },
    });

    if (!lab_members_slots) {
      return res.status(404).json({ error: "Lab not found" });
    }

    res.status(200).json(lab_members_slots);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json();
    }
    next(error);
  }
};
