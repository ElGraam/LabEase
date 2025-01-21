"use server";

import { Meeting, MeetingType, ProgramType } from "@/types";

export type LabMembersSlots = {
  members: {
    id: string;
    username: string;
    email: string;
    program: ProgramType | null;
    availableSlots: {
      id: string;
      endTime: Date;
      startTime: Date;
      dayOfWeek: number;
    }[];
  }[];
};

type CreateMeetingResponse = {
  meeting: Meeting;
};

export const createMeeting = async (
  type: MeetingType,
  title: string,
  description: string,
  startTime: Date,
  endTime: Date,
  participants: string[],
): Promise<CreateMeetingResponse> => {
  const path = `${process.env.BACKEND_URL}/api/meeting/create`;

  try {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        title,
        description,
        startTime,
        endTime,
        participants: participants.map((userId) => ({ userId })),
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return {
      meeting: data,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getLabAvailableSlots = async (
  labId: string,
): Promise<LabMembersSlots> => {
  const path = `${process.env.BACKEND_URL}/api/lab/${labId}/availableslots`;

  try {
    const res = await fetch(path, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
