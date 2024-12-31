import e, { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { Users, Role, ProgramType, Project, Meeting} from "../types";

export const updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { userId } = req.params;
    const {
        email,
        program,
        studentId,
        role,
        studentProfile,
        assignedProjects,
        meetings,
    } = req.body;
    
    try {
        const existingUser = await prisma.users.findUnique({
            where: { id: userId },
            include: {
                studentProfile: true,
                assignedProjects: true,
                meetings: true,
            }
        });

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data: {
                email,
                program,
                studentId,
                role,
                studentProfile: studentProfile ? {
                    upsert: {
                        create: {
                            ...studentProfile,
                        },
                        update: {
                            ...studentProfile,
                        }
                    }
                } : undefined,
                assignedProjects: assignedProjects ? {
                    upsert: assignedProjects.map((project: Project) => ({
                        where: { id: project.id },
                        create: {
                            ...project,
                        },
                        update: {
                            ...project,
                        },
                    }))
                } : undefined,
                meetings: meetings ? {
                    upsert: meetings.map((meeting: Meeting) => ({
                        where: { id: meeting.id },
                        create: {
                            ...meeting,
                        },
                        update: {
                            ...meeting,
                        },
                    }))
                } : undefined,
            },
            include: {
                studentProfile: true,
                assignedProjects: true,
                meetings: true,
            }
        });

        return res.status(200).json(updatedUser);
    } catch (error) {
        if (error instanceof Error) {
        res.status(500);
        next({
            message: error.message,
            statusCode: 500,
            stack: error.stack,
        });
        } else {
        next({ message: "不明なエラーが発生しました" });
        }
    }
}