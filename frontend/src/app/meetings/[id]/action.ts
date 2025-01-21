import { Meeting } from "@/types";

type responseData = {
  meetings: Meeting;
};

export const getMeeting = async (meetingId: string): Promise<responseData> => {
  const path = `${process.env.BACKEND_URL}/api/meeting/${meetingId}`;
  try {
    const res = await fetch(path, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    return { meetings: data };
  } catch (error) {
    console.error(error);
    throw error;
  }
};