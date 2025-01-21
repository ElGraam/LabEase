"use server";

import { Meeting } from "@/types";

type responseData = {
  meetings: Meeting;
};

type deleteMeetingMemberResponse = {
  message: string;
};

export const getMeeting = async (meetingId: string): Promise<responseData> => {
  const path = `${process.env.BACKEND_URL}/api/meeting/${meetingId}`;
  try {
    const res = await fetch(path, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return { meetings: data };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteMeetingMember = async (meetingId: string, userId: string): Promise<deleteMeetingMemberResponse> => {
  const path = `${process.env.BACKEND_URL}/api/meeting/${meetingId}/member/${userId}`;
  try {
    const res = await fetch(path, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    return { message: data.message };
  } catch (error) {
    console.error(error);
    throw error;
  }
};